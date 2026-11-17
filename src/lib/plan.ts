"use client";

import { useEffect } from "react";
import { useLocalStore } from "@/hooks/use-local-store";
import { planStore, type StoredPlan } from "@/lib/storage/stores";

/**
 * The YUGENQ premium plan on this site (JCE-043). The plan is sold and checked on the 企業タイプ診断 site; its
 * `/api/plan` accepts this site's origin and answers whether a purchase code is paid for now. The code reaches
 * this site in one of two ways: the reader types it in, or the 診断 site left it in a cookie on the parent
 * domain after a successful check (`yugenq_plan`). Either way it is sent only to that endpoint, and what comes
 * back is kept in localStorage through the storage layer (invariant 7). Nothing about the reader is sent.
 */

export const PLAN_ENDPOINT = "https://shindan.kigyo-hyakka.com/api/plan";
export const CHECKOUT_ENDPOINT = "https://shindan.kigyo-hyakka.com/api/checkout";
export const PLAN_PAGE = "https://shindan.kigyo-hyakka.com/plan/";
const COOKIE = "yugenq_plan";
const CODE_PATTERN = /^sub_[A-Za-z0-9]{8,64}$/;

type PlanResponse = { active: false } | { active: true; code: string; paidUntil: number; checkAfter: number };

export async function checkPlan(code: string): Promise<PlanResponse> {
  const response = await fetch(PLAN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) throw new Error(`plan check failed: ${response.status}`);
  return (await response.json()) as PlanResponse;
}

/**
 * Starts Stripe Checkout for the plan from this site (JCE-043 / the 診断 site's CTS-024): the 診断 site's worker creates
 * the session and sends the buyer back to `returnTo` (this page) once the code is saved there — and, through the
 * parent-domain cookie, here. Card details never touch either site.
 */
export async function startCheckout(returnTo: string): Promise<void> {
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
  const plan = result.active ? { code: result.code, paidUntil: result.paidUntil, checkAfter: result.checkAfter } : null;
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
