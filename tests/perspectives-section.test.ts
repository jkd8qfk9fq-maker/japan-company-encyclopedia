import { createElement } from "react";
import { renderToReadableStream } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PerspectivesSection } from "@/components/company/perspectives-section";
import { companies } from "@/data/companies";

/**
 * JCE-152: the mobile swipe guide joined the three question labels with `.join("・")` while they were
 * `<T>` elements, so the page showed "[object Object]・[object Object]・[object Object]" — and the
 * region's aria-label stringified the same way. Labels are plain messages now, joined as strings.
 */
describe("perspectives section (JCE-152)", async () => {
  // The section is an async Server Component (industry lookup), so it is rendered as a stream and read whole.
  const abist = companies.find((c) => c.id === "abist")!;
  const stream = await renderToReadableStream(createElement(PerspectivesSection, { company: abist }));
  await stream.allReady;
  const html = await new Response(stream).text();

  it("never renders [object Object] in the swipe guide or the region label", () => {
    expect(html).not.toContain("[object Object]");
  });

  it("names the three questions in both languages in the swipe guide", () => {
    expect(html).toContain("成長戦略・競争優位性・業界内の位置づけ");
    expect(html).toContain("Growth strategy・Competitive advantage・Position in the industry");
    expect(html).toContain('aria-label="成長戦略・競争優位性・業界内の位置づけ"');
  });
});
