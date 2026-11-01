import { BASE_PATH } from "@/lib/site";
import type { IndustryMapData } from "@/lib/industry-map";
import type { IndustryId } from "@/types/company";

const W = 820;
const H = 640;
const CX = W / 2;
const CY = H / 2;
const MAX_COMPANIES = 28;
const TONES = 6;

type Point = { x: number; y: number };

const on = (rx: number, ry: number, angle: number): Point => ({ x: CX + rx * Math.cos(angle), y: CY + ry * Math.sin(angle) });
// Spread n points round a ring, starting at the top.
const around = (i: number, n: number, offset = 0) => -Math.PI / 2 + ((i + offset) * 2 * Math.PI) / Math.max(n, 1);

/**
 * An industry as a network, after the operator's reference (2026-11-01): the industry in the middle, its companies on
 * the inner ring, and on the outer ring every other industry they trade with — a line for each tie a company's entry
 * states as 仕入先 or 顧客 (the same ties the industry map counts), coloured by the industry it reaches, and the other
 * industry's circle sized by how many ties reach it. Ties between two companies of this industry are drawn across
 * the inner ring. Nothing is placed or sized by anything but those ties; a company with none is drawn without lines.
 *
 * Server-rendered SVG with plain links, so it needs no script. It is sized for a wide screen; on a phone the list
 * under it carries the same industries and counts.
 */
export function IndustryNetwork({ industryId, data }: { industryId: IndustryId; data: IndustryMapData }) {
  const primaryOf = new Map<string, IndustryId>();
  for (const industry of data.industries) {
    for (const company of industry.companies) if (company.primary) primaryOf.set(company.id, industry.id);
  }
  const self = data.industries.find((i) => i.id === industryId);
  const members = (self?.companies.filter((c) => c.primary) ?? [])
    .sort((a, b) => b.ties.length - a.ties.length)
    .slice(0, MAX_COMPANIES);
  if (members.length === 0) return null;

  // Ties out of the industry, counted per industry reached; and ties inside it, between two members.
  const outward = new Map<IndustryId, number>();
  const edges: { from: string; to: IndustryId }[] = [];
  const inner: { from: string; to: string }[] = [];
  const memberIds = new Set(members.map((m) => m.id));
  for (const member of members) {
    for (const tie of member.ties) {
      const other = primaryOf.get(tie.companyId);
      if (!other) continue;
      if (other === industryId) {
        if (memberIds.has(tie.companyId) && member.id < tie.companyId) inner.push({ from: member.id, to: tie.companyId });
        continue;
      }
      outward.set(other, (outward.get(other) ?? 0) + 1);
      edges.push({ from: member.id, to: other });
    }
  }
  const others = [...outward.entries()].sort((a, b) => b[1] - a[1]);
  const name = new Map(data.industries.map((i) => [i.id, i.name]));
  const tone = new Map(others.map(([id], i) => [id, `var(--segment-${(i % TONES) + 1})`]));

  // Companies that trade with the same industry sit together on the ring, so their lines run side by side to it
  // instead of crossing the circle: each company is grouped under the industry it has most ties with, groups in the
  // order of the outer ring, companies with no tie outward last.
  const mainOf = (id: string) => {
    const counts = new Map<IndustryId, number>();
    for (const e of edges) if (e.from === id) counts.set(e.to, (counts.get(e.to) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  };
  const rank = new Map(others.map(([id], i) => [id, i]));
  const ordered = [...members].sort((a, b) => {
    const ra = rank.get(mainOf(a.id)!) ?? others.length;
    const rb = rank.get(mainOf(b.id)!) ?? others.length;
    return ra - rb || a.name.localeCompare(b.name, "ja");
  });
  const memberAngle = new Map(ordered.map((m, i) => [m.id, around(i, ordered.length)]));
  const memberAt = new Map(ordered.map((m) => [m.id, on(170, 150, memberAngle.get(m.id)!)]));

  // Each outer industry faces the companies tied to it (the circular mean of their angles), then neighbours are
  // pushed apart so no two circles overlap.
  const MIN_GAP = (2 * Math.PI) / Math.max(others.length * 1.6, 8);
  const facing = others.map(([id]) => {
    const angles = edges.filter((e) => e.to === id).map((e) => memberAngle.get(e.from)!);
    const angle = Math.atan2(
      angles.reduce((sum, a) => sum + Math.sin(a), 0),
      angles.reduce((sum, a) => sum + Math.cos(a), 0),
    );
    return { id, angle };
  });
  facing.sort((a, b) => a.angle - b.angle);
  for (let pass = 0; pass < 8; pass++) {
    for (let i = 1; i < facing.length; i++) {
      const gap = facing[i].angle - facing[i - 1].angle;
      if (gap < MIN_GAP) {
        const shift = (MIN_GAP - gap) / 2;
        facing[i - 1].angle -= shift;
        facing[i].angle += shift;
      }
    }
  }
  const otherAt = new Map(facing.map(({ id, angle }) => [id, on(330, 255, angle)]));

  // Fit the drawing to what is on it: a sparse industry should not sit in a field of empty space.
  const points = [{ x: CX, y: CY }, ...memberAt.values(), ...otherAt.values()];
  const minX = Math.min(...points.map((p) => p.x)) - 150;
  const maxX = Math.max(...points.map((p) => p.x)) + 150;
  const minY = Math.min(...points.map((p) => p.y)) - 45;
  const maxY = Math.max(...points.map((p) => p.y)) + 55;
  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
  const href = (path: string) => `${BASE_PATH}${path}`;

  return (
    <figure className="m-0">
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <svg
          viewBox={viewBox}
          role="img"
          aria-label={`${name.get(industryId)}業界の企業${members.length}社と、取引でつながる${others.length}の業界の図`}
          className="h-auto w-full"
        >
          <g fill="none" strokeLinecap="round">
            {edges.map((edge, i) => {
              const a = memberAt.get(edge.from)!;
              const b = otherAt.get(edge.to)!;
              // Curved toward the centre, so lines bundle the way the reference's do instead of crossing straight.
              return (
                <path
                  key={`e${i}`}
                  d={`M${a.x} ${a.y} Q${(a.x + b.x) / 2 + (CX - (a.x + b.x) / 2) * 0.35} ${(a.y + b.y) / 2 + (CY - (a.y + b.y) / 2) * 0.35} ${b.x} ${b.y}`}
                  stroke={tone.get(edge.to)}
                  strokeOpacity={0.75}
                  strokeWidth={1.75}
                />
              );
            })}
            {inner.map((edge, i) => {
              const a = memberAt.get(edge.from)!;
              const b = memberAt.get(edge.to)!;
              return (
                <path
                  key={`i${i}`}
                  d={`M${a.x} ${a.y} Q${CX} ${CY} ${b.x} ${b.y}`}
                  stroke="var(--ink)"
                  strokeOpacity={0.5}
                  strokeWidth={1.25}
                />
              );
            })}
            <ellipse cx={CX} cy={CY} rx={170} ry={150} stroke="var(--border)" strokeWidth={1} />
          </g>

          <circle cx={CX} cy={CY} r={46} fill="var(--foreground)" />
          <text x={CX} y={CY + 6} textAnchor="middle" fontSize={17} fontWeight={700} fill="var(--background)">
            {name.get(industryId)}
          </text>

          {members.map((m) => {
            const p = memberAt.get(m.id)!;
            const right = p.x >= CX;
            return (
              <a key={m.id} href={href(`/companies/${m.id}`)}>
                <circle cx={p.x} cy={p.y} r={m.ties.length > 0 ? 7 : 5} fill={m.ties.length > 0 ? "var(--ink)" : "var(--muted-foreground)"} />
                <text
                  x={p.x + (right ? 10 : -10)}
                  y={p.y + 4}
                  fontSize={11.5}
                  textAnchor={right ? "start" : "end"}
                  fill="var(--foreground)"
                >
                  {m.name.length > 9 ? `${m.name.slice(0, 9)}…` : m.name}
                </text>
              </a>
            );
          })}

          {others.map(([id, count]) => {
            const p = otherAt.get(id)!;
            const r = Math.min(30, 11 + count * 3);
            return (
              <a key={id} href={href(`/industries/${id}`)}>
                <circle cx={p.x} cy={p.y} r={r} fill={tone.get(id)} fillOpacity={0.9} stroke="var(--card)" strokeWidth={2} />
                <text x={p.x} y={p.y + r + 15} fontSize={13} fontWeight={600} textAnchor="middle" fill="var(--foreground)">
                  {name.get(id)}
                </text>
                <text x={p.x} y={p.y + 4} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--background)">
                  {count}
                </text>
              </a>
            );
          })}
        </svg>
      </div>
      <figcaption className="mt-3 text-xs leading-5 text-muted-foreground">
        中心が{name.get(industryId)}業界、内側の点がこの業界の企業（主な業界で数えて{members.length}社
        {(self?.companies.filter((c) => c.primary).length ?? 0) > members.length ? "まで表示" : ""}
        ）、外側の円が取引でつながる業界です。線は有価証券報告書に「仕入先」「顧客」と書かれた関係で、円の数字はその数です。
      </figcaption>
      {others.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2 text-xs">
          {others.map(([id, count]) => (
            <li key={id}>
              <a
                href={href(`/industries/${id}`)}
                className="inline-flex min-h-8 items-center gap-2 rounded-full border border-border px-3 hover:border-foreground"
              >
                <span aria-hidden className="size-2.5 rounded-full" style={{ background: tone.get(id) }} />
                {name.get(id)}
                <span className="figures text-muted-foreground">{count}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
