"use client";

// A Client Component only to send the click's event name (JCE-056: a name, after consent, nothing else).
import { trackEvent } from "@/lib/analytics/runtime";
import type { TrackedEvent } from "@/lib/analytics/guard";

export function TrackedLink({ href, event, className, children }: { href: string; event: TrackedEvent; className?: string; children: React.ReactNode }) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener" onClick={() => trackEvent(event)}>
      {children}
    </a>
  );
}
