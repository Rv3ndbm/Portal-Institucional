import os
import re

html_dir = r"c:\Users\maicol\Documents\GitHub\Portal-Institucional\html"
sedes_files = [
    "sedes.html",
    "sede-carlos-villa.html",
    "sede-central.html",
    "sede-san-isidro.html",
    "sede-seguros-bolivar.html",
    "sede-tomas-carrasquilla.html"
]

def extract_header(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r'(<!-- Header Principal .*?-->.*?<header.*?>.*?</header>)', content, re.DOTALL)
    if not match:
        match = re.search(r'(<header.*?>.*?</header>)', content, re.DOTALL)
    return match.group(1) if match else None

index_header = extract_header(os.path.join(html_dir, "index.html"))
if not index_header:
    print("Error: Index Header not found")
    exit(1)

for sf in sedes_files:
    sf_path = os.path.join(html_dir, sf)
    with open(sf_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Let's find and replace the header block in sf
    match = re.search(r'(<!-- Header Principal .*?-->.*?<header.*?>.*?</header>)', content, re.DOTALL)
    if match:
        old_header = match.group(1)
        new_content = content.replace(old_header, index_header)
    else:
        match2 = re.search(r'(<header.*?>.*?</header>)', content, re.DOTALL)
        if match2:
            old_header = match2.group(1)
            new_content = content.replace(old_header, index_header)
        else:
            print(f"Header not found in {sf}")
            continue
            
    with open(sf_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Updated header in {sf}")
