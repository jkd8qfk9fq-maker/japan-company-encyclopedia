"use client";

import { useLocalStore } from "@/hooks/use-local-store";
import { reportsStore } from "@/lib/storage/stores";

export function LocalReportCount() {
  const reports = useLocalStore(reportsStore);
  return <>{reports.filter((r) => r.status === "open" || r.status === "investigating").length}</>;
}
