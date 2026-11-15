import { describe, expect, it } from "vitest";
import { achievements } from "../src/lib/achievements";
import { computeStreak, recentDays } from "../src/lib/streak";

/** JCE-052: a forgiving streak and achievements computed from what the browser holds. */

describe("computeStreak", () => {
  it("counts consecutive days, alive until tomorrow", () => {
    expect(computeStreak(["2026-11-13", "2026-11-14", "2026-11-15"], "2026-11-15")).toMatchObject({ current: 3, activeToday: true });
    expect(computeStreak(["2026-11-13", "2026-11-14"], "2026-11-15")).toMatchObject({ current: 2, activeToday: false });
  });

  it("skips one missed day in a week, but not two in a row", () => {
    expect(computeStreak(["2026-11-10", "2026-11-11", "2026-11-13", "2026-11-14"], "2026-11-14")).toMatchObject({ current: 4, restDaysUsed: 1 });
    expect(computeStreak(["2026-11-10", "2026-11-11", "2026-11-14"], "2026-11-14").current).toBe(1);
  });

  it("does not skip two missed days within seven", () => {
    expect(computeStreak(["2026-11-08", "2026-11-10", "2026-11-12", "2026-11-13"], "2026-11-13").current).toBe(3);
  });

  it("remembers the best run", () => {
    expect(computeStreak(["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-04", "2026-11-15"], "2026-11-15")).toMatchObject({ current: 1, best: 4 });
  });

  it("is zero for a reader who has not been back", () => {
    expect(computeStreak(["2026-11-01"], "2026-11-15").current).toBe(0);
  });
});

describe("recentDays", () => {
  it("lists the last n days ending today", () => {
    const days = recentDays(["2026-11-15", "2026-11-13"], "2026-11-15", 3);
    expect(days).toEqual([
      { day: "2026-11-13", active: true },
      { day: "2026-11-14", active: false },
      { day: "2026-11-15", active: true },
    ]);
  });
});

describe("achievements", () => {
  const base = { met: 0, industriesMet: 0, industriesTotal: 19, quizCorrect: 0, quizDays: 0, bestStreak: 0, following: 0, exploreSteps: 0 };
  it("shows earned tiers and only the next unearned one", () => {
    const list = achievements({ ...base, met: 12 });
    const met = list.filter((a) => a.id.startsWith("met-"));
    expect(met.map((a) => [a.goal, a.earned])).toEqual([[1, true], [10, true], [50, false]]);
    expect(met[2].value).toBe(12);
  });
  it("ends the industries ladder at every industry", () => {
    const ind = achievements({ ...base, industriesMet: 19 }).filter((a) => a.id.startsWith("industries-"));
    expect(ind.map((a) => a.goal)).toEqual([3, 10, 19]);
    expect(ind.every((a) => a.earned)).toBe(true);
  });
});
