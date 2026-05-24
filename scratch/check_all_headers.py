import os
import re

html_dir = r"c:\Users\maicol\Documents\GitHub\Portal-Institucional\html"
files = [f for f in os.listdir(html_dir) if f.endswith(".html")]

def extract_header(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r'(<!-- Header Principal .*?-->.*?<header.*?>.*?</header>)', content, re.DOTALL)
    if not match:
        match = re.search(r'(<header.*?>.*?</header>)', content, re.DOTALL)
    return match.group(1) if match else None

index_header = extract_header(os.path.join(html_dir, "index.html"))
print("Index Header extracted, length:", len(index_header) if index_header else "Not found")

for sf in files:
    if sf == "index.html":
        continue
    sf_path = os.path.join(html_dir, sf)
    header = extract_header(sf_path)
    if not header:
        print(f"{sf}: Header NOT found")
        continue
    if header == index_header:
        print(f"{sf}: matches index exactly")
    else:
        print(f"{sf}: DIFFERENT from index. Lengths: index={len(index_header)}, {sf}={len(header)}")
