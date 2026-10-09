import asyncio, sys, os, threading, http.server, functools, base64, json, io
from playwright.async_api import async_playwright
DIST = os.path.join(os.path.dirname(__file__), '..', 'dist')
CH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
FLAGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required']
def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIST)
    h.log_message = lambda *a: None
    s = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); threading.Thread(target=s.serve_forever, daemon=True).start(); return s
async def open_film(p, page_name='untitled-found-footage.html'):
    srv = serve(); b = await p.chromium.launch(executable_path=CH, args=FLAGS)
    pg = await b.new_page(viewport={'width': 1400, 'height': 1300}); logs = []
    pg.on('console', lambda m: logs.append(f'[{m.type}] {m.text}')); pg.on('pageerror', lambda e: logs.append(f'[pageerror] {e}'))
    await pg.goto(f'http://127.0.0.1:{srv.server_address[1]}/{page_name}')
    try: await pg.wait_for_function('window.__film && window.__film.ready', timeout=180000)
    except Exception as e: print('NOT READY', e)
    return b, pg, logs
async def frame(pg, t, opts='{}', path=None):
    d = await pg.evaluate(f'(() => {{ window.__film.renderAt({t}, {opts}); return window.__film.canvas.toDataURL("image/png"); }})()')
    raw = base64.b64decode(d.split(',')[1])
    if path: open(path, 'wb').write(raw)
    return raw
