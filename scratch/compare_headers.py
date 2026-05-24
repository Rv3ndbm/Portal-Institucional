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
print("Index Header extracted, length:", len(index_header) if index_header else "Not found")

for sf in sedes_files:
    sf_path = os.path.join(html_dir, sf)
    header = extract_header(sf_path)
    if not header:
        print(f"{sf}: Header NOT found")
        continue
    if header == index_header:
        print(f"{sf}: Header matches index exactly")
    else:
        print(f"{sf}: Header DIFFERENT from index. Lengths: index={len(index_header)}, {sf}={len(header)}")
        # Let's print the first difference
        idx_lines = index_header.splitlines()
        sf_lines = header.splitlines()
        diff_found = False
        for i, (l1, l2) in enumerate(zip(idx_lines, sf_lines)):
            if l1.strip() != l2.strip():
                print(f"  First diff at line {i+1}:")
                print(f"    Index: {l1.strip()}")
                print(f"    {sf}: {l2.strip()}")
                diff_found = True
                break
        if not diff_found and len(idx_lines) != len(sf_lines):
            print(f"  Line count difference: index={len(idx_lines)}, {sf}={len(sf_lines)}")
