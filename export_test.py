import asyncio, sys, os, json, time, base64
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from harness import *
HOOK = """(() => { window.__saved = []; window.__saveHook = async (n, b) => { const buf = new Uint8Array(await b.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 32768) s += String.fromCharCode.apply(null, buf.subarray(i, i + 32768)); window.__saved.push({n, d: btoa(s)}); }; })()"""
async def grab(pg, path):
    r = json.loads(await pg.evaluate('JSON.stringify(window.__saved.pop())')); open(path, 'wb').write(base64.b64decode(r['d'])); return r['n']
async def main():
    async with async_playwright() as p:
        b, pg, logs = await open_film(p); await pg.evaluate(HOOK)
        t = time.time(); await pg.evaluate('(() => { for (let i = 0; i < 3; i++) { window.__film.renderAt(10 + i / 30); window.__film.canvas.toDataURL(); } })()'); print('frame ms', round((time.time() - t) / 3 * 1000))
        for name, opts in [('16x9', "{frame:'16x9', stems:{music:1,fx:1,voice:1}, caps:true, osd:true, sound:'auto', frames:8}"), ('4x3', "{frame:'4x3', stems:{music:0,fx:1,voice:1}, caps:false, osd:false, sound:'pcm', frames:8}")]:
            r = await pg.evaluate(f'(async () => JSON.stringify(await window.__film.Exporter.exportMP4({opts})))()'); print(name, r, await grab(pg, f'/tmp/ex_{name}.mp4'))
        await pg.evaluate('(async () => window.__film.Exporter.saveWav({music:1,fx:1,voice:1}))()'); print('wav', await grab(pg, '/tmp/ex.wav'))
        await pg.evaluate('window.__film.t = 9.0'); await pg.click('#save-png'); await pg.wait_for_timeout(1500); print('png', await grab(pg, '/tmp/ex.png'))
        await frame(pg, 9.0, '{fill: true}', '/tmp/fill.png'); await frame(pg, 9.0, '{}', '/tmp/nofill.png'); await frame(pg, 9.0, '{osd:false, caps:false}', '/tmp/clean.png')
        await pg.screenshot(path='/tmp/page.png', full_page=True)
        print('\n'.join(l for l in logs if ('error' in l.lower() or 'warn' in l.lower()) and 'ERR_NAME' not in l and '404' not in l)[:2000])
        await b.close()
asyncio.run(main())
