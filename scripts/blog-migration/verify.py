"""Check generated pages against source text and the production route artifacts."""
import json
from pathlib import Path
import sys
from generate import ROOT, CACHE, Node, Parser, has_class, normalize

articles = json.loads((ROOT / 'data/blog-articles.json').read_text())
sources = {entry['path']: entry for entry in json.loads((CACHE / 'downloads.json').read_text())}
images = set()
for article in articles:
    source = Parser(Path(sources[article['path']]['cache']).read_text()).root
    wrapper = source.find(has_class('news-detail-wrapper'))
    title = wrapper.find(lambda node: node.tag == 'h1')
    date = wrapper.find(has_class('news-date'))
    cover = wrapper.find(has_class('detail-image'))
    body = Node()
    body.children = [node for node in wrapper.children if node not in (title, date, cover)]
    page = Parser((ROOT / article['file']).read_text()).root
    assert normalize(title.text()) == normalize(page.find(lambda node: node.tag == 'h1').text()), article['path']
    assert normalize(body.text()) == normalize(page.find(has_class('article-body')).text()), article['path']
    if date:
        assert normalize(date.text()) == normalize(page.find(lambda node: node.tag == 'time' or has_class('article-date')(node)).text()), article['path']
    built = ROOT / 'dist' / article['path'].lstrip('/') / 'index.html'
    assert built.exists(), article['path']
    assert 'data-layout-header' in built.read_text() and 'data-layout-footer' in built.read_text(), article['path']
    def check_images(node):
        if not isinstance(node, Node): return
        if node.tag == 'img':
            src = node.attrs['src']
            if src.startswith('/images/blog/'):
                assert (ROOT / 'public' / src.lstrip('/')).stat().st_size > 0, src
                images.add(src)
        for child in node.children: check_images(child)
    check_images(page)

if '--http' in sys.argv:
    import concurrent.futures
    import urllib.request
    base = sys.argv[sys.argv.index('--http') + 1].rstrip('/')
    def check_route(article):
        with urllib.request.urlopen(base + article['path'], timeout=20) as response:
            assert response.status == 200
            assert article['title'] in Parser(response.read().decode()).root.text()
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        list(pool.map(check_route, articles))

print(f'Verified {len(articles)} article titles, publication dates, full body text, built routes, shared layout slots, and {len(images)} image files.')
