#!/usr/bin/env python3
"""Run from the project root:  python apply_tasks_4_5.py
Adds css/js-features.css, js/background.js and js/datetime.js to every *.html file.
Safe to run several times (it never inserts duplicates)."""
import glob

LINK = '<link rel="stylesheet" href="css/js-features.css">'
SCRIPTS = ('<script src="js/background.js"></script>\n'
           '<script src="js/datetime.js"></script>\n')

for path in glob.glob('*.html'):
    with open(path, encoding='utf-8') as f:
        html = f.read()
    changed = False
    if 'css/js-features.css' not in html:
        html = html.replace('</head>', LINK + '\n</head>', 1); changed = True
    if 'js/background.js' not in html:
        html = html.replace('</body>', SCRIPTS + '</body>', 1); changed = True
    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
    print(('updated  ' if changed else 'skipped  ') + path)
