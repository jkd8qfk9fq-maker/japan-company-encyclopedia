import { LOCALE_META, LOCALES, type Message } from "@/lib/i18n";

/**
 * One piece of interface text in every language; the CSS from `localeCss` shows the reader's (JCE-123). Works in
 * Server and Client Components alike — it reads nothing and holds no state — so a server-rendered page carries
 * every language and switching never waits for a request or a re-render.
 */
export function T({ m }: { m: Message }) {
  return (
    <>
      {LOCALES.map((l) =>
        m[l] ? (
          <span key={l} data-l={l} lang={LOCALE_META[l].htmlLang}>
            {m[l]}
          </span>
        ) : null,
      )}
    </>
  );
}
