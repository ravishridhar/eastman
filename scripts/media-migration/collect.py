"""Collect the public Media Centre content without changing its wording."""
from pathlib import Path
import sys,json,re,hashlib
from urllib.parse import urljoin,urlsplit,urlunsplit,quote,unquote
import urllib.request
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'blog-migration'))
from generate import Parser,Node
ROOT=Path(__file__).resolve().parents[2]
BASE='https://eaplworld.com/media-centre'

def walk(node):
 if isinstance(node,Node):
  yield node
  for child in node.children:yield from walk(child)
def has(cls):return lambda n:cls in n.attrs.get('class','').split()
def absolute(url):
 p=urlsplit(urljoin(BASE,url))
 return urlunsplit((p.scheme,p.netloc,quote(unquote(p.path),safe='/'),p.query,p.fragment))
def parse_card(node):
 title=node.find(lambda n:n.tag=='h3')
 image=node.find(lambda n:n.tag=='img')
 link=node.find(lambda n:n.tag=='a' and n.attrs.get('href'))
 assert title and image and link
 category=node.find(has('category'))
 meta=[n.text().strip() for n in walk(category) if n.tag=='li'] if category else []
 return {'title':title.text().strip(),'imageUrl':absolute(image.attrs['src']),'alt':image.attrs.get('alt',''),'url':absolute(link.attrs['href']),'publisher':meta[0] if meta else '', 'date':meta[1] if len(meta)>1 else ''}
def collect():
 source=Parser(Path('/tmp/eapl-live-media-centre.html').read_text()).root
 latest=source.find(has('block-news'))
 latest_cards=[]
 for link in walk(latest):
  if link.tag=='a' and link.find(lambda n:n.tag=='h3'):latest_cards.append(parse_card(link))
 groups={}
 for key,name in [('tab-1','news'),('tab-2','press'),('tab-4','articles')]:
  tab=source.find(lambda n:n.attrs.get('id')==key)
  groups[name]=[parse_card(n) for n in walk(tab) if has('col-md-4')(n)]
 seen={BASE};tree=source
 while True:
  tab=tree.find(lambda n:n.attrs.get('id')=='tab-1')
  link=tab.find(lambda n:n.tag=='a' and n.attrs.get('rel')=='next')
  if not link:break
  url=absolute(link.attrs['href'])
  if url in seen:raise ValueError('Repeated source pagination URL')
  seen.add(url)
  cache=Path('/tmp')/('eapl-media-'+hashlib.sha256(url.encode()).hexdigest()+'.html')
  if not cache.exists():
   with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=40) as response:cache.write_bytes(response.read())
  tree=Parser(cache.read_text()).root
  next_tab=tree.find(lambda n:n.attrs.get('id')=='tab-1')
  cards=[parse_card(n) for n in walk(next_tab) if has('col-md-4')(n)]
  groups['news']+=cards
  print('Fetched',url,'news items:',len(cards),flush=True)
  if len(seen)>50:raise ValueError('Unexpectedly large pagination')
 # Preserve different source entries even when they share a headline or destination.
 hero=source.find(has('block-top-banner'))
 style=hero.find(lambda n:'background-image' in n.attrs.get('style','')).attrs['style']
 hero_url=absolute(re.search(r'url\((.*?)\)',style)[1])
 jobs={}
 for card in latest_cards+sum(groups.values(),[]):
  url=card['imageUrl'];suffix=Path(urlsplit(url).path).suffix.lower()
  local=jobs.setdefault(url,'/images/media-news/live/'+hashlib.sha256(url.encode()).hexdigest()[:14]+suffix)
  card['image']=local
 jobs[hero_url]='/images/media-news/live/hero.jpg'
 result={'source':BASE,'heroTitle':hero.find(lambda n:n.tag=='h1').text().strip(),'hero':'/images/media-news/live/hero.jpg','latest':latest_cards,**groups}
 (ROOT/'data/media-centre.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
 Path('/tmp/eapl-media-images.json').write_text(json.dumps(jobs,indent=2))
 print(json.dumps({k:len(v) for k,v in result.items() if isinstance(v,list)}),flush=True)
if __name__=='__main__':collect()
