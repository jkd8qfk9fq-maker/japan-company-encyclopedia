"use client";

import { useEffect } from "react";
import { recordView } from "@/lib/storage/stores";

/** Adds the company to the reader's recently-viewed list. Renders nothing. */
export function RecordView({ companyId }: { companyId: string }) {
  useEffect(() => {
    recordView(companyId);
  }, [companyId]);
  return null;
}
