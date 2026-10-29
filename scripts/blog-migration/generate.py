"""Generate static articles from downloaded source HTML; verify visible wording."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
import hashlib
from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import urljoin, urlsplit, unquote, quote
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
CACHE = Path('/tmp/eapl-blog-migration')
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())

class Node:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []
    def find(self, predicate):
        if predicate(self): return self
        for child in self.children:
            if isinstance(child, Node):
                found = child.find(predicate)
                if found: return found
    def text(self):
        return ''.join(c.text() if isinstance(c, Node) else c for c in self.children)

class Parser(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = Node(); self.stack = [self.root]; self.feed(html)
    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs); self.stack[-1].children.append(node)
        if tag not in VOID: self.stack.append(node)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID: self.handle_endtag(tag)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]; break
    def handle_data(self, data): self.stack[-1].children.append(data)

def has_class(name):
    return lambda node: name in node.attrs.get('class', '').split()

def normalize(text): return re.sub(r'\s+', ' ', text).strip()

def asset_url(source, path):
    url = urljoin(source, path)
    parts = urlsplit(url)
    return parts._replace(path=quote(unquote(parts.path), safe='/'), fragment='').geturl()

image_jobs = {}
def local_image(source, node, slug):
    url = asset_url(source, node.attrs.get('src', ''))
    suffix = Path(unquote(urlsplit(url).path)).suffix.lower()
    if suffix not in {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'}:
        raise ValueError(f'Unsupported image URL: {url}')
    digest = hashlib.sha256(url.encode()).hexdigest()[:12]
    local = f'/images/blog/{slug}-{digest}{suffix}'
    # Reuse shared image files across articles.
    local = image_jobs.setdefault(url, local)
    return local

def serialize(node, source, slug):
    if isinstance(node, str): return escape(node)
    if node.tag in {'script', 'style', 'noscript'}: return ''
    contents = ''.join(serialize(c, source, slug) for c in node.children)
    if not node.tag: return contents
    tag = node.tag
    if tag == 'h1': tag = 'h2'
    attrs = {}
    for key, value in node.attrs.items():
        if key in {'href', 'title', 'alt', 'colspan', 'rowspan', 'scope', 'start', 'reversed', 'type'} and value is not None:
            if key == 'href':
                if value.lower().lstrip().startswith(('javascript:', 'data:')): continue
                value = urljoin(source, value) if not value.startswith('#') else value
            attrs[key] = value
    if tag == 'img':
        attrs.update(src=local_image(source, node, slug), alt=node.attrs.get('alt', ''), loading='lazy', decoding='async')
    attributes = ''.join(f' {key}="{escape(value, quote=True)}"' for key, value in attrs.items())
    html = f'<{tag}{attributes}>' + ('' if tag in VOID else contents + f'</{tag}>')
    if tag == 'table': html = '<div class="article-table-scroll">' + html + '</div>'
    return html

def download_image(job):
    url, local = job
    file = ROOT / 'public' / local.lstrip('/')
    if not file.exists():
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request, timeout=40) as response:
            if not response.headers.get('Content-Type', '').startswith('image/'):
                raise ValueError(f'Not an image: {url}')
            file.write_bytes(response.read())
    return local

def generate():
    downloads = json.loads((CACHE / 'downloads.json').read_text())
    template = (ROOT / 'blog-pages/top-10-battery-manufacturers-india.html').read_text()
    old_title = 'Top 10 Battery Manufacturers in India'
    old_path = '/blog/top-10-battery-manufacturers-india'
    (ROOT / 'blog-pages').mkdir(exist_ok=True)
    articles, failures = [], []
    for entry in downloads:
        if entry['status'] != 'downloaded':
            failures.append(entry); continue
        tree = Parser(Path(entry['cache']).read_text()).root
        wrapper = tree.find(has_class('news-detail-wrapper'))
        title_node = wrapper.find(lambda n: n.tag == 'h1')
        date_node = wrapper.find(has_class('news-date'))
        image_container = wrapper.find(has_class('detail-image'))
        cover = image_container.find(lambda n: n.tag == 'img') if image_container else None
        body = Node()
        body.children = [c for c in wrapper.children if c is not title_node and c is not date_node and c is not image_container]
        title, date = title_node.text().strip(), date_node.text().strip() if date_node else ''
        slug = entry['path'].split('/')[-1]
        rendered = serialize(body, entry['source'], slug)
        assert normalize(body.text()) == normalize(Parser(rendered).root.text()), f'Content changed: {slug}'
        assert len(normalize(body.text())) > 100, f'Empty article: {slug}'
        page = template.replace(old_title, escape(title)).replace(old_path, entry['path'])
        page = re.sub(r'<div class="article-body">.*?</div>\s*<a class="article-back"', lambda m: '<div class="article-body">' + rendered + '</div>\n          <a class="article-back"', page, flags=re.S)
        cover_html = ''
        if cover:
            cover_html = f'<img class="article-cover" src="{local_image(entry["source"], cover, slug)}" alt="{escape(cover.attrs.get("alt") or title, quote=True)}" width="1280" height="720" fetchpriority="high" />'
        page = re.sub(r'<img class="article-cover"[^>]*>', lambda m: cover_html, page)
        try: iso = datetime.strptime(date, '%b, %d %Y').date().isoformat()
        except ValueError: iso = ''
        date_html = f'<time datetime="{iso}">{escape(date)}</time>' if iso else f'<span class="article-date">{escape(date)}</span>' if date else ''
        page = re.sub(r'<time\b[^>]*>.*?</time>', lambda m: date_html, page)
        description = tree.find(lambda n: n.tag == 'meta' and n.attrs.get('name') == 'description')
        page = re.sub(r'<meta name="description"[^>]*>', lambda m: f'<meta name="description" content="{escape(description.attrs.get("content", ""), quote=True)}" />' if description else '', page)
        file = f'blog-pages/{slug}.html'
        (ROOT / file).write_text(page)
        articles.append({'path': entry['path'], 'file': file, 'title': title, 'date': date, 'source': entry['source'], 'sources': entry['sources'], 'rows': entry['rows'], 'image': local_image(entry['source'], cover, slug) if cover else None, 'contentVerified': True})
    with ThreadPoolExecutor(max_workers=6) as pool:
        image_results = list(pool.map(download_image, image_jobs.items()))
    (ROOT / 'data/blog-articles.json').write_text(json.dumps(articles, ensure_ascii=False, indent=2) + '\n')
    (ROOT / 'data/blog-migration-report.json').write_text(json.dumps({'articles': len(articles), 'images': len(image_results), 'unresolved': failures}, ensure_ascii=False, indent=2) + '\n')
    listing = (ROOT / 'blog.html').read_text()
    cards = []
    for article in articles:
        image = f'<img src="{article["image"]}" alt="{escape(article["title"], quote=True)}" width="1280" height="720" loading="lazy" />' if article['image'] else ''
        cards.append(f'''<article class="blog-card">
              {image}
              <div><p class="blog-meta"><span>{escape(article['date'])}</span></p><h3>{escape(article['title'])}</h3><a href="{article['path']}">Read More <img src="/images/blog/read-more.svg" alt="" /></a></div>
            </article>''')
    listing = re.sub(r'<div class="blog-grid">.*?</div>\s*</section>', lambda m: '<div class="blog-grid">\n' + '\n'.join(cards) + '\n          </div>\n        </section>', listing, count=1, flags=re.S)
    (ROOT / 'blog.html').write_text(listing)
    print(json.dumps({'articles': len(articles), 'images': len(image_results), 'unresolved': len(failures)}))

if __name__ == '__main__': generate()
