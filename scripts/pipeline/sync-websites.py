"""
Each registered company's own website, from its 有価証券報告書 (operator request 2026-11-17, JCE-055).

    pip install pymupdf
    python3 scripts/pipeline/sync-websites.py [--only <company-id>,...] [--write]

The 有報's 【株式事務の概要】 prints 公告掲載方法, and a company that publishes its notices electronically (電子公告)
prints the address of its own website there: 「電子公告は当会社のウェブサイトに掲載しており、そのアドレスは次のとおり
です。https://www.nissui.co.jp」. That address is the company's own statement of where its site is, in the filing that
every entry is built on — so the link needs no other source, and is cited to that filing.

What is held back rather than guessed:
  - a company that publishes notices in a newspaper (日本経済新聞に掲載) prints no address: no link;
  - an address on a host that more than one company prints is a shared notice service (電子公告 代行) or a parent's
    site, not the company's own: no link;
  - a filing that cannot be read (scanned image, download failed): no link, reported.

Only the origin is kept (https://www.nissui.co.jp/ir/koukoku/ → https://www.nissui.co.jp/): the link is to the
company's site, not to its notices page.

Reads the latest 有報 PDF of each entry (the yuho-* source with an EDINET PDF URL; no API key needed). Progress is kept
in .cache/websites.jsonl so an interrupted run resumes. With --write: src/data/websites.json only.
"""

import json
import re
import sys
import unicodedata
import urllib.request
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit

import pymupdf

ROOT = Path(__file__).resolve().parents[2]
COMPANIES = ROOT / "src/data/companies"
CACHE = ROOT / ".cache/websites.jsonl"
OUT = ROOT / "src/data/websites.json"
EDINET_PDF = re.compile(r"^https://disclosure2dl\.edinet-fsa\.go\.jp/searchdocument/pdf/(S1[0-9A-Z]{6})\.pdf$")
# Where the 公告掲載方法 field ends: the next field of the same table, or a note.
FIELD_END = re.compile(r"株主に対する特典|（注）|\(注\)|第[0-9０-９一二三四五六七八九]+【|【提出会社の参考情報】")
URL = re.compile(r"(?:https?://)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:/[A-Za-z0-9\-._~/%?=&#]*)?", re.I)


def latest_yuho(company: dict):
    found = []
    for s in company["sources"]:
        m = EDINET_PDF.match(s.get("url", ""))
        if s["id"].startswith("yuho") and m:
            found.append((s.get("publishedAt") or s.get("asOf") or "", s["id"], m.group(1), s["url"]))
    return max(found) if found else None


def notice_field(pdf: bytes) -> str | None:
    """The text of 公告掲載方法, read from the back of the filing where 【株式事務の概要】 is."""
    doc = pymupdf.open(stream=pdf, filetype="pdf")
    pages = [unicodedata.normalize("NFKC", p.get_text()) for p in reversed(doc)]
    # Most filings head the field 公告掲載方法; a few write 公告方法 or 公告の方法 — looked for only when no page has the
    # usual heading, so a later page that merely mentions 公告方法 is not read instead.
    for heading in (r"公告掲載方法", r"公告の?方法"):
        for text in pages:
            m = re.search(heading, text)
            if not m:
                continue
            rest = text[m.end():]
            end = FIELD_END.search(rest)
            return rest[: end.start() if end else 600]
    return None


def address(field: str) -> str | None:
    # A URL broken across lines in the PDF is rejoined: lines are joined without a separator, and a URL ends at the
    # first character that cannot be in one (Japanese text, a bracket, a full stop).
    joined = "".join(line.strip() for line in field.splitlines())
    for m in URL.finditer(joined):
        raw = m.group(0).rstrip(".,")
        if "@" in raw or not re.search(r"https?://|^www\.", raw, re.I):
            continue
        parts = urlsplit(raw if re.match(r"https?://", raw, re.I) else "https://" + raw)
        host = parts.hostname
        if host:
            return f"{parts.scheme.lower()}://{host.lower()}/"
    return None


def prefer_https(url: str) -> str:
    """An address printed as http:// is linked as https:// when the site answers there, so the reader is not sent to an
    unencrypted page; otherwise as printed."""
    if not url.startswith("http://"):
        return url
    secure = "https://" + url[len("http://"):]
    try:
        req = urllib.request.Request(secure, method="HEAD", headers={"User-Agent": "japan-company-encyclopedia-sync"})
        with urllib.request.urlopen(req, timeout=15) as res:
            if res.status < 400:
                return secure
    except Exception:  # noqa: BLE001
        pass
    return url


def read(company_id: str, source: tuple) -> dict:
    _, source_id, doc_id, url = source
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "japan-company-encyclopedia-sync"})
        with urllib.request.urlopen(req, timeout=120) as res:
            field = notice_field(res.read())
    except Exception as e:  # noqa: BLE001 — any failure is reported and leaves the company without a link
        return {"id": company_id, "sourceId": source_id, "docId": doc_id, "error": str(e)[:200]}
    if field is None:
        return {"id": company_id, "sourceId": source_id, "docId": doc_id, "error": "公告掲載方法が見つからない"}
    return {"id": company_id, "sourceId": source_id, "docId": doc_id, "url": address(field), "field": field[:300]}


def main() -> None:
    args = sys.argv[1:]
    only = set(args[args.index("--only") + 1].split(",")) if "--only" in args else None
    companies = {}
    for f in sorted(COMPANIES.glob("*.json")):
        c = json.loads(f.read_text())
        if only is None or c["id"] in only:
            companies[c["id"]] = c

    done = {}
    if CACHE.exists():
        for line in CACHE.read_text().splitlines():
            r = json.loads(line)
            done[r["id"]] = r
    todo = []
    for cid, c in companies.items():
        src = latest_yuho(c)
        if src is None:
            continue
        if cid in done and done[cid].get("docId") == src[2] and "error" not in done[cid]:
            continue
        todo.append((cid, src))

    CACHE.parent.mkdir(exist_ok=True)
    with CACHE.open("a") as out, ThreadPoolExecutor(6) as pool:
        for n, r in enumerate(pool.map(lambda t: read(*t), todo), 1):
            done[r["id"]] = r
            out.write(json.dumps(r, ensure_ascii=False) + "\n")
            out.flush()
            if n % 100 == 0:
                print(f"{n}/{len(todo)}", file=sys.stderr)

    results = [r for cid, r in done.items() if cid in companies]
    hosts = Counter(urlsplit(r["url"]).hostname for r in results if r.get("url"))
    shared = {h for h, k in hosts.items() if k > 1}
    websites, reasons = {}, Counter()
    for r in sorted(results, key=lambda r: r["id"]):
        if "error" in r:
            reasons["読めない: " + r["error"][:40]] += 1
        elif not r.get("url"):
            reasons["アドレスの記載なし（新聞公告など）"] += 1
        elif urlsplit(r["url"]).hostname in shared:
            reasons["複数社が同じアドレス（公告の代行・親会社）"] += 1
        else:
            websites[r["id"]] = {"url": r["url"], "sourceId": r["sourceId"]}
    if "--write" in args:
        with ThreadPoolExecutor(8) as pool:
            ids = [cid for cid, w in websites.items() if w["url"].startswith("http://")]
            for cid, url in zip(ids, pool.map(lambda cid: prefer_https(websites[cid]["url"]), ids)):
                websites[cid]["url"] = url

    print(f"リンクあり {len(websites)} / {len(results)} 社", file=sys.stderr)
    for reason, k in reasons.most_common(12):
        print(f"  {k:5d}  {reason}", file=sys.stderr)
    print("  共有ホスト:", ", ".join(sorted(shared)[:20]), file=sys.stderr)

    if "--write" in args:
        data = {
            "locator": "【株式事務の概要】公告掲載方法",
            "readAt": date.today().isoformat(),
            "companies": websites,
        }
        OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
        print(f"wrote {OUT.relative_to(ROOT)}", file=sys.stderr)


if __name__ == "__main__":
    main()
