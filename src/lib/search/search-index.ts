import { listIndustryPages } from "@/lib/industries";
import { INDUSTRY_LABELS } from "@/lib/industry-labels";
import { companyRepository, featureRepository, industryRepository, termRepository } from "@/lib/repositories";
import { toPlainText } from "@/lib/rich-text";
import { normalizeForSearch } from "./normalize";
import type { SearchEntry } from "./search";

/**
 * Built on the server at build time and sent to /search as data, so typing
 * never waits on the network — including offline. Only titles, one-line
 * subtitles and match text are included, never whole entries.
 */
export async function buildSearchIndex(): Promise<SearchEntry[]> {
  const [companies, industryPages, industries, terms, features] = await Promise.all([
    companyRepository.list(),
    listIndustryPages(),
    industryRepository.list(),
    termRepository.list(),
    featureRepository.list(),
  ]);
  const researched = new Map(industries.map((i) => [i.id, i]));

  return [
    ...companies.map((c): SearchEntry => ({
      kind: "company",
      id: c.id,
      title: c.name,
      subtitle: c.description ? toPlainText(c.description) : `${c.officialName}（証券コード${c.code}）`,
      href: `/companies/${c.id}`,
      sortKey: c.name,
      keys: [c.name, c.officialName, c.nameEn ?? "", c.shortNameEn ?? "", c.code].filter(Boolean).map(normalizeForSearch),
      haystack: normalizeForSearch(
        [
          c.name,
          c.officialName,
          c.nameEn,
          c.shortNameEn,
          c.code,
          ...c.businesses.flatMap(function names(b): string[] {
            return [b.name, b.shortName ?? "", ...(b.products ?? []), ...(b.children ?? []).flatMap(names)];
          }),
        ]
          .filter(Boolean)
          .join(" "),
      ),
    })),
    ...industryPages.map((i): SearchEntry => {
      const detail = researched.get(i.id);
      return {
        kind: "industry",
        id: i.id,
        title: `${i.name}業界`,
        subtitle: detail ? toPlainText(detail.description) : `${i.companyCount}社を掲載`,
        href: `/industries/${i.id}`,
        sortKey: INDUSTRY_LABELS[i.id].reading,
        keys: [i.name, i.nameEn].map(normalizeForSearch),
        haystack: normalizeForSearch([i.name, i.nameEn, ...(detail?.categories.map((c) => c.name) ?? [])].join(" ")),
      };
    }),
    ...terms.map((t): SearchEntry => ({
      kind: "term",
      id: t.id,
      title: t.term,
      subtitle: t.description,
      href: `/terms#${t.id}`,
      sortKey: t.reading ?? t.term,
      keys: [t.term, t.reading ?? ""].filter(Boolean).map(normalizeForSearch),
      haystack: normalizeForSearch([t.term, t.reading ?? "", t.description].join(" ")),
    })),
    ...features.map((f): SearchEntry => ({
      kind: "feature",
      id: f.id,
      title: f.title,
      subtitle: f.subtitle ?? "",
      href: `/features/${f.id}`,
      sortKey: f.title,
      keys: [f.title].map(normalizeForSearch),
      haystack: normalizeForSearch([f.title, f.subtitle ?? ""].join(" ")),
    })),
  ];
}
