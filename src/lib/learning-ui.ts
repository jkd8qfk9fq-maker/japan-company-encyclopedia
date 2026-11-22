import { weekEnd, weekStart } from "@/lib/jst-dates";
import type { MicroLesson, MicroUnit } from "@/lib/micro-lessons";
import type { MicroProgress } from "@/lib/storage/stores";

/**
 * The learning home's presentation logic (JCE-088): the Duolingo-style path, made from the facts the
 * micro-lesson store already keeps. Everything here is a pure function of the existing progress record —
 * no new storage, no migration: answers, lesson days and the review schedule were already recorded by
 * JCE-082, and a prediction's verification is derived from the site's data (JCE-083), never stored.
 *
 * What is deliberately not here (docs/decisions.md, JCE-088, following the market analysis): no league or
 * ranking, no hearts/energy, no currency economy, and no daily streak that resets to zero. The streak's
 * place is taken by a weekly rhythm (learning days this week) plus running totals, and points are paid for
 * the acts that make the training work — answering and reading the explanation, finishing a lesson,
 * climbing the review intervals, and seeing a prediction through to its verification — never for a correct
 * answer alone, so there is nothing to farm by re-answering easy questions.
 */

export type UnitStyle = {
  /** The unit's colour: banner, nodes, bars. Three colours, cycling by unit (six units since JCE-090). */
  main: string;
  /** The darker shade under a raised button and at the edge of a filled node. */
  dark: string;
  /** The pale tint behind the banner and the guidebook panel. */
  soft: string;
};

export const UNIT_STYLES: UnitStyle[] = [
  { main: "#1e9bf0", dark: "#1473b8", soft: "#e6f4fe" },
  { main: "#ed8f00", dark: "#c77400", soft: "#fef3e0" },
  { main: "#9b5de5", dark: "#7738c4", soft: "#f3eafc" },
];

export const unitStyle = (unitIndex: number): UnitStyle => UNIT_STYLES[unitIndex % UNIT_STYLES.length];

/** The one call-to-action colour of the learning area, and the feedback colours of the player. */
export const LEARN = {
  cta: "#3fa91c",
  ctaDark: "#2e7d12",
  ctaSoft: "#eaf7e3",
  wrong: "#e5484d",
  wrongSoft: "#fdecec",
  navy: "#16324f",
  ink: "#22303c",
  muted: "#5b6b7a",
  line: "#e3eaf1",
  track: "#e8eef3",
} as const;

// ---------------------------------------------------------------------------------------------------------------
// Points: a running total derived from the record, with the rates stated where a reader can find them.

export const POINTS = {
  /** Per question answered (the explanation is shown either way — answering is the act). */
  answer: 2,
  /** Per lesson finished for the first time. */
  lessonDone: 10,
  /** Per review interval climbed, summed over the queue: a question remembered after a gap. */
  reviewStage: 3,
  /** Per prediction carried through to verification against the printed filing. */
  verified: 20,
} as const;

export type PointsBreakdown = {
  answers: number;
  lessons: number;
  review: number;
  verified: number;
  total: number;
};

export function pointsBreakdown(progress: MicroProgress, verifiedCount: number): PointsBreakdown {
  const answers = Object.keys(progress.answers).length * POINTS.answer;
  const lessons = Object.keys(progress.lessons).length * POINTS.lessonDone;
  const review = Object.values(progress.review).reduce((sum, s) => sum + s.stage, 0) * POINTS.reviewStage;
  const verified = verifiedCount * POINTS.verified;
  return { answers, lessons, review, verified, total: answers + lessons + review + verified };
}

// ---------------------------------------------------------------------------------------------------------------
// Node states on the path.

export type NodeState = "done" | "next" | "doing" | "todo";

/** How much of a lesson is answered, 0..1 — the ring around a node in progress. */
export function lessonFraction(lesson: MicroLesson, progress: MicroProgress): number {
  if (lesson.questions.length === 0) return 0;
  const answered = lesson.questions.filter((q) => progress.answers[q.id]).length;
  return answered / lesson.questions.length;
}

export function lessonDone(lesson: MicroLesson, progress: MicroProgress): boolean {
  return lesson.questions.length > 0 && lesson.questions.every((q) => progress.answers[q.id]);
}

/**
 * The state of every lesson on the path, in course order. The path is linear: the first unfinished lesson
 * is "next" (次はここ), an unfinished lesson behind it that has been started is "doing", and one not yet
 * reached and untouched is "todo". A finished lesson is "done" wherever it sits.
 */
export function nodeStates(units: MicroUnit[], progress: MicroProgress): Map<string, NodeState> {
  const out = new Map<string, NodeState>();
  let nextFound = false;
  for (const unit of units) {
    for (const lesson of unit.lessons) {
      if (lessonDone(lesson, progress)) {
        out.set(lesson.id, "done");
      } else if (!nextFound) {
        out.set(lesson.id, "next");
        nextFound = true;
      } else if (lessonFraction(lesson, progress) > 0) {
        out.set(lesson.id, "doing");
      } else {
        out.set(lesson.id, "todo");
      }
    }
  }
  return out;
}

/** The lesson the path points at now — the target of the "back to where you are" button. */
export function nextLessonId(units: MicroUnit[], progress: MicroProgress): string | null {
  for (const unit of units) for (const lesson of unit.lessons) if (!lessonDone(lesson, progress)) return lesson.id;
  return null;
}

export function unitFraction(unit: MicroUnit, progress: MicroProgress): { done: number; total: number } {
  return { done: unit.lessons.filter((l) => lessonDone(l, progress)).length, total: unit.lessons.length };
}

export function courseFraction(units: MicroUnit[], progress: MicroProgress): { done: number; total: number } {
  const parts = units.map((u) => unitFraction(u, progress));
  return { done: parts.reduce((s, p) => s + p.done, 0), total: parts.reduce((s, p) => s + p.total, 0) };
}

// ---------------------------------------------------------------------------------------------------------------
// The weekly rhythm: learning days, not a daily streak. A day counts when a question was answered or a
// lesson finished on it — both already carry their JST day in the store.

export function learningDays(progress: MicroProgress): string[] {
  const days = new Set<string>();
  for (const a of Object.values(progress.answers)) days.add(a.day);
  for (const d of Object.values(progress.lessons)) days.add(d);
  return [...days].sort();
}

export function learningDaysThisWeek(progress: MicroProgress, today: string): number {
  const start = weekStart(today);
  const end = weekEnd(today);
  return learningDays(progress).filter((d) => d >= start && d <= end).length;
}
