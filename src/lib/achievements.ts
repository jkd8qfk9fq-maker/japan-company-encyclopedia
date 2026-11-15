/**
 * Achievements (JCE-052): milestones of what the reader has learned, computed from what this browser already holds —
 * never stored, never ranked against anyone else, never bought. Each has a next step the reader can see, so the
 * reward is the knowledge on the way, not a badge to chase.
 */

export type Progress = {
  met: number;
  industriesMet: number;
  industriesTotal: number;
  quizCorrect: number;
  quizDays: number;
  bestStreak: number;
  following: number;
  exploreSteps: number;
};

export type Achievement = { id: string; title: string; detail: string; value: number; goal: number; earned: boolean };

type Def = { id: string; title: string; detail: (goal: number) => string; value: (p: Progress) => number; goals: number[] };

const DEFS: Def[] = [
  { id: "met", title: "会社に出会う", detail: (g) => `DISCOVER などで${g}社に出会う`, value: (p) => p.met, goals: [1, 10, 50, 100, 300] },
  { id: "industries", title: "業界を歩く", detail: (g) => `${g}つの業界の会社に出会う`, value: (p) => p.industriesMet, goals: [3, 10] },
  { id: "quiz", title: "1問ずつ知る", detail: (g) => `毎日の1問に${g}問正解する`, value: (p) => p.quizCorrect, goals: [1, 7, 30] },
  { id: "streak", title: "続けて開く", detail: (g) => `${g}日続けて会社を知る`, value: (p) => p.bestStreak, goals: [3, 7, 30] },
  { id: "follow", title: "決算を追う", detail: (g) => `${g}社をフォローする`, value: (p) => p.following, goals: [1, 5] },
  { id: "explore", title: "つながりをたどる", detail: (g) => `つながりを${g}回たどる`, value: (p) => p.exploreSteps, goals: [5, 30] },
];

/** Every earned tier, plus the next one of each kind; an all-industries tier once the reader is near it. */
export function achievements(p: Progress): Achievement[] {
  const out: Achievement[] = [];
  for (const def of DEFS) {
    const goals = def.id === "industries" ? [...def.goals, p.industriesTotal] : def.goals;
    const value = def.value(p);
    for (const goal of [...new Set(goals)].filter((g) => g > 0)) {
      const earned = value >= goal;
      out.push({ id: `${def.id}-${goal}`, title: def.title, detail: def.detail(goal), value: Math.min(value, goal), goal, earned });
      if (!earned) break; // only the next unearned tier is shown
    }
  }
  return out;
}
