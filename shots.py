import asyncio, sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from harness import *
from PIL import Image
import io
TS = [float(x) for x in sys.argv[1].split(',')] if len(sys.argv) > 1 else [0.3, 2.0, 4.0, 9.0, 12.5, 15.05, 16.5, 20.5, 25.3, 27.5, 30.6, 33.5, 36.5]
OPTS = sys.argv[2] if len(sys.argv) > 2 else '{}'
async def main():
    async with async_playwright() as p:
        b, pg, logs = await open_film(p)
        ims = []
        for t in TS:
            raw = await frame(pg, t, OPTS)
            im = Image.open(io.BytesIO(raw)).convert('RGB'); ims.append((t, im))
        stats = await pg.evaluate('JSON.stringify(window.__film.Snd.stats())')
        await b.close()
        print('\n'.join(l for l in logs if 'error' in l.lower() or 'warn' in l.lower())[:3000]); print('audio', stats)
        crop = (240, 0, 1680, 1080) if 'fill: true' not in OPTS else (0, 0, 1920, 1080)
        cw, chh = 480, 360 if crop[2] - crop[0] == 1440 else 270
        cols = 4; rows = (len(ims) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * cw, rows * (chh + 20)), (30, 30, 30))
        from PIL import ImageDraw
        d = ImageDraw.Draw(sheet)
        for i, (t, im) in enumerate(ims):
            x, y = (i % cols) * cw, (i // cols) * (chh + 20)
            sheet.paste(im.crop(crop).resize((cw, chh)), (x, y + 20)); d.text((x + 4, y + 4), f't={t}', fill=(255, 255, 0))
        sheet.save('/tmp/sheet.png'); print('sheet saved')
asyncio.run(main())
