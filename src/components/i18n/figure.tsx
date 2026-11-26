import { T } from "@/components/i18n/t";
import { documentTitleEn, figureEn } from "@/lib/figure-en";

/** A figure printed in Japanese notation, with its exact English form beside it (JCE-128). Server or client. */
export function F({ s }: { s: string }) {
  if (typeof s !== "string") return <>{s}</>;
  const en = figureEn(s);
  return en === s ? <>{s}</> : <T m={{ ja: s, en }} />;
}

/** A filing's title with its English document name (JCE-128); a title that is not a standard filing stays as printed. */
export function DocTitle({ title }: { title: string }) {
  const en = documentTitleEn(title);
  return en === title ? <>{title}</> : <T m={{ ja: title, en }} />;
}
