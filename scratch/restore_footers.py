import re

# Read uniform footer from html/contacto.html
with open('html/contacto.html', 'r', encoding='utf-8') as f:
    contacto_content = f.read()

# Extract the footer tag
footer_match = re.search(r'(<footer class="main-footer">.*?</footer>)', contacto_content, re.DOTALL)
if not footer_match:
    print("Could not find footer in html/contacto.html")
    exit(1)

uniform_footer = footer_match.group(1)

target_files = [
    'html/deportes.html',
    'html/documentos.html',
    'html/noticias.html',
    'html/departamentos.html',
    'html/academico.html'
]

for file_path in target_files:
    print(f"Restoring uniform footer to {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the footer block
    new_content = re.sub(r'<footer class="main-footer">.*?</footer>', uniform_footer, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Done restoring footers!")
