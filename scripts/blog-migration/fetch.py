"""Download the user-provided source pages without executing their contents."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
CACHE = Path('/tmp/eapl-blog-migration')
CACHE.mkdir(exist_ok=True)

def fetch(entry):
    result = dict(entry)
    errors = []
    for url in entry['sources']:
        file = CACHE / (hashlib.sha256(url.encode()).hexdigest() + '.html')
        try:
            if not file.exists():
                request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(request, timeout=40) as response:
                    content = response.read()
                    file.write_bytes(content)
            content = file.read_text(errors='replace')
            if 'news-detail-wrapper' not in content:
                errors.append(f'{url}: no article container')
                continue
            result.update(source=url, cache=str(file), status='downloaded')
            break
        except Exception as error:
            errors.append(f'{url}: {error}')
    else:
        result.update(status='failed', errors=errors)
    print(result['status'], entry['path'], flush=True)
    return result

if __name__ == '__main__':
    entries = json.loads((ROOT / 'data/blog-migration-map.json').read_text())
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        results = list(pool.map(fetch, entries))
    (CACHE / 'downloads.json').write_text(json.dumps(results, ensure_ascii=False, indent=2))
    print(json.dumps({'downloaded': sum(x['status'] == 'downloaded' for x in results), 'failed': sum(x['status'] == 'failed' for x in results)}))
