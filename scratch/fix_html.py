import os
import re

directory = r"c:\Users\RUBEN\OneDrive\Desktop\Pagina GAA v18"

replacements = {
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã±': 'ñ',
    'Ã ': 'Á',
    'Ã‰': 'É',
    'Ã ': 'Í',
    'Ã“': 'Ó',
    'Ãš': 'Ú',
    'Ã‘': 'Ñ',
    'Â¿': '¿',
    'Â¡': '¡',
    'â€œ': '“',
    'â€ ': '”',
    'â€˜': '‘',
    'â€™': '’',
    'â€”': '—',
    'â€“': '–',
}
replacements['Ã\xad'] = 'í'

def fix_encoding(text):
    for k, v in replacements.items():
        text = text.replace(k, v)
    return text

def fix_menus(text):
    # Fix main menus: uppercase
    def upper_nav(m):
        return m.group(1) + m.group(2).upper() + m.group(3)
    text = re.sub(r'(<a[^>]*class="nav-link"[^>]*>)(.*?)(</a>)', upper_nav, text, flags=re.DOTALL)
    
    # Fix submenus: capitalize only the first letter, but keep exceptions
    def fix_dropdown(m):
        content = m.group(2)
        def cap_a(ma):
            inner_text = ma.group(2)
            if inner_text.strip():
                # Custom overrides for proper nouns or abbreviations
                custom_fixes = {
                    "SENA": "SENA",
                    "PQRSF": "PQRSF",
                    "San Isidro": "San Isidro",
                    "Seguro Bolívar": "Seguro Bolívar",
                    "Tomás Carrasquilla": "Tomás Carrasquilla",
                    "Carlos Villa": "Carlos Villa",
                    "Pascual Bravo": "Pascual Bravo"
                }
                
                # Rule: First letter uppercase, rest lowercase.
                # Since inner text might have whitespace/newlines, we should temporarily strip it, optionally keep the whitespace structure
                stripped_text = inner_text.strip()
                # Remove extra internal whitespace/newlines so it matches the expected structure, but it's simpler to just capitalize, relying on the fact that python's capitalize() will lower everything else.
                # However, capitalize() on "Manual\n De Convivencia" -> "Manual\n de convivencia".
                capitalized = stripped_text.capitalize()
                
                # Apply custom fixes over the capitalized version
                capitalized = capitalized.replace("sena", "SENA").replace("Sena", "SENA")
                capitalized = capitalized.replace("pqrsf", "PQRSF").replace("Pqrsf", "PQRSF")
                capitalized = capitalized.replace("San isidro", "San Isidro")
                capitalized = capitalized.replace("Seguro bolívar", "Seguro Bolívar")
                capitalized = capitalized.replace("Seguro bolivar", "Seguro Bolívar")
                capitalized = capitalized.replace("Tomás carrasquilla", "Tomás Carrasquilla")
                capitalized = capitalized.replace("Carlos villa", "Carlos Villa")
                capitalized = capitalized.replace("Pascual bravo", "Pascual Bravo")
                
                # reconstruct padding if needed, or simply replace the inner content with exactly one space instead of newlines
                capitalized = re.sub(r'\s+', ' ', capitalized)
                
                return ma.group(1) + capitalized + ma.group(3)
            return ma.group(0)
            
        content = re.sub(r'(<a[^>]*>)([\s\S]*?)(</a>)', cap_a, content)
        return m.group(1) + content + m.group(3)
        
    text = re.sub(r'(<ul[^>]*class="dropdown-menu"[^>]*>)([\s\S]*?)(</ul>)', fix_dropdown, text)
    
    return text

count = 0
for root, dirs, files in os.walk(directory):
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                try:
                    content = file.read()
                except UnicodeDecodeError:
                    print(f"Could not read {path} as UTF-8. Trying Latin-1...")
                    with open(path, 'r', encoding='latin-1') as file_latin:
                        content = file_latin.read()
            
            new_content = fix_encoding(content)
            new_content = fix_menus(new_content)
            
            if content != new_content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                count += 1
                print(f"Fixed: {path}")

print(f"Done fixing {count} HTML files.")
