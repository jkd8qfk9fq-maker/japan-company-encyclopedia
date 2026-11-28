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
  /** The unit's colour: banner, nodes, bars. Three colours, cycling by unit (eight units since JCE-145). */
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
  // Brand-aligned (audit part 1, polish 21): the primary action, the progress bar and the "correct"
  // verdict wear the encyclopedia's navy #0D2B4C and its sky tint, not a separate green system. The
  // wrong-answer red stays — it is a functional signal, not a brand colour. Unit accents (UNIT_STYLES)
  // stay as the path's per-unit identity; the SELECTION state no longer borrows them (minor 17), so a
  // chosen option reads the same in every lesson: `select` / `selectSoft` below.
  cta: "#0D2B4C",
  ctaDark: "#071A30",
  ctaSoft: "#E8F1FA",
  select: "#0D2B4C",
  selectSoft: "#E8F1FA",
  wrong: "#e5484d",
  wrongSoft: "#fdecec",
  navy: "#0D2B4C",
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

/**
 * Points, on the same counting as every other progress display (M4). The store is append-only and is
 * never pruned when the course changes, so it can hold answers, lesson records and review entries for
 * questions and lessons the current course no longer has; counting those raw keys once inflated the
 * totals against the path's ring (which counts only lessons the current course judges done). When the
 * caller has the course — every production caller does — the breakdown counts only the current course:
 * answers to its questions, lessons `lessonDone` judges finished, and review stages of its questions.
 * Without a course the raw store counts are used, which is exact only for a store with no stale ids.
 */
export function pointsBreakdown(progress: MicroProgress, verifiedCount: number, units?: MicroUnit[]): PointsBreakdown {
  const answers = (units ? courseAnswerCount(units, progress) : Object.keys(progress.answers).length) * POINTS.answer;
  const lessons = (units ? courseFraction(units, progress).done : Object.keys(progress.lessons).length) * POINTS.lessonDone;
  const reviewStages = units
    ? [...courseQuestionIds(units)].reduce((sum, id) => sum + (progress.review[id]?.stage ?? 0), 0)
    : Object.values(progress.review).reduce((sum, s) => sum + s.stage, 0);
  const review = reviewStages * POINTS.reviewStage;
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
// The one counting every progress display shares (M4). The store's `lessons` map is a record of the day a
// lesson was finished, not the definition of finished: the definition is `lessonDone` above, judged from
// the answers against the current course. Displays that counted the map's keys (or every answer key) read
// stale ids left by earlier course versions as progress the path does not show — the same reader saw
// "4/35" on the ring and "26/35" in the record. So: lesson counts always go through `courseFraction` /
// `unitFraction`, answer counts through `courseAnswerCount`, and a finished lesson's day through
// `lessonDoneDay` (the recorded day, falling back to its last answer's day for a lesson finished before
// the day was recorded, or whose record a course change orphaned).

/** The question ids the current course asks — the scope of every answer and review count. */
export function courseQuestionIds(units: MicroUnit[]): Set<string> {
  const ids = new Set<string>();
  for (const unit of units) for (const lesson of unit.lessons) for (const q of lesson.questions) ids.add(q.id);
  return ids;
}

/** Answers that belong to the current course: its questions, answered (the first answer is the one kept). */
export function courseAnswerCount(units: MicroUnit[], progress: MicroProgress): number {
  const ids = courseQuestionIds(units);
  return Object.keys(progress.answers).filter((id) => ids.has(id)).length;
}

/** The JST day a finished lesson was finished on, or undefined while it is not `lessonDone`. */
export function lessonDoneDay(lesson: MicroLesson, progress: MicroProgress): string | undefined {
  if (!lessonDone(lesson, progress)) return undefined;
  const recorded = progress.lessons[lesson.id];
  if (recorded) return recorded;
  const days = lesson.questions.map((q) => progress.answers[q.id]?.day).filter((d): d is string => Boolean(d));
  return days.length ? days.sort().at(-1) : undefined;
}

/** One day per lesson the current course judges finished — the monthly "lessons finished" count's input. */
export function doneLessonDays(units: MicroUnit[], progress: MicroProgress): string[] {
  const days: string[] = [];
  for (const unit of units) for (const lesson of unit.lessons) {
    const day = lessonDoneDay(lesson, progress);
    if (day) days.push(day);
  }
  return days;
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
