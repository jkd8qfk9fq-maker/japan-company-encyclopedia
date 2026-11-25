import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { companies } from "@/data/companies";
import { CompanyAnalysisSection, MeaningEntrance } from "@/components/company/company-analysis";
import { companyAnalysis } from "@/lib/company-analysis";
import { MEANING_QUESTIONS, meaningQuestions, meaningSummary, sentenceText } from "@/lib/meaning-layer";
import { isReleased } from "@/lib/release";

/**
 * The meaning layer's paid boundary (JCE-120): 「この会社の今」's answers are the analysis layer's core,
 * so a reader without the entitlement sees the entrance only — the heading and the questions this
 * company answers — and no sentence and no assembled answer reaches the free view. The server render
 * is the free view (the server holds no plan), so the boundary is asserted on the static markup.
 */

const released = companies.filter(isReleased);
const company = released.find((c) => meaningSummary(companyAnalysis(c, released).perspectives.flatMap((p) => p.groups)).length > 0)!;
const sentences = meaningSummary(companyAnalysis(company, released).perspectives.flatMap((p) => p.groups));

describe("meaningQuestions — what the entrance may show", () => {
  it("lists the answered questions in the fixed q1 → q2 → q3 order", () => {
    const qs = meaningQuestions(sentences);
    expect(qs.length).toBeGreaterThan(0);
    expect(qs).toEqual([...qs].sort());
    for (const q of qs) expect(sentences.some((s) => s.question === q)).toBe(true);
  });

  it("is empty when there is no summary", () => {
    expect(meaningQuestions([])).toEqual([]);
  });
});

describe("the free entrance", () => {
  const html = renderToStaticMarkup(createElement(MeaningEntrance, { sentences }));

  it("shows the heading and the questions, and no answer", () => {
    expect(html).toContain("この会社の今");
    for (const q of meaningQuestions(sentences)) expect(html).toContain(MEANING_QUESTIONS[q]);
    for (const s of sentences) expect(html).not.toContain(sentenceText(s));
  });
});

describe("the gate on the company page's static markup (the free view)", () => {
  const html = renderToStaticMarkup(createElement(CompanyAnalysisSection, { company, companies: released }));

  it("renders the entrance and withholds every sentence", () => {
    expect(html).toContain("この会社の今");
    for (const s of sentences) expect(html).not.toContain(sentenceText(s));
  });

  it("offers the code entry that opens the answers", () => {
    expect(html).toContain("コードで開く");
  });
});
