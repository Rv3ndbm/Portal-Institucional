import os
import re

html_dir = r"c:\Users\maicol\Documents\GitHub\Portal-Institucional\html"
files = [
    "index.html",
    "sedes.html",
    "sede-carlos-villa.html",
    "sede-central.html",
    "sede-san-isidro.html",
    "sede-seguros-bolivar.html",
    "sede-tomas-carrasquilla.html"
]

for sf in files:
    sf_path = os.path.join(html_dir, sf)
    with open(sf_path, "r", encoding="utf-8") as f:
        content = f.read()
    links = re.findall(r'<link rel="stylesheet".*?>', content)
    print(f"\n=== {sf} ===")
    for link in links:
        print("  ", link)
