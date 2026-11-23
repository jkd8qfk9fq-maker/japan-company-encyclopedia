#!/usr/bin/env python3
"""Fetch the Japan-primary-source indicator snapshots from their publishers.

Companion to fetch-indicators.py (which covers the FRED series). The eight
series here are defined by docs/jce-078-analysis-saas-spec.md §4 as coming
from Japanese primary sources, so they are read from the publisher's own
distribution — never from a secondary aggregator:

  japan-cpi                     総務省統計局 消費者物価指数 (2020年基準 CSV)
  japan-cgpi                    日本銀行 企業物価指数 (時系列統計データ検索 API)
  boj-tankan-di                 日本銀行 短観 業況判断DI (same API)
  japan-current-account         財務省・日本銀行 国際収支統計 (same API)
  japan-industrial-production   経済産業省 鉱工業指数 (公式 Excel)
  japan-job-offers-ratio        厚生労働省 一般職業紹介状況 (e-Stat 長期時系列表)
  japan-real-wages              厚生労働省 毎月勤労統計調査 (e-Stat 長期時系列表)
  japan-exports                 財務省 貿易統計 (e-Stat 主要商品別時系列表)

Values are stored exactly as published: no unit conversion, no aggregation,
no seasonal adjustment of our own. Series whose publisher's current base
period starts later than ten years ago (CPI 2020年基準, IIP 2020年基準) are
stored from that base period's start — different base periods are never
spliced. See docs/decisions.md JCE-107.

e-Stat file ids (statInfId) are stable for a dataset but a new annual file
is a new dataset for the trade statistics, so ids are resolved from the
official listing pages and every downloaded file is verified by its own
contents (sheet titles / monthly rows) before anything is read from it.
A mismatch aborts the run instead of writing a snapshot.

The real-wage source is a legacy .xls; converting it needs LibreOffice
(`soffice`) on PATH. Without it the script stops with an explanation rather
than guessing at the binary format.

Usage: python3 scripts/indicators/fetch-indicators-primary.py
"""

from __future__ import annotations

import csv
import io
import json
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path

from datetime import datetime

try:
    from zoneinfo import ZoneInfo

    TODAY = datetime.now(ZoneInfo("Asia/Tokyo")).date()
except Exception:
    TODAY = date.today()

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "src" / "data" / "indicators"
UPDATED_AT = TODAY.isoformat()
START_YEAR = TODAY.year - 10
MIN_OBSERVATIONS = 24

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

BOJ_API = "https://www.stat-search.boj.or.jp/api/v1/getDataCode"
BOJ_SITE = "https://www.stat-search.boj.or.jp/"
CPI_CSV = "https://www.stat.go.jp/data/cpi/2020/csv/zmi2020aa.csv"
CPI_PAGE = "https://www.stat.go.jp/data/cpi/1.html"
IIP_XLSX = "https://www.meti.go.jp/statistics/tyo/iip/xls/b2020_gsm1j.xlsx"
IIP_PAGE = "https://www.meti.go.jp/statistics/tyo/iip/index.html"
ESTAT_DOWNLOAD = "https://www.e-stat.go.jp/stat-search/file-download"
IPPAN_LISTING = "https://www.e-stat.go.jp/stat-search/files?iroha=2&layout=dataset&toukei=00450222"
MAIKIN_LISTING = "https://www.e-stat.go.jp/stat-search/files?iroha=2&layout=dataset&toukei=00450071"
TRADE_LISTING = (
    "https://www.e-stat.go.jp/stat-search/files?iroha=2&layout=dataset&page=1"
    "&toukei=00350300&tstat=000001013137&tclass1=000001013256&tclass2=000001013257&tclass3val=0"
)
# Last verified statInfIds (2026-11-24). Used as the first candidates only;
# the file contents are always verified, and the listing page is the fallback.
IPPAN_KNOWN_ID = ("000040518983", "0")
MAIKIN_KNOWN_ID = ("000032189738", "4")


def fetch(url: str) -> bytes:
    result = subprocess.run(
        ["curl", "-sS", "--fail", "--max-time", "120", "-H", f"User-Agent: {UA}", url],
        capture_output=True,
    )
    if result.returncode != 0:
        raise SystemExit(f"fetch failed for {url}: {result.stderr.decode(errors='replace')}")
    return result.stdout


# --------------------------------------------------------------------------
# Minimal read-only .xlsx reader (stdlib only), enough for the fixed-layout
# government workbooks used here: shared strings, inline strings, numbers.
# --------------------------------------------------------------------------

_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
_RID = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"


def _cell_value(cell: ET.Element, strings: list[str]):
    kind = cell.get("t")
    if kind == "inlineStr":
        node = cell.find(f"{{{_NS}}}is")
        if node is None:
            return None
        return "".join(t.text or "" for t in node.iter(f"{{{_NS}}}t"))
    node = cell.find(f"{{{_NS}}}v")
    if node is None or node.text is None:
        return None
    if kind == "s":
        return strings[int(node.text)]
    if kind == "str":
        return node.text
    try:
        number = float(node.text)
    except ValueError:
        return node.text
    return int(number) if number == int(number) and abs(number) < 1e15 else number


def read_xlsx(data: bytes, sheet_name: str) -> list[tuple[int, list]]:
    """Return [(row_number_1_based, [cell, ...]), ...] for one sheet."""
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        names = set(archive.namelist())
        strings: list[str] = []
        if "xl/sharedStrings.xml" in names:
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for item in root.findall(f"{{{_NS}}}si"):
                # Join the text runs only; phonetic (ruby) runs in <rPh> are
                # readings, not cell text (e-Stat workbooks carry them).
                parts = []
                for child in item:
                    if child.tag == f"{{{_NS}}}t":
                        parts.append(child.text or "")
                    elif child.tag == f"{{{_NS}}}r":
                        parts.extend(t.text or "" for t in child.findall(f"{{{_NS}}}t"))
                strings.append("".join(parts))
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        targets = {rel.get("Id"): rel.get("Target") for rel in rels}
        target = None
        sheets = workbook.find(f"{{{_NS}}}sheets")
        for sheet in sheets:
            if sheet.get("name") == sheet_name:
                target = targets[sheet.get(_RID)]
        if target is None:
            raise KeyError(f"sheet {sheet_name!r} not found")
        path = target if target.startswith("xl/") else f"xl/{target.lstrip('/')}"
        root = ET.fromstring(archive.read(path))
    rows: dict[int, dict[int, object]] = {}
    width = 0
    for cell in root.iter(f"{{{_NS}}}c"):
        ref = cell.get("r")
        letters = "".join(ch for ch in ref if ch.isalpha())
        digits = "".join(ch for ch in ref if ch.isdigit())
        col = 0
        for ch in letters:
            col = col * 26 + (ord(ch) - 64)
        row_no = int(digits)
        rows.setdefault(row_no, {})[col - 1] = _cell_value(cell, strings)
        width = max(width, col)
    return [
        (row_no, [rows[row_no].get(col) for col in range(width)])
        for row_no in sorted(rows)
    ]


def sheet_titles(data: bytes) -> list[str]:
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        sheets = workbook.find(f"{{{_NS}}}sheets")
        return [sheet.get("name") for sheet in sheets]


# --------------------------------------------------------------------------
# Bank of Japan time-series API (no key required)
# --------------------------------------------------------------------------


def boj_observations(db: str, code: str, quarterly: bool) -> tuple[dict, list[tuple[str, float]]]:
    url = f"{BOJ_API}?format=json&lang=jp&db={db}&startDate={START_YEAR}01&code={code}"
    doc = json.loads(fetch(url))
    if doc.get("NEXTPOSITION") not in (None, ""):
        raise SystemExit(f"BOJ response truncated for {code}; refusing partial data")
    result = doc["RESULTSET"][0]
    dates = result["VALUES"]["SURVEY_DATES"]
    values = result["VALUES"]["VALUES"]
    observations = []
    for raw_date, value in zip(dates, values):
        if value is None:
            continue
        text = str(raw_date)
        year = int(text[:4])
        if quarterly:
            month = (int(text[4:6]) - 1) * 3 + 1
        else:
            month = int(text[4:6])
        observations.append((f"{year:04d}-{month:02d}-01", value))
    return result, observations


# --------------------------------------------------------------------------
# Statistics Bureau CPI (2020-base CSV, headline index is the first column)
# --------------------------------------------------------------------------


def cpi_observations() -> list[tuple[str, float]]:
    text = fetch(CPI_CSV).decode("shift_jis")
    observations = []
    for row in csv.reader(io.StringIO(text)):
        if not row or not re.fullmatch(r"\d{6}", row[0] or ""):
            continue
        year, month = int(row[0][:4]), int(row[0][4:6])
        if not 1 <= month <= 12:
            continue
        observations.append((f"{year:04d}-{month:02d}-01", float(row[1])))
    if not observations or observations[0][0] != "2020-01-01":
        raise SystemExit("CPI CSV layout changed: first monthly row is not 2020-01")
    return observations


# --------------------------------------------------------------------------
# METI indices of industrial production (official workbook, 生産 sheet)
# --------------------------------------------------------------------------


def iip_observations() -> list[tuple[str, float]]:
    rows = read_xlsx(fetch(IIP_XLSX), "生産")
    if not any("時系列コード" in values for _no, values in rows):
        raise SystemExit("IIP workbook layout changed: 時系列コード row not found")
    header = None
    for _no, values in rows:
        if values and values[0] == "品目番号":
            header = values
            break
    if header is None:
        raise SystemExit("IIP workbook layout changed: 品目番号 row not found")
    month_cols = {
        col: (int(v) // 100, int(v) % 100)
        for col, v in enumerate(header)
        if isinstance(v, (int, float)) and 190001 <= int(v) <= 219912 and 1 <= int(v) % 100 <= 12
    }
    for _no, values in rows:
        if values and isinstance(values[0], (int, float)) and int(values[0]) == 1000000000:
            observations = []
            for col, (year, month) in sorted(month_cols.items(), key=lambda kv: kv[1]):
                value = values[col] if col < len(values) else None
                if isinstance(value, (int, float)):
                    observations.append((f"{year:04d}-{month:02d}-01", value))
            if not observations or observations[0][0] != "2018-01-01":
                raise SystemExit("IIP series does not start at 2018-01 as expected")
            return observations
    raise SystemExit("IIP workbook layout changed: 鉱工業 row (1000000000) not found")


# --------------------------------------------------------------------------
# e-Stat published files. Ids are resolved from the official listing page
# and every file is verified by content before use.
# --------------------------------------------------------------------------


def estat_listing_ids(listing_url: str) -> list[tuple[str, str]]:
    html = fetch(listing_url).decode("utf-8", errors="replace")
    pairs = re.findall(r"file-download\?statInfId=(\d+)&(?:amp;)?fileKind=(\d+)", html)
    seen: list[tuple[str, str]] = []
    for pair in pairs:
        if pair not in seen:
            seen.append(pair)
    return seen


def estat_download(stat_inf_id: str, file_kind: str) -> bytes:
    return fetch(f"{ESTAT_DOWNLOAD}?statInfId={stat_inf_id}&fileKind={file_kind}")


def job_ratio_observations() -> list[tuple[str, float]]:
    candidates = [IPPAN_KNOWN_ID] + [
        pair for pair in estat_listing_ids(IPPAN_LISTING) if pair != IPPAN_KNOWN_ID
    ]
    sheet = "第３表ー１（パート含む）"
    for stat_inf_id, file_kind in candidates[:40]:
        try:
            data = estat_download(stat_inf_id, file_kind)
            if not zipfile.is_zipfile(io.BytesIO(data)) or sheet not in sheet_titles(data):
                continue
            rows = read_xlsx(data, sheet)
        except Exception:
            continue
        if not rows or "有効求人倍率" not in str(rows[0][1][0] or ""):
            continue
        header_no = None
        sa_col = None
        for row_no, values in rows:
            if "季節調整値" in values:
                header_no, sa_col = row_no, values.index("季節調整値")
                break
        if header_no is None:
            continue
        observations = []
        for row_no, values in rows:
            if row_no <= header_no + 1 or not values:
                continue
            label = values[0]
            year = None
            if isinstance(label, str) and re.fullmatch(r"\d{4}年", label):
                year = int(label[:4])
            elif isinstance(label, (int, float)) and 1900 <= int(label) <= 2199:
                year = int(label)
            if year is None:
                continue
            for offset in range(12):
                value = values[sa_col + offset] if sa_col + offset < len(values) else None
                if isinstance(value, (int, float)):
                    observations.append((f"{year:04d}-{offset + 1:02d}-01", value))
        observations = [obs for obs in observations if int(obs[0][:4]) >= START_YEAR]
        if len(observations) >= MIN_OBSERVATIONS:
            return observations
    raise SystemExit("job-offers-ratio file could not be located/verified on e-Stat")


def real_wage_observations() -> list[tuple[str, float]]:
    soffice = shutil.which("soffice") or shutil.which("libreoffice")
    if soffice is None:
        raise SystemExit(
            "real-wage source is a legacy .xls and LibreOffice (soffice) is not on PATH; "
            "cannot convert it without guessing at the binary format"
        )
    candidates = [MAIKIN_KNOWN_ID] + [
        pair for pair in estat_listing_ids(MAIKIN_LISTING) if pair != MAIKIN_KNOWN_ID
    ]
    for stat_inf_id, file_kind in candidates[:40]:
        try:
            data = estat_download(stat_inf_id, file_kind)
        except SystemExit:
            continue
        if zipfile.is_zipfile(io.BytesIO(data)) or not data[:8] == b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1":
            continue  # not the legacy .xls we are looking for
        with tempfile.TemporaryDirectory() as tmp:
            src = Path(tmp) / "realwage.xls"
            src.write_bytes(data)
            result = subprocess.run(
                [soffice, "--headless", "--convert-to", "xlsx", "--outdir", tmp, str(src)],
                capture_output=True,
            )
            converted = Path(tmp) / "realwage.xlsx"
            if result.returncode != 0 or not converted.exists():
                continue
            try:
                rows = read_xlsx(converted.read_bytes(), "TL")
            except Exception:
                continue
        title_ok = any(
            isinstance(cell, str) and "実質賃金指数" in cell
            for _no, values in rows[:4]
            for cell in values
        )
        header_idx = None
        for idx, (_no, values) in enumerate(rows):
            if values and values[0] == "年" and len(values) > 19 and values[8] == 1:
                header_idx = idx
                break
        if not title_ok or header_idx is None:
            continue
        observations = []
        seen_years: set[int] = set()
        for _no, values in rows[header_idx + 1 :]:
            if values and isinstance(values[0], str) and "増減率" in values[0]:
                break
            if not values or not isinstance(values[0], (int, float)):
                continue
            year = int(values[0])
            if year in seen_years:
                break  # the growth-rate section repeats the years
            if not 1900 <= year <= 2199:
                continue
            seen_years.add(year)
            for offset in range(12):
                value = values[8 + offset] if 8 + offset < len(values) else None
                if isinstance(value, (int, float)):
                    observations.append((f"{year:04d}-{offset + 1:02d}-01", value))
        observations = [obs for obs in observations if int(obs[0][:4]) >= START_YEAR]
        if len(observations) >= MIN_OBSERVATIONS:
            return observations
    raise SystemExit("real-wage file could not be located/verified on e-Stat")


# --------------------------------------------------------------------------
# MOF trade statistics (customs): one annual CSV per year on e-Stat.
# Each annual file also carries the previous December; the overlap is
# asserted equal before the years are joined.
# --------------------------------------------------------------------------

MONTH_ABBR = {
    "Jan.": 1, "Feb.": 2, "Mar.": 3, "Apr.": 4, "May.": 5, "Jun.": 6,
    "Jul.": 7, "Aug.": 8, "Sep.": 9, "Oct.": 10, "Nov.": 11, "Dec.": 12,
}


def trade_year_file_ids() -> dict[int, str]:
    html = fetch(TRADE_LISTING).decode("utf-8", errors="replace")
    mapping: dict[int, str] = {}
    prev = 0
    for match in re.finditer(r"file-download\?statInfId=(\d+)&(?:amp;)?fileKind=1", html):
        segment = re.sub(r"<[^>]+>", " ", html[prev : match.start()]).replace("&nbsp;", " ")
        years = re.findall(r"調査年月\s*(\d{4})年", segment)
        if years:
            mapping.setdefault(int(years[-1]), match.group(1))
        prev = match.end()
    return mapping


def trade_months(data: bytes) -> dict[tuple[int, int], int]:
    text = data.decode("shift_jis", errors="replace")
    months: dict[tuple[int, int], int] = {}
    for row in csv.reader(io.StringIO(text)):
        if len(row) < 3:
            continue
        match = re.fullmatch(
            r"(\d{4}) (Jan\.|Feb\.|Mar\.|Apr\.|May\.|Jun\.|Jul\.|Aug\.|Sep\.|Oct\.|Nov\.|Dec\.)",
            (row[1] or "").strip(),
        )
        if match:
            months[(int(match.group(1)), MONTH_ABBR[match.group(2)])] = int(row[2])
    return months


def export_observations() -> list[tuple[str, float]]:
    mapping = trade_year_file_ids()
    series: dict[tuple[int, int], int] = {}
    for year in range(START_YEAR, TODAY.year + 1):
        stat_inf_id = mapping.get(year)
        if stat_inf_id is None:
            raise SystemExit(f"trade listing has no annual file for {year}")
        months = trade_months(estat_download(stat_inf_id, "1"))
        own = {key: value for key, value in months.items() if key[0] == year}
        if not own:
            raise SystemExit(f"trade file for {year} contains no monthly rows for that year")
        prev_dec = months.get((year - 1, 12))
        if prev_dec is not None and (year - 1, 12) in series and series[(year - 1, 12)] != prev_dec:
            raise SystemExit(f"trade December {year - 1} differs between annual files")
        series.update(own)
    keys = sorted(series)
    for prev_key, next_key in zip(keys, keys[1:]):
        expected = (
            (prev_key[0] + 1, 1) if prev_key[1] == 12 else (prev_key[0], prev_key[1] + 1)
        )
        if next_key != expected:
            raise SystemExit(f"trade series has a gap after {prev_key}")
    return [(f"{y:04d}-{m:02d}-01", series[(y, m)]) for y, m in keys]


# --------------------------------------------------------------------------


def validate(indicator_id: str, observations: list[tuple[str, float]]) -> None:
    if len(observations) < MIN_OBSERVATIONS:
        raise SystemExit(f"{indicator_id}: only {len(observations)} observations")
    dates = [d for d, _ in observations]
    if dates != sorted(dates) or len(set(dates)) != len(dates):
        raise SystemExit(f"{indicator_id}: dates are not strictly increasing")
    if any(not isinstance(v, (int, float)) for _, v in observations):
        raise SystemExit(f"{indicator_id}: non-numeric value present")


def write_snapshot(payload: dict, observations: list[tuple[str, float]]) -> None:
    validate(payload["id"], observations)
    payload["observations"] = [
        {"date": day, "value": value} for day, value in observations
    ]
    payload["updatedAt"] = UPDATED_AT
    path = OUT_DIR / f"{payload['id']}.json"
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"{payload['id']}: {len(observations)} observations "
        f"({observations[0][0]} .. {observations[-1][0]})"
    )


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    write_snapshot(
        {
            "id": "japan-cpi",
            "name": "消費者物価指数（日本）",
            "source": {"name": "総務省統計局 消費者物価指数", "url": CPI_PAGE},
            "unit": "指数（2020年=100）",
            "frequency": "monthly",
        },
        cpi_observations(),
    )

    result, observations = boj_observations("PR01", "PRCG20_2200000000", quarterly=False)
    if "企業物価" not in str(result.get("NAME_OF_TIME_SERIES_J", "")):
        raise SystemExit("BOJ PR01 series name mismatch")
    write_snapshot(
        {
            "id": "japan-cgpi",
            "name": "企業物価指数（日本）",
            "source": {"name": "日本銀行 企業物価指数", "url": BOJ_SITE},
            "unit": "指数（2020年=100）",
            "frequency": "monthly",
        },
        observations,
    )

    write_snapshot(
        {
            "id": "japan-industrial-production",
            "name": "鉱工業生産指数（日本）",
            "source": {"name": "経済産業省 鉱工業指数", "url": IIP_PAGE},
            "unit": "指数（2020年=100・季節調整済）",
            "frequency": "monthly",
        },
        iip_observations(),
    )

    write_snapshot(
        {
            "id": "japan-job-offers-ratio",
            "name": "有効求人倍率（日本）",
            "source": {"name": "厚生労働省 一般職業紹介状況（職業安定業務統計）", "url": IPPAN_LISTING},
            "unit": "倍（季節調整済）",
            "frequency": "monthly",
        },
        job_ratio_observations(),
    )

    write_snapshot(
        {
            "id": "japan-real-wages",
            "name": "実質賃金指数（日本）",
            "source": {"name": "厚生労働省 毎月勤労統計調査", "url": MAIKIN_LISTING},
            "unit": "指数（2020年平均=100）",
            "frequency": "monthly",
        },
        real_wage_observations(),
    )

    write_snapshot(
        {
            "id": "japan-exports",
            "name": "輸出額（通関）",
            "source": {"name": "財務省 貿易統計", "url": TRADE_LISTING},
            "unit": "千円",
            "frequency": "monthly",
        },
        export_observations(),
    )

    result, observations = boj_observations("BP01", "BPBP6JYNCB", quarterly=False)
    if result.get("NAME_OF_TIME_SERIES_J") != "経常収支":
        raise SystemExit("BOJ BP01 series name mismatch")
    write_snapshot(
        {
            "id": "japan-current-account",
            "name": "経常収支（日本）",
            "source": {"name": "財務省・日本銀行 国際収支統計", "url": BOJ_SITE},
            "unit": "億円",
            "frequency": "monthly",
        },
        observations,
    )

    result, observations = boj_observations("CO", "TK99F1000601GCQ01000", quarterly=True)
    series_name = str(result.get("NAME_OF_TIME_SERIES_J", ""))
    if not ("業況" in series_name and "大企業" in series_name and "製造業" in series_name):
        raise SystemExit("BOJ CO series name mismatch")
    write_snapshot(
        {
            "id": "boj-tankan-di",
            "name": "業況判断DI（日銀短観・大企業製造業）",
            "source": {"name": "日本銀行 短観（全国企業短期経済観測調査）", "url": BOJ_SITE},
            "unit": "％ポイント",
            "frequency": "quarterly",
        },
        observations,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
