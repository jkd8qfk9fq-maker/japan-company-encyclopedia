/**
 * Calendar arithmetic on JST day strings (YYYY-MM-DD), shared by the learning schedule (JCE-082) and the
 * earnings digest. Days are counted on the UTC calendar of the string itself, the same convention as the
 * streak (JCE-052): a day string is a label, not an instant, so no timezone conversion happens here.
 */

const toIndex = (day: string) => Math.round(Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10)) / 86_400_000);
const fromIndex = (index: number) => new Date(index * 86_400_000).toISOString().slice(0, 10);

export const addDays = (day: string, n: number): string => fromIndex(toIndex(day) + n);

/** Monday of the week (Mon–Sun) containing `day`. */
export const weekStart = (day: string): string => {
  const dow = new Date(toIndex(day) * 86_400_000).getUTCDay(); // 0 = Sunday
  return addDays(day, -((dow + 6) % 7));
};

/** Sunday of the week (Mon–Sun) containing `day`. */
export const weekEnd = (day: string): string => addDays(weekStart(day), 6);
