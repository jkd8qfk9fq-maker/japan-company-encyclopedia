import { describe, expect, it } from "vitest";
import {
  courseFraction,
  learningDays,
  learningDaysThisWeek,
  lessonDone,
  nodeStates,
  pointsBreakdown,
  unitStyle,
  UNIT_STYLES,
} from "@/lib/learning-ui";
import type { MicroUnit } from "@/lib/micro-lessons";
import type { MicroProgress } from "@/lib/storage/stores";

/**
 * JCE-088: the path, the points and the weekly rhythm are pure readings of the JCE-082 progress record —
 * these tests pin that no state is invented: a node is done only when every question carries an answer,
 * points follow the stated rates and never reward a correct answer as such, and a learning day is a day
 * an answer or a finished lesson was actually recorded.
 */

const question = (id: string) => ({
  id,
  kind: "figure",
  prompt: id,
  options: [{ id: "a", label: "a" }],
  answer: "a",
  explain: "",
  companyId: "toyota",
  sourceIds: [],
  sourceTitle: "",
  period: "",
});

const unit = (id: string, lessonIds: string[]): MicroUnit => ({
  id,
  title: id,
  intro: "",
  plannedLessons: [],
  lessons: lessonIds.map((lid) => ({
    id: lid,
    title: lid,
    minutes: 3,
    body: [],
    questions: [question(`${lid}-q1`), question(`${lid}-q2`)],
  })),
});

const progress = (over: Partial<MicroProgress>): MicroProgress => ({ answers: {}, lessons: {}, review: {}, ...over });
const answer = (day = "2026-11-20") => ({ choice: "a", correct: false, day });

describe("nodeStates", () => {
  const units = [unit("u1", ["l1", "l2"]), unit("u2", ["l3"])];

  it("points at the first lesson when nothing is answered", () => {
    const states = nodeStates(units, progress({}));
    expect(states.get("l1")).toBe("next");
    expect(states.get("l2")).toBe("todo");
    expect(states.get("l3")).toBe("todo");
  });

  it("marks a finished lesson done and moves 次はここ to the next one", () => {
    const p = progress({ answers: { "l1-q1": answer(), "l1-q2": answer() }, lessons: { l1: "2026-11-20" } });
    const states = nodeStates(units, p);
    expect(states.get("l1")).toBe("done");
    expect(states.get("l2")).toBe("next");
    expect(lessonDone(units[0].lessons[0], p)).toBe(true);
    expect(courseFraction(units, p)).toEqual({ done: 1, total: 3 });
  });

  it("keeps a started lesson behind the pointer as doing, not todo", () => {
    const p = progress({ answers: { "l2-q1": answer() } });
    const states = nodeStates(units, p);
    expect(states.get("l1")).toBe("next");
    expect(states.get("l2")).toBe("doing");
  });
});

describe("pointsBreakdown", () => {
  it("pays for acts, at the stated rates, and not for correctness", () => {
    const p = progress({
      answers: { q1: answer(), q2: answer(), q3: answer() },
      lessons: { l1: "2026-11-20" },
      review: { q1: { stage: 2, due: "2026-11-27" }, q2: { stage: 1, due: "2026-11-24" } },
    });
    // 3 answers ×2 + 1 lesson ×10 + (2+1) stages ×3 + 2 verified ×20 = 6 + 10 + 9 + 40.
    expect(pointsBreakdown(p, 2)).toEqual({ answers: 6, lessons: 10, review: 9, verified: 40, total: 65 });
  });

  it("is zero on an empty record", () => {
    expect(pointsBreakdown(progress({}), 0).total).toBe(0);
  });
});

describe("the weekly rhythm", () => {
  it("collects learning days from answers and finished lessons, once each", () => {
    const p = progress({
      answers: { q1: answer("2026-11-17"), q2: answer("2026-11-17"), q3: answer("2026-11-19") },
      lessons: { l1: "2026-11-19" },
    });
    expect(learningDays(p)).toEqual(["2026-11-17", "2026-11-19"]);
    // 2026-11-22 is a Sunday; its JST week runs Mon 2026-11-16 – Sun 2026-11-22.
    expect(learningDaysThisWeek(p, "2026-11-22")).toBe(2);
    expect(learningDaysThisWeek(p, "2026-11-30")).toBe(0);
  });
});

describe("unit styles", () => {
  it("has exactly three unit colours and cycles by unit", () => {
    expect(UNIT_STYLES).toHaveLength(3);
    expect(unitStyle(0)).toBe(UNIT_STYLES[0]);
    expect(unitStyle(3)).toBe(UNIT_STYLES[0]);
  });
});
