import os
import re

base_dir = r"c:\xampp\htdocs\portalweb"

html_dirs = [
    os.path.join(base_dir, "html"),
    os.path.join(base_dir, "html", "tecnicas"),
    os.path.join(base_dir, "manuales")
]

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig_content = content
    rel_depth = ""
    if "\\html\\tecnicas\\" in filepath or "/html/tecnicas/" in filepath:
        manifest_rel = "../../manifest.json"
        doc_rel = "../documentos.html"
        news_rel = "../noticias.html"
        admin_rel = "../../php/admin/login.php"
        img_rel = "../../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png"
    elif "\\html\\" in filepath or "/html/" in filepath:
        manifest_rel = "../manifest.json"
        doc_rel = "documentos.html"
        news_rel = "noticias.html"
        admin_rel = "../php/admin/login.php"
        img_rel = "../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png"
    elif "\\manuales\\" in filepath or "/manuales/" in filepath:
        manifest_rel = "../manifest.json"
        doc_rel = "../html/documentos.html"
        news_rel = "../html/noticias.html"
        admin_rel = "../php/admin/login.php"
        img_rel = "../img/logo_del_colegio-removebg-preview__1_-removebg-preview.png"
    else:
        manifest_rel = "manifest.json"
        doc_rel = "html/documentos.html"
        news_rel = "html/noticias.html"
        admin_rel = "php/admin/login.php"
        img_rel = "img/logo_del_colegio-removebg-preview__1_-removebg-preview.png"

    # 1. Update dropdown under INICIO
    # Look for <li><a href="...noticias.html...">Noticias</a></li>
    if doc_rel not in content:
        # Pattern for noticias in dropdown
        pattern_noticias = r'(<li><a\s+href="[^"]*noticias\.(?:html|php)"[^>]*>Noticias<\/a><\/li>)'
        replacement = r'\1\n                                <li><a href="' + doc_rel + '">Documentos</a></li>'
        content = re.sub(pattern_noticias, replacement, content, count=1)

    # 2. Add PWA and OpenGraph tags in <head> if manifest is missing
    if 'rel="manifest"' not in content:
        head_pwa = f'''
    <!-- PWA Manifest & Theme -->
    <link rel="manifest" href="{manifest_rel}">
    <meta name="theme-color" content="#1e3c72">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="I.E. GAA">

    <!-- Open Graph / Redes Sociales & WhatsApp -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="I.E. Gilberto Alzate Avendaño - Portal Institucional">
    <meta property="og:description" content="Portal oficial de la Institución Educativa Gilberto Alzate Avendaño en Medellín.">
    <meta property="og:image" content="{img_rel}">
    <meta name="twitter:card" content="summary_large_image">
'''
        content = re.sub(r'(<title>.*?</title>)', r'\1' + head_pwa, content, flags=re.DOTALL)

    # 3. Add hidden admin in footer if missing
    if 'Admin</a>' not in content and 'admin/login.php' not in content:
        admin_link = f'''
                    <a href="{admin_rel}" title="Acceso Administrativo" style="opacity: 0.4; font-size: 0.8rem; margin-left: 8px;">
                        <i class="fas fa-shield-alt"></i> Admin
                    </a>
'''
        # Insert before </div>\s*</div>\s*</footer>
        content = re.sub(r'(<div class="footer-bottom-links">.*?)(<\/div>)', r'\1' + admin_link + r'\2', content, flags=re.DOTALL)

    if content != orig_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

for d in html_dirs:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith(".html") and file not in ["admin.html", "noticias.html", "departamentos.html", "documentos.html"]:
                update_file(os.path.join(root, file))

print("All files processed successfully.")
