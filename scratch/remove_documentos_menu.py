from pathlib import Path
import re
root = Path('html')
pattern = re.compile(r'[ \t]*<li><a href="(?:\.\./)?documentos\.html">Documentos</a></li>[ \t]*\r?\n', re.IGNORECASE)
modified = []
for path in root.rglob('*.html'):
    text = path.read_text(encoding='utf-8')
    new_text = pattern.sub('', text)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        modified.append(path)
print(f'Modified {len(modified)} files')
for p in modified:
    print(p)
