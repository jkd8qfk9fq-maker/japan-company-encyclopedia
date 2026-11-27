import { createElement } from "react";
import { renderToReadableStream } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { companies } from "@/data/companies";
import { CompanyReport } from "@/components/company/company-report";
import { companyAnalysis } from "@/lib/company-analysis";
import { meaningSummary, sentenceText } from "@/lib/meaning-layer";
import { nextPrintPanelState, PRINT_FALLBACK_DELAY_MS, type PrintPanelState } from "@/lib/print-flow";
import { isReleased } from "@/lib/release";

/**
 * The print button's fallback and the print page (JCE-135). The state machine is pure, so its
 * transitions are asserted directly. The print page is CompanyReport with `printView` — the same
 * component through the same gates (PremiumGate, MeaningGate, AnalysisGate), never a second
 * rendering — so its paid boundary is asserted as identity with the report's own: for every
 * marker that lives behind a gate, the print page shows it exactly when the report does. The
 * server render is the free view (the server holds no plan), so the analysis layer's locked
 * content is asserted absent from both, as in the meaning-gate tests.
 */

describe("the no-dialog watch (print-flow)", () => {
  const run = (events: Parameters<typeof nextPrintPanelState>[1][]): PrintPanelState =>
    events.reduce<PrintPanelState>((state, event) => nextPrintPanelState(state, event), "idle");

  it("waits a short, fixed time before concluding the dialog never opened", () => {
    expect(PRINT_FALLBACK_DELAY_MS).toBe(600);
  });

  it("shows guidance when an attempt's wait expires in silence", () => {
    expect(run(["attempt", "timeout"])).toBe("guidance");
  });

  it("shows nothing when the dialog opens in time", () => {
    expect(run(["attempt", "beforeprint"])).toBe("idle");
    expect(run(["attempt", "beforeprint", "timeout"])).toBe("idle");
  });

  it("ignores a stray timeout outside an attempt", () => {
    expect(run(["timeout"])).toBe("idle");
    expect(run(["attempt", "timeout", "close", "timeout"])).toBe("idle");
  });

  it("closes on request, and a retry re-arms the watch and hides the guidance", () => {
    expect(run(["attempt", "timeout", "close"])).toBe("idle");
    expect(run(["attempt", "timeout", "attempt"])).toBe("awaiting");
    expect(run(["attempt", "timeout", "attempt", "beforeprint"])).toBe("idle");
  });
});

const released = companies.filter(isReleased);
const company = released.find(
  (c) => meaningSummary(companyAnalysis(c, released).perspectives.flatMap((p) => p.groups)).length > 0,
)!;
const sentences = meaningSummary(companyAnalysis(company, released).perspectives.flatMap((p) => p.groups));

const renderReport = async (printView: boolean): Promise<string> => {
  const stream = await renderToReadableStream(
    createElement(CompanyReport, { company, companies: released, revisions: [], printView }),
  );
  await stream.allReady;
  return new Response(stream).text();
};

const detailTags = (html: string): string[] => html.match(/<details[^>]*>/g) ?? [];

describe("the print page (CompanyReport with printView)", async () => {
  const html = await renderReport(true);
  const reportHtml = await renderReport(false);

  it("renders every fold it shows already open", () => {
    const tags = detailTags(html);
    expect(tags.length).toBeGreaterThan(0);
    for (const tag of tags) expect(tag).toContain("open");
  });

  it("keeps the meaning layer's answers behind the same gate as the report", () => {
    expect(html).toContain("この会社の今");
    for (const s of sentences) expect(html).not.toContain(sentenceText(s));
  });

  it("holds exactly the report's paid boundary, gate by gate", () => {
    // Markers that live behind each gate: a fold inside PremiumGate, the gated detail heading
    // inside AnalysisGate, the gate panel itself, and every meaning sentence behind MeaningGate.
    // (PremiumGate currently stands open under PREMIUM_FEATURES_OPEN — on the report too — so
    // what is asserted is identity with the report, not a particular flag's state.)
    const markers = [
      "5期の数字の表",
      "— 分布の全体像",
      "分析の詳細（分布・推移・経済指標）",
      ...sentences.map((s) => sentenceText(s)),
    ];
    for (const marker of markers) expect(html.includes(marker)).toBe(reportHtml.includes(marker));
  });

  it("drops the screen furniture: no table of contents, no chapter nav", () => {
    expect(html).not.toContain("畳んである数字の表も、すべて開いた状態で印刷されます");
  });
});

describe("the report itself (no printView)", async () => {
  const html = await renderReport(false);

  it("still folds its tables on screen", () => {
    const tags = detailTags(html);
    expect(tags.length).toBeGreaterThan(0);
    expect(tags.some((tag) => !tag.includes("open"))).toBe(true);
  });

  it("carries the standing way to the print page beside the print button", () => {
    expect(html).toContain("印刷が開かない場合は印刷用ページへ");
    expect(html).toContain(`href="/companies/${company.id}/report/print"`);
  });
});
