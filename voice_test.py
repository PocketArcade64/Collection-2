import asyncio, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from harness import *
async def main():
    async with async_playwright() as p:
        b, pg, logs = await open_film(p)
        await pg.set_input_files('#voices', ['/tmp/w1.wav', '/tmp/p1.wav', '/tmp/wrongname.wav'])
        await pg.wait_for_function("document.getElementById('status').textContent.startsWith('Loaded')", timeout=120000)
        print(await pg.inner_text('#status')); print(await pg.inner_text('#cues')); print(await pg.inner_text('#mixinfo'))
        await frame(pg, 12.8, '{}', '/tmp/glance.png'); await frame(pg, 13.3, '{}', '/tmp/glance2.png')
        print([l for l in logs if 'pageerror' in l])
        await b.close()
asyncio.run(main())
