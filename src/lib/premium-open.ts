/**
 * JCE-075: while the encyclopedia runs on advertising and reader growth, every premium-gated feature on THIS
 * site is open to all readers. The plan itself is unchanged — still sold on the 診断 site, still what removes
 * ads here (the ad unit reads the real plan, never this flag) — and setting this back to false restores the
 * gates exactly as they were.
 *
 * The flag lives in this module of its own (no "use client") so Server Components can read it too: a heading
 * that calls an open feature "（プレミアム）" would contradict the open gate, so the labels beside the gates
 * switch on the same flag the gates themselves read (through src/lib/plan.ts, which re-exports it).
 */
export const PREMIUM_FEATURES_OPEN = true;
