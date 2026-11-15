/**
 * The streak (JCE-052): consecutive days on which the reader explored something, counted in JST.
 *
 * Forgiving by design: one missed day in any seven is skipped over, so a busy day does not undo weeks of habit, and
 * a streak is still "alive" today until the reader comes back tomorrow. It never says anything is lost: it only counts
 * what has been done. Nothing here punishes or nags.
 */

const toIndex = (day: string) => Math.round(Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10)) / 86_400_000);

export type Streak = { current: number; best: number; activeToday: boolean; restDaysUsed: number };

/** Length of the run ending at `end` (a day index), skipping at most one missed day in any seven. */
function runEnding(active: Set<number>, end: number): { length: number; rests: number } {
  let length = 0;
  let rests = 0;
  let lastRest = Number.POSITIVE_INFINITY;
  for (let d = end; ; d--) {
    if (active.has(d)) {
      length++;
      continue;
    }
    // A missed day may be skipped if no other was skipped within the seven days after it, and the run continues before it.
    if (lastRest - d >= 7 && active.has(d - 1) && length > 0) {
      lastRest = d;
      rests++;
      continue;
    }
    return { length, rests };
  }
}

export function computeStreak(days: string[], today: string): Streak {
  const active = new Set(days.map(toIndex));
  const t = toIndex(today);
  const activeToday = active.has(t);
  const live = activeToday ? runEnding(active, t) : runEnding(active, t - 1);
  let best = live.length;
  for (const d of active) if (!active.has(d + 1)) best = Math.max(best, runEnding(active, d).length);
  return { current: live.length, best, activeToday, restDaysUsed: live.rests };
}

/** The last `n` days ending today, oldest first, each with whether the reader was active. */
export function recentDays(days: string[], today: string, n = 14): { day: string; active: boolean }[] {
  const active = new Set(days);
  const t = toIndex(today);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date((t - (n - 1 - i)) * 86_400_000).toISOString().slice(0, 10);
    return { day: d, active: active.has(d) };
  });
}
