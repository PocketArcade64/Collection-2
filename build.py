#!/usr/bin/env python3
"""Concatenate src/*.js (in load order) into template.html -> dist/<slug>.html (one self-contained file)."""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ORDER = ['util', 'story', 'rig', 'tex', 'world', 'post', 'vhs', 'osd', 'subs', 'audio', 'mux', 'export', 'main']
js = '\n'.join(open(os.path.join(HERE, 'src', m + '.js'), encoding='utf8').read() for m in ORDER)
story = open(os.path.join(HERE, 'src', 'story.js'), encoding='utf8').read()
slug = re.search(r"SLUG = '([^']+)'", story).group(1)
title = re.search(r"END_CARD = \['([^']*)'", story).group(1).title() or slug
html = open(os.path.join(HERE, 'template.html'), encoding='utf8').read().replace('{{TITLE}}', title).replace('{{SCRIPT}}', js.replace('</script', '<\\/script'))
os.makedirs(os.path.join(HERE, 'dist'), exist_ok=True)
out = os.path.join(HERE, 'dist', slug + '.html'); open(out, 'w', encoding='utf8').write(html)
print(out, len(html) // 1024, 'KB')
