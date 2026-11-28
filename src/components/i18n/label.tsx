import { T } from "@/components/i18n/t";
import { figureEn } from "@/lib/figure-en";
import { UI_DICTIONARY_EN } from "@/lib/ui-dictionary-en";

/**
 * A label that reaches the page as a plain string — a metric's name, a filing's line label, a heading defined in
 * src/lib — with its English from the dictionary, or its exact English figure form (JCE-128). Unknown strings are
 * shown as written. Server Components only: the dictionary stays out of the browser bundles.
 */
export function L({ s }: { s: string }) {
  // A few call sites pass values the types call strings but data can leave as numbers; show those as they are.
  if (typeof s !== "string") return <>{s}</>;
  // Display guard (audit part 1, major 2): a stringified object must never reach a reader. Registered data
  // still holds the literal "[object Object]" in some businessModel / businessStructure texts (the data fix
  // is the registration department's); until it lands, the token is stripped here — every data string on a
  // company page reaches the page through this component or through RichText, which renders via L too.
  const clean = s.includes("[object Object]") ? s.replaceAll("[object Object]", "") : s;
  const en = UI_DICTIONARY_EN[clean] ?? (figureEn(clean) !== clean ? figureEn(clean) : undefined);
  return en ? <T m={{ ja: clean, en }} /> : <>{clean}</>;
}
