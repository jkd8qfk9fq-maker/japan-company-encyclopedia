import type { Metadata } from "next";
import { Suspense } from "react";
import { ReportForm } from "@/components/settings/report-form";
import { Skeleton } from "@/components/ui/skeleton";
import { companyRepository } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "情報の誤りを報告",
  robots: { index: false },
};

export default async function ReportPage() {
  const companies = (await companyRepository.list()).map((c) => ({ id: c.id, name: c.name }));
  return (
    <div className="mx-auto max-w-2xl px-5 pt-5 pb-8 md:px-8 md:pt-10">
      <p className="eyebrow" aria-hidden>Report</p>
      <h1 className="mt-1 font-serif text-[1.625rem] leading-tight font-semibold md:text-[2.25rem]">情報の誤りを報告</h1>
      <p className="prose-ja mt-4 text-muted-foreground">
        掲載内容は公開資料に基づいていますが、誤りや古い情報が含まれる可能性があります。お気づきの点をお知らせください。
      </p>
      <div className="mt-12">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <ReportForm companies={companies} />
        </Suspense>
      </div>
    </div>
  );
}
