import { STORAGE_KEYS } from "./storage";

/**
 * The pre-paint theme script, as a string for an inline <script>.
 *
 * It lives in the storage layer (CLAUDE.md invariant 7: localStorage is read
 * only from src/lib/storage/) even though it cannot import this module at
 * runtime — it must run synchronously before first paint, before any bundle
 * loads. So it re-implements the one read it needs, defensively: it accepts
 * only "light" or "dark", and any failure (blocked storage, bad JSON) falls
 * through to the OS preference.
 */
export const THEME_SCRIPT = `(function(){try{var t="system";try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
  STORAGE_KEYS.settings,
)})||"{}");if(s&&(s.theme==="light"||s.theme==="dark"))t=s.theme}catch(e){}var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light"}catch(e){}})()`;
