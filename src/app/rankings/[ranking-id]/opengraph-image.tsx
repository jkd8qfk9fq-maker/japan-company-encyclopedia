import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { buildRanking, RANKING_IDS, type RankingId } from "@/lib/rankings";
import { rankingFigures } from "@/lib/rankings-data";

/**
 * The share image of a ranking (JCE-062), drawn at build time from the same figures as the page. The font is a
 * subset of Noto Sans JP (src/assets/fonts/og/SOURCES.md): next/og cannot read the WOFF2 files the pages use.
 */
export const alt = "業界ランキング（日本企業百科事典）";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return RANKING_IDS.map((id) => ({ "ranking-id": id }));
}

const NAVY = "#14284b";
const INK = "#1c1c1c";
const MUTED = "#6b6b6b";
const SEAL = "#b8312f";

export default async function Image({ params }: { params: Promise<{ "ranking-id": string }> }) {
  const id = (await params)["ranking-id"] as RankingId;
  const ranking = buildRanking(id, await rankingFigures());
  const font = await readFile(join(process.cwd(), "src/assets/fonts/og/noto-sans-jp-bold-subset.ttf"));
  const top = ranking.rows.slice(0, 5);
  const max = Math.max(...top.map((r) => Math.abs(r.value)), 0);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#faf8f3", padding: "56px 72px", fontFamily: "Noto Sans JP", color: INK }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 8, height: 40, background: SEAL }} />
          <div style={{ fontSize: 30 }}>日本企業百科事典</div>
          <div style={{ fontSize: 24, color: MUTED, marginLeft: 12 }}>業界ランキング</div>
        </div>
        <div style={{ fontSize: 56, marginTop: 28 }}>{ranking.title}</div>
        <div style={{ fontSize: 24, color: MUTED, marginTop: 6 }}>{ranking.measure}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 30 }}>
          {top.map((row) => (
            <div key={row.id} style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 30 }}>
              <div style={{ width: 70, color: MUTED }}>{`${row.rank}位`}</div>
              <div style={{ width: 340 }}>{row.name}</div>
              <div style={{ display: "flex", flex: 1, height: 18, background: "#e7e3da", borderRadius: 9 }}>
                <div style={{ width: `${max > 0 ? Math.max(2, (Math.abs(row.value) / max) * 100) : 0}%`, height: 18, background: NAVY, borderRadius: 9 }} />
              </div>
              <div style={{ width: 150, textAlign: "right", display: "flex", justifyContent: "flex-end" }}>{ranking.format(row.value)}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", fontSize: 20, color: MUTED }}>{`有価証券報告書の数値から集計・対象${ranking.rows.reduce((a, r) => a + r.companies, 0)}社`}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Noto Sans JP", data: font, style: "normal", weight: 700 }] },
  );
}
