import { buildCompareReportIndex } from "@/lib/compare-index";
import { companyRepository } from "@/lib/repositories";

/**
 * 業界の中での位置 for the 見比べ table (JCE-073): every released company's computed layer, built with the site. Like
 * /compare.json it is one file for everyone, so which companies a reader lines up is never sent anywhere; the page
 * fetches it only when a reader with the plan has two or more companies on the table.
 */
export const dynamic = "force-static";

export async function GET() {
  const companies = await companyRepository.list();
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(new Date());
  return Response.json(buildCompareReportIndex(companies, today));
}
