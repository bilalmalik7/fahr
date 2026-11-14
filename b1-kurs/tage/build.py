#!/usr/bin/env python3
"""Build a lesson page: python3 build.py 1  ->  reads tag-01.json, writes tag-01.html.

The page is template.html with the lesson JSON injected. Answer keys live in
tag-NN.key.json (never injected into the page)."""
import json, sys, pathlib

here = pathlib.Path(__file__).parent
day = int(sys.argv[1])
nn = f"{day:02d}"
data = json.loads((here / f"tag-{nn}.json").read_text(encoding="utf-8"))
assert data["day"] == day
payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
tpl = (here / "template.html").read_text(encoding="utf-8")
out = tpl.replace("__DATA__", payload).replace("__DAY__", str(day))
(here / f"tag-{nn}.html").write_text(out, encoding="utf-8")
print(f"wrote tag-{nn}.html ({len(out)//1024} KB)")
