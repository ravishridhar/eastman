"""Keep the Resources overview in sync with the migrated resource manifests."""
from pathlib import Path
from datetime import datetime
from html import escape
import json,re
ROOT=Path(__file__).resolve().parents[1]
def load(name):return json.loads((ROOT/'data'/name).read_text())
def text(s):return escape(s,quote=True)
def external(url):return f'href="{text(url)}" target="_blank" rel="noopener noreferrer"'
arrow='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14M12 5l7 7-7 7" /></svg>'
open_icon='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>'
play='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true"><path d="m9 5 11 7-11 7z" /></svg>'
media,blogs,papers,videos,social=load('media-centre.json'),load('blog-articles.json'),load('white-papers.json'),load('videos.json'),load('social-feed.json')
s=(ROOT/'resources.html').read_text()
def replace_section(name,markup):
 global s
 pattern=r'<section class="resources-section resources-'+name+r'"[^>]*>.*?</section>'
 s,n=re.subn(pattern,lambda m:markup,s,count=1,flags=re.S)
 assert n==1,name
def view_all(url,light=False):return f'<a class="resources-view-all'+(' resources-view-all--light' if light else '')+f'" href="{url}">View All {arrow}</a>'
def media_card(a):return f'<a class="resources-news-card" {external(a["url"])}><img src="{a["image"]}" alt="{text(a["alt"] or a["title"])}" loading="lazy" /><div><p class="resources-meta">'+(f'<b>{text(a["publisher"])}</b><i></i>' if a['publisher'] else '')+f'<span>{text(a["date"])}</span></p><h3>{text(a["title"])}</h3><span class="resources-card-arrow">{open_icon}</span></div></a>'
replace_section('media','<section class="resources-section resources-media" id="section2"><h2>Media &amp; News</h2><div class="resources-section-heading"><h3>Press Releases</h3><a href="/media-news#media-press-releases">View All '+arrow+'</a></div><div class="resources-news-grid">'+''.join(media_card(a) for a in media['press'][:3])+'</div><div class="resources-section-heading"><h3>In the News</h3><a href="/media-news#media-news">View All '+arrow+'</a></div><div class="resources-news-grid">'+''.join(media_card(a) for a in media['news'][:3])+'</div></section>')

def para(s):return escape(s).replace('\n','<br />')
social_cards=[]
for a in social:
 social_cards.append(f'<article class="is-{a["platform"]}"><header><span><i><img src="{a["icon"]}" alt="" /></i><b>{text(a["name"])}<small>{text(a["account"])}</small></b></span><a {external(a["post"])} aria-label="Open {text(a["name"])} post">{open_icon}</a></header><blockquote>'+''.join('<p>'+para(p)+'</p>' for p in a['paragraphs'])+f'</blockquote><a {external(a["profile"])}>View all posts {arrow}</a></article>')
replace_section('social','<section class="resources-section resources-social" id="section3"><h2>Social Feed</h2><div class="resources-social-grid resources-social-classic">'+''.join(social_cards)+'</div>'+view_all('/social-feed')+'</section>')
def date(a):
 try:return datetime.strptime(a['date'],'%b, %d %Y')
 except ValueError:return datetime.min
recent=sorted(blogs,key=date,reverse=True)[:8]
blog_cards=[f'<a class="resources-blog-card" href="{a["path"]}"><img src="{a["image"]}" alt="{text(a["title"])}" loading="lazy" /><div><span>{text(a["date"])}</span><h3>{text(a["title"])}</h3><span class="resources-card-arrow">{arrow}</span></div></a>' for a in recent]
replace_section('blogs','<section class="resources-section resources-blogs" id="section4"><h2>Blogs</h2><p class="resources-subtitle">Recent from Eastman</p><div class="resources-blog-grid">'+''.join(blog_cards)+'</div>'+view_all('/blog')+'</section>')
paper_cards=[]
for a in papers['papers'][:4]:
 paper_cards.append(f'<article class="resources-paper-preview"><a class="resources-paper-cover" {external(a["pdf"])} aria-label="Open PDF: {text(a["title"])}"><img src="{a["image"]}" alt="{text(a["title"])}" width="600" height="800" loading="lazy" /></a><div><h3><a {external(a["pdf"])}>{text(a["title"])}</a></h3><a class="resources-paper-download" {external(a["pdf"])}><img src="/images/resources/download.svg" alt="" />PDF</a></div></article>')
replace_section('papers','<section class="resources-section resources-papers" id="section5"><h2>White Papers</h2><div class="resources-paper-grid">'+''.join(paper_cards)+'</div>'+view_all('/white-papers',True)+'</section>')
video_cards=[]
for group in videos['groups']:
 if group['key']!='product':continue
 for a in group['items']:
  video_cards.append(f'<article><a class="resources-video-link" {external(a["watch"])} data-video-play data-video-embed="{text(a["embed"])}" data-video-title="{text(a["title"])}"><div class="resources-video-media"><img src="{a["image"]}" alt="{text(a["title"])}" width="480" height="360" loading="lazy" /><i>{play}</i></div><div class="resources-video-copy"><b>{text(group["title"])}</b><h3>{text(a["title"])}</h3></div></a></article>')
video_page=(ROOT/'videos.html').read_text()
dialog=re.search(r'<dialog class="video-player-dialog".*?</dialog>',video_page,re.S)[0]
replace_section('videos','<section class="resources-section resources-videos" id="section6" data-video-library><h2>Videos</h2><div class="resources-video-grid">'+''.join(video_cards)+'</div>'+view_all('/videos')+dialog+'</section>')
s=s.replace('<span>Home</span>','<a href="/">Home</a>',1)
(ROOT/'resources.html').write_text(s)

print('Updated Resources overview previews. Standalone resource-page layouts are preserved.')
