"use client";

import { useEffect } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { planStore, type PlanKind, type StoredPlan } from "@/lib/storage/stores";
import { trackEvent } from "@/lib/analytics/runtime";

/**
 * The YUGENQ premium plan on this site (JCE-043). The plan is sold on the 企業タイプ診断 site; the code reaches
 * this site in one of two ways: the reader types it in, or the 診断 site left it in a cookie on the parent
 * domain after a successful check (`yugenq_plan`). What comes back from a check is kept in localStorage
 * through the storage layer (invariant 7). Nothing about the reader is sent.
 *
 * JCE-100: the check itself moved here. This site's own Worker now keeps the billing record (Stripe webhooks
 * write entitlements into D1) and answers at `/api/plan` on this origin, with the same shape and rule as the
 * borrowed check. During the move a code is asked in both places and either "paid" answer wins: a code the
 * new record does not hold yet is still answered by the 診断 site exactly as before, so no reader's plan
 * closes while the record fills in. The fallback goes away once the webhook is live and the held codes are
 * recorded here (SaaS Step 2).
 *
 * JCE-140: the answer now also says which plan a code is, and the two plans are judged separately. This
 * site's own record knows the subscription's product and answers "analysis" only for the ¥1,100 学習β
 * product; the borrowed check exists for the ¥390 plan, so a code only it confirms counts as "premium" and
 * never opens the analysis layer. Everything else about the union rule is unchanged: either "paid" answer
 * still counts as paid for the premium benefits and for ad suppression.
 */

export const OWN_PLAN_ENDPOINT = "/api/plan";
/** The borrowed check on the 企業タイプ診断 site — the migration fallback of JCE-100, asked second. */
export const PLAN_ENDPOINT = "https://shindan.kigyo-hyakka.com/api/plan";
export const CHECKOUT_ENDPOINT = "https://shindan.kigyo-hyakka.com/api/checkout";
export const PLAN_PAGE = "https://shindan.kigyo-hyakka.com/plan/";
/**
 * The free trial the plan's Checkout gives (P2-1, JCE-064). The Checkout is the 企業タイプ診断 site's; this number is
 * only what this site says about it, so it must follow that site's trial (its CTS-044). 0 = no trial.
 */
export const PLAN_TRIAL_DAYS = 7;
/**
 * JCE-075: while the encyclopedia runs on advertising and reader growth, every premium-gated feature on THIS
 * site is open to all readers. The plan itself is unchanged — still sold on the 診断 site, still what removes
 * ads here (the ad unit reads the real plan, never this flag) — and setting this back to false restores the
 * gates exactly as they were.
 */
export const PREMIUM_FEATURES_OPEN = true;
/**
 * JCE-078: the analysis layer (5観点の分析レポート) is a NEW paid layer, gated independently of
 * PREMIUM_FEATURES_OPEN. JCE-075 opened this site's existing features for good; this flag never
 * re-closes them.
 *
 * JCE-101 (SaaS Step 2): the layer is live. This flag is now the layer's on/off switch — while it
 * is true, the full analysis (distributions, trends, indicator links and the printable full
 * report) opens only for a reader whose purchase code the billing record (JCE-100: this site's
 * own entitlements, with the 診断 site's check as the migration fallback) says is paid, through
 * `analysisEntitled` below. The free part — each perspective's own values and the industry
 * median — stays open to every reader either way. Setting this flag back to false returns the
 * layer to its "in preparation" note without touching the entitlement record.
 */
export const ANALYSIS_FEATURES_OPEN = true;

/**
 * Whether this browser's stored plan opens the analysis layer (JCE-101): the layer must be live, the
 * stored plan must still be within its paid period, and — since JCE-140 — the plan must be the ¥1,100
 * 学習β plan itself. A ¥390 premium code is still a paid plan (it suppresses ads and opens the premium
 * features), but it no longer opens this layer. `usePlan` already clears a plan the moment it lapses,
 * so this is the same truth the gate renders by, kept pure for tests.
 */
export function analysisEntitled(plan: StoredPlan | null, now = Date.now()): boolean {
  return ANALYSIS_FEATURES_OPEN && plan !== null && plan.kind === "analysis" && plan.paidUntil > now;
}

/**
 * Whether this browser's stored plan removes ads (the rule of JCE-064, named in JCE-153): any real paid
 * plan counts — the ¥1,100 analysis plan and the ¥390 premium plan alike, the union rule of JCE-140 —
 * while it is still within its paid period. Unlike the analysis layer, the plan KIND does not matter
 * here: paying is what removes ads. PREMIUM_FEATURES_OPEN never enters into it — that flag opens the
 * gated features to everyone, it does not make a reader a payer, so a reader who has not paid keeps
 * seeing ads while the gates stand open. Kept pure, like `analysisEntitled`, so the rule the ad unit
 * renders and loads its script by is the rule the tests hold.
 */
export function adsSuppressed(plan: StoredPlan | null, now = Date.now()): boolean {
  return plan !== null && plan.paidUntil > now;
}
const COOKIE = "yugenq_plan";
const CODE_PATTERN = /^sub_[A-Za-z0-9]{8,64}$/;

/** A check's answer, with the plan kind settled (JCE-140): every active answer carries one. */
type PlanResponse = { active: false } | { active: true; code: string; paidUntil: number; checkAfter: number; plan: PlanKind };

/** An answer as it arrives on the wire: only this site's own check prints `plan`, and only since JCE-140. */
type RawPlanResponse = { active: false } | { active: true; code: string; paidUntil: number; checkAfter: number; plan?: string };

async function askPlan(endpoint: string, code: string): Promise<RawPlanResponse> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) throw new Error(`plan check failed: ${response.status}`);
  return (await response.json()) as RawPlanResponse;
}

/**
 * Whether the code is paid for now (JCE-100), and which plan it is (JCE-140): this site's own record
 * first, the 診断 site's borrowed check second, and either "paid" answer wins. The kind comes from this
 * site's own record alone — its answer is trusted as printed, and anything it does not call "analysis"
 * (an older answer with no plan field, the ¥390 product, an unrecorded product) counts as "premium". A
 * code only the borrowed check confirms is the ¥390 plan it exists for, so it too counts as "premium":
 * the borrowed check can keep a premium plan open, never the analysis layer. An unreachable own endpoint
 * (not live yet, no record) simply leaves the answer to the borrowed check, whose failure still throws as
 * it always did — a failed check keeps the stored plan until it is no longer paid for.
 */
export async function checkPlan(code: string): Promise<PlanResponse> {
  let own: PlanResponse | null = null;
  try {
    const raw = await askPlan(OWN_PLAN_ENDPOINT, code);
    own = raw.active
      ? { active: true, code: raw.code, paidUntil: raw.paidUntil, checkAfter: raw.checkAfter, plan: raw.plan === "analysis" ? "analysis" : "premium" }
      : { active: false };
  } catch {
    own = null;
  }
  if (own?.active) return own;
  const rawLegacy = await askPlan(PLAN_ENDPOINT, code);
  const legacy: PlanResponse = rawLegacy.active
    ? { active: true, code: rawLegacy.code, paidUntil: rawLegacy.paidUntil, checkAfter: rawLegacy.checkAfter, plan: "premium" }
    : { active: false };
  return legacy.active ? legacy : (own ?? legacy);
}

/**
 * Starts Stripe Checkout for the plan from this site (JCE-043 / the 診断 site's CTS-024): the 診断 site's worker creates
 * the session and sends the buyer back to `returnTo` (this page) once the code is saved there — and, through the
 * parent-domain cookie, here. Card details never touch either site.
 */
export async function startCheckout(returnTo: string): Promise<void> {
  trackEvent("begin_checkout");
  const response = await fetch(CHECKOUT_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ returnTo }),
  });
  const body = (await response.json().catch(() => ({}))) as { url?: string };
  if (!response.ok || !body.url) throw new Error(`checkout failed: ${response.status}`);
  window.location.assign(body.url);
}

export function applyPlan(result: PlanResponse): StoredPlan | null {
  const plan: StoredPlan | null = result.active
    ? { code: result.code, paidUntil: result.paidUntil, checkAfter: result.checkAfter, kind: result.plan }
    : null;
  if (plan) planStore.set(plan);
  else planStore.clear();
  return plan;
}

/** The code the 診断 site left on the parent domain, if any and well-formed. */
export function codeFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`));
  const code = match ? decodeURIComponent(match.slice(COOKIE.length + 1)) : "";
  return CODE_PATTERN.test(code) ? code : null;
}

export const isValidCode = (code: string) => CODE_PATTERN.test(code.trim());

/**
 * The plan this browser holds; null on the server and before hydration, so the static page is always the free
 * page. The clock is read only inside the effect (render stays pure): there an expired plan is cleared, a due
 * plan is re-checked once, and a cookie from the 診断 site is tried when nothing is stored yet. A failed check
 * keeps the plan until it is no longer paid for.
 */
export function usePlan(): StoredPlan | null {
  const stored = useLocalStore(planStore);

  useEffect(() => {
    const now = Date.now();
    if (stored && now >= stored.paidUntil) {
      planStore.clear();
      return;
    }
    const code = stored?.code ?? codeFromCookie();
    if (!code || (stored && now < stored.checkAfter)) return;
    let cancelled = false;
    checkPlan(code).then(
      (result) => {
        if (!cancelled) applyPlan(result);
      },
      () => {
        if (!cancelled && stored && Date.now() >= stored.paidUntil) planStore.clear();
      },
    );
    return () => {
      cancelled = true;
    };
  }, [stored]);

  return stored;
}
