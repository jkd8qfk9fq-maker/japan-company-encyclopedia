import { describe, expect, it } from "vitest";
import { indicators } from "../src/data/indicators";

/**
 * The Step 5 snapshots (JCE-107): the eight series that
 * docs/jce-078-analysis-saas-spec.md §4 defines as coming from Japanese
 * primary sources. Each must be registered, carry at least the spec's
 * two-year minimum of observations, and name the publisher's own domain as
 * its source — a snapshot silently replaced by a secondary aggregator, or
 * dropped from the registry, fails here even though the generic integrity
 * suite would still pass.
 */
const PRIMARY_SERIES: {
  id: string;
  frequency: "monthly" | "quarterly";
  sourceHost: string;
}[] = [
  { id: "japan-cpi", frequency: "monthly", sourceHost: "www.stat.go.jp" },
  { id: "japan-cgpi", frequency: "monthly", sourceHost: "www.stat-search.boj.or.jp" },
  { id: "japan-industrial-production", frequency: "monthly", sourceHost: "www.meti.go.jp" },
  { id: "japan-job-offers-ratio", frequency: "monthly", sourceHost: "www.e-stat.go.jp" },
  { id: "japan-real-wages", frequency: "monthly", sourceHost: "www.e-stat.go.jp" },
  { id: "japan-exports", frequency: "monthly", sourceHost: "www.e-stat.go.jp" },
  { id: "japan-current-account", frequency: "monthly", sourceHost: "www.stat-search.boj.or.jp" },
  { id: "boj-tankan-di", frequency: "quarterly", sourceHost: "www.stat-search.boj.or.jp" },
];

describe("primary-source indicator snapshots (JCE-107)", () => {
  it("registers every series the spec defines, alongside the FRED series", () => {
    const ids = indicators.map((indicator) => indicator.id);
    for (const series of PRIMARY_SERIES) {
      expect(ids).toContain(series.id);
    }
    // The seven series fetch-indicators.py has carried since JCE-081.
    for (const id of [
      "japan-real-gdp",
      "japan-unemployment-rate",
      "us-real-gdp",
      "us-cpi",
      "us-nonfarm-payroll",
      "us-federal-funds-rate",
      "usd-jpy",
    ]) {
      expect(ids).toContain(id);
    }
    expect(ids).toHaveLength(15);
  });

  it.each(PRIMARY_SERIES)(
    "$id is a $frequency series sourced from its publisher",
    (series) => {
      const indicator = indicators.find((entry) => entry.id === series.id);
      expect(indicator).toBeDefined();
      expect(indicator!.frequency).toBe(series.frequency);
      expect(new URL(indicator!.source.url).hostname).toBe(series.sourceHost);
      expect(indicator!.observations.length).toBeGreaterThanOrEqual(24);
    },
  );
});
