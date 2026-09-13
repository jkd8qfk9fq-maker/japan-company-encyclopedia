"use client";

import Link from "next/link";
import { useLocalStore } from "@/hooks/use-local-store";
import { reportsStore, updateReportStatus, type ReportStatus } from "@/lib/storage/stores";

const STATUS_LABEL: Record<ReportStatus, string> = {
  open: "未対応",
  investigating: "調査中",
  resolved: "解決済み",
  rejected: "対応不要",
};

export function LocalReports() {
  const reports = useLocalStore(reportsStore);

  if (reports.length === 0) {
    return <p className="text-sm text-muted-foreground">この端末に保存された報告はありません。</p>;
  }

  return (
    <ul className="divide-y divide-border border-y border-border">
      {reports.map((report) => (
        <li key={report.id} className="grid gap-3 py-5 md:grid-cols-[1fr_10rem]">
          <div>
            <p className="figures text-xs text-muted-foreground">
              {report.createdAt.slice(0, 10)} · {report.category}
              {report.pagePath && (
                <>
                  {" · "}
                  <Link href={report.pagePath} className="hover:underline">{report.pagePath}</Link>
                </>
              )}
            </p>
            {/* Rendered as text, never as HTML: report content is untrusted input. */}
            <p className="mt-2 text-sm leading-7 whitespace-pre-wrap">{report.message}</p>
          </div>
          <label className="text-xs text-muted-foreground">
            状態
            <select
              value={report.status}
              onChange={(e) => updateReportStatus(report.id, e.target.value as ReportStatus)}
              className="mt-1 h-11 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground"
            >
              {Object.entries(STATUS_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </li>
      ))}
    </ul>
  );
}
