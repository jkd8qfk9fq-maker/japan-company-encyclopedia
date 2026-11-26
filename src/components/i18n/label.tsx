import { T } from "@/components/i18n/t";
import { figureEn } from "@/lib/figure-en";
import { UI_DICTIONARY_EN } from "@/lib/ui-dictionary-en";

/**
 * A label that reaches the page as a plain string — a metric's name, a filing's line label, a heading defined in
 * src/lib — with its English from the dictionary, or its exact English figure form (JCE-124). Unknown strings are
 * shown as written. Server Components only: the dictionary stays out of the browser bundles.
 */
export function L({ s }: { s: string }) {
  // A few call sites pass values the types call strings but data can leave as numbers; show those as they are.
  if (typeof s !== "string") return <>{s}</>;
  const en = UI_DICTIONARY_EN[s] ?? (figureEn(s) !== s ? figureEn(s) : undefined);
  return en ? <T m={{ ja: s, en }} /> : <>{s}</>;
}
