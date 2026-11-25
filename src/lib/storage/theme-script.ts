import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";
import { STORAGE_KEYS } from "./storage";

/**
 * The pre-paint theme script, as a string for an inline <script>.
 *
 * It lives in the storage layer (CLAUDE.md invariant 7: localStorage is read
 * only from src/lib/storage/) even though it cannot import this module at
 * runtime — it must run synchronously before first paint, before any bundle
 * loads. So it re-implements the one read it needs, defensively: it accepts
 * "light", "dark" or "system"; with nothing stored, or any failure (blocked storage, bad JSON), it shows the
 * house theme, dark (operator design, 2026-11-23). "system" follows the OS preference.
 *
 * JCE-123: the same read sets the interface language — `data-lang` (which `localeCss` keys on) and `lang` — so a
 * reader who chose English never sees the Japanese labels flash first. Only a known locale is accepted.
 */
export const THEME_SCRIPT = `(function(){try{var t="dark",s=null;try{s=JSON.parse(localStorage.getItem(${JSON.stringify(
  STORAGE_KEYS.settings,
)})||"{}");if(s&&(s.theme==="light"||s.theme==="dark"||s.theme==="system"))t=s.theme}catch(e){}var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";var l=s&&s.language;if(${JSON.stringify(LOCALES.filter((l) => l !== DEFAULT_LOCALE))}.indexOf(l)>=0){r.setAttribute("data-lang",l);r.lang=l}}catch(e){}})()`;
