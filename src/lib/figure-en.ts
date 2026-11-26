/**
 * The English form of a figure the site prints in Japanese notation (JCE-128): 「9,477億円」 → "¥947.7 billion",
 * 「2026年3月期」 → "FY ended Mar 2026", 「37,752人」 → "37,752 people". Pure arithmetic on the printed digits — no
 * rounding beyond what the Japanese already shows — so the English says exactly what the Japanese says. A string it
 * does not recognise in full is returned unchanged rather than guessed at.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MINUS = "−";

const num = (s: string) => Number(s.replace(/,/g, ""));

/** Exact decimal places, trailing zeros dropped: 947.7, 48.0367. */
function plain(value: number, scale: number): string {
  // Work in integers of the smallest unit the Japanese can express (万円 = 10^4) to avoid float noise.
  const units = Math.round(value / 1e4);
  const scaleUnits = scale / 1e4;
  const whole = Math.floor(units / scaleUnits);
  const rest = units % scaleUnits;
  if (rest === 0) return whole.toLocaleString("en-US");
  const digits = String(scaleUnits).length - 1;
  const frac = String(rest).padStart(digits, "0").replace(/0+$/, "");
  return `${whole.toLocaleString("en-US")}.${frac}`;
}

function yen(text: string): string | null {
  const m = /^(−|-)?(?:([\d,]+)兆)?(?:([\d,]+)億)?(?:([\d,]+)万)?(?:([\d,]+))?円$/.exec(text);
  if (!m || (!m[2] && !m[3] && !m[4] && !m[5])) return null;
  const value = (m[2] ? num(m[2]) * 1e12 : 0) + (m[3] ? num(m[3]) * 1e8 : 0) + (m[4] ? num(m[4]) * 1e4 : 0) + (m[5] ? num(m[5]) : 0);
  const sign = m[1] ? MINUS : "";
  if (value >= 1e12) return `${sign}¥${plain(value, 1e12)} trillion`;
  if (value >= 1e9) return `${sign}¥${plain(value, 1e9)} billion`;
  if (value >= 1e6) return `${sign}¥${plain(value, 1e6)} million`;
  return `${sign}¥${value.toLocaleString("en-US")}`;
}

const RULES: [RegExp, (m: RegExpExecArray) => string][] = [
  [/^(\d{4})年(\d{1,2})月期$/, (m) => `FY ended ${MONTHS[Number(m[2]) - 1]} ${m[1]}`],
  [/^(\d{4})年(\d{1,2})月(\d{1,2})日$/, (m) => `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`],
  [/^(\d{4})年(\d{1,2})月$/, (m) => `${MONTHS[Number(m[2]) - 1]} ${m[1]}`],
  [/^(\d{4})年$/, (m) => m[1]],
  [/^([\d,]+)人$/, (m) => `${m[1]} ${m[1] === "1" ? "person" : "people"}`],
  [/^([\d,.]+)万人$/, (m) => `${(num(m[1]) * 10).toLocaleString("en-US")} thousand people`],
  [/^([\d,]+)社$/, (m) => `${m[1]} ${m[1] === "1" ? "company" : "companies"}`],
  [/^([\d,]+)件$/, (m) => m[1]],
  [/^([\d,]+)期$/, (m) => `${m[1]} ${m[1] === "1" ? "year" : "years"}`],
  [/^([\d,.]+)年$/, (m) => `${m[1]} ${m[1] === "1" ? "year" : "years"}`],
];

export function figureEn(text: string): string {
  const t = text.trim();
  const y = yen(t);
  if (y) return y;
  for (const [re, f] of RULES) {
    const m = re.exec(t);
    if (m) return f(m);
  }
  return text;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ORD = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
const date = (y: string, m: string, d: string) => `${MONTH_NAMES[Number(m) - 1].slice(0, 3)} ${Number(d)}, ${y}`;

/**
 * The English name of a filing's title as EDINET and the exchanges print it (有価証券報告書－第88期(2025/04/01－2026/03/31)
 * → "Annual Securities Report, 88th fiscal period (Apr 1, 2025 – Mar 31, 2026)"). Only these fixed document names and
 * their dates are converted; any title with words left over (a company's own web page) is returned as printed.
 */
/** The publishers named on most sources, as they name themselves in English. */
const PUBLISHERS: Record<string, string> = {
  "EDINET（金融庁）": "EDINET (Financial Services Agency)",
  "EDINET DB（Cabocia株式会社）が会社の決算短信を構造化したデータ": "EDINET DB (Cabocia Inc.): structured data from the company's earnings releases",
};

export function documentTitleEn(title: string): string {
  if (PUBLISHERS[title]) return PUBLISHERS[title];
  let t = title.normalize("NFKC").trim();
  const amended = /^訂正/.test(t) || /\(訂正\)$/.test(t);
  t = t.replace(/^訂正/, "").replace(/\(訂正\)$/, "");
  t = t
    .replace(/(\d{4})\/(\d{2})\/(\d{2})/g, (_m, y, mo, d) => date(y, mo, d))
    .replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/g, (_m, y, mo, d) => date(y, mo, d))
    .replace(/(\d{4})年(\d{1,2})月中間期/g, (_m, y, mo) => `interim period of FY ending ${MONTH_NAMES[Number(mo) - 1].slice(0, 3)} ${y}`)
    .replace(/(\d{4})年(\d{1,2})月期/g, (_m, y, mo) => `FY ended ${MONTH_NAMES[Number(mo) - 1].slice(0, 3)} ${y}`)
    .replace(/(\d{4})年度/g, "FY$1")
    .replace(/第(\d+)四半期/g, (_m, n) => `Q${n}`)
    .replace(/第(\d+)期/g, (_m, n) => `${ORD(Number(n))} fiscal period`)
    .replace(/有価証券報告書/g, "Annual Securities Report")
    .replace(/半期報告書/g, "Semi-annual Report")
    .replace(/決算短信/g, "Earnings Release")
    .replace(/〔IFRS〕/g, " (IFRS)")
    .replace(/〔日本基準〕/g, " (Japanese GAAP)")
    .replace(/\(連結\)/g, " (consolidated)")
    .replace(/[－〜~]/g, " – ")
    .replace(/(\d{4})-(?=[A-Z])/g, "$1 – ")
    .replace(/[:：]/g, ": ")
    .replace(/・/g, ", ")
    .replace(/(Report|Release)\s*-\s*/g, "$1, ")
    .replace(/(\S)\(/g, "$1 (")
    .replace(/\s+/g, " ")
    .trim();
  if (/[぀-ヿ一-鿿]/.test(t)) return title;
  return amended ? `${t} (amended)` : t;
}
