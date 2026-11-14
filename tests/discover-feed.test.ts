import { describe, expect, it } from "vitest";
import { dailyOrder, feedOrder } from "../src/components/discover/discover-data";

/** The DISCOVER order (JCE-046, JCE-048): the same shuffle for everyone each day, followed industries first. */

const cards = Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, industry: { id: ["auto", "food", "it"][i % 3] } }));

describe("feedOrder", () => {
  it("is the day's shuffle when nothing is followed or met", () => {
    expect(feedOrder(cards, "2026-11-15", { industry: "all", met: new Set(), followed: [] })).toEqual(dailyOrder(cards, "2026-11-15"));
  });

  it("puts followed industries first, in the order they were followed", () => {
    const out = feedOrder(cards, "2026-11-15", { industry: "all", met: new Set(), followed: ["it", "food"] });
    expect(out.slice(0, 10).every((c) => c.industry.id === "it")).toBe(true);
    expect(out.slice(10, 20).every((c) => c.industry.id === "food")).toBe(true);
    expect(out.slice(20).every((c) => c.industry.id === "auto")).toBe(true);
    // The day's shuffle is kept inside a group.
    const day = dailyOrder(cards, "2026-11-15").filter((c) => c.industry.id === "it");
    expect(out.slice(0, 10)).toEqual(day);
  });

  it("sends met companies to the back of their own group", () => {
    const firstIt = feedOrder(cards, "2026-11-15", { industry: "all", met: new Set(), followed: ["it"] })[0];
    const out = feedOrder(cards, "2026-11-15", { industry: "all", met: new Set([firstIt.id]), followed: ["it"] });
    expect(out[9].id).toBe(firstIt.id);
    expect(out[10].industry.id).not.toBe("it");
  });

  it("keeps to the chosen industry when filtered", () => {
    const out = feedOrder(cards, "2026-11-15", { industry: "food", met: new Set(), followed: ["it"] });
    expect(out).toHaveLength(10);
    expect(out.every((c) => c.industry.id === "food")).toBe(true);
  });
});
