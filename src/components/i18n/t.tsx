import { LOCALES, type Message } from "@/lib/i18n";

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
          // No `lang` here: only the reader's language is ever shown, and <html lang> already says which (JCE-124 —
          // the attribute on every span of every page cost the static export about 5% in bytes).
          <span key={l} data-l={l}>
            {m[l]}
          </span>
        ) : null,
      )}
    </>
  );
}
