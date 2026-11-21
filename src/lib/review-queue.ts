import { addDays } from "@/lib/jst-dates";

/**
 * The review queue (JCE-082): spaced repetition, kept deliberately simple. A question answered in a lesson
 * comes back after a day; each time it is answered right it waits longer (1 → 3 → 7 → 21 days), and a wrong
 * answer brings it back the next day. Nothing about the queue punishes: a question that waits is not lost,
 * and the queue simply holds what is due, however long the reader was away.
 */

export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 21] as const;

export type ReviewState = {
  /** How many intervals the question has climbed, capped at the last one. */
  stage: number;
  /** The JST day (YYYY-MM-DD) from which the question is due again. */
  due: string;
};

export function scheduleReview(prev: ReviewState | undefined, correct: boolean, day: string): ReviewState {
  if (!correct) return { stage: 0, due: addDays(day, REVIEW_INTERVALS_DAYS[0]) };
  const stage = prev ? Math.min(prev.stage + 1, REVIEW_INTERVALS_DAYS.length - 1) : 0;
  return { stage, due: addDays(day, REVIEW_INTERVALS_DAYS[stage]) };
}

/** The ids due on or before `today`, most overdue first. */
export function dueReviewIds(review: Record<string, ReviewState>, today: string): string[] {
  return Object.entries(review)
    .filter(([, s]) => s.due <= today)
    .sort((a, b) => a[1].due.localeCompare(b[1].due) || a[0].localeCompare(b[0]))
    .map(([id]) => id);
}
