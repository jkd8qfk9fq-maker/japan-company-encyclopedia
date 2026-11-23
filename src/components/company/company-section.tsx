import { cn } from "@/lib/utils";

/**
 * One section of an entry: a small Latin eyebrow, a Japanese heading, content.
 * The eyebrow is decoration for sighted readers and hidden from assistive
 * technology, which gets the Japanese heading alone.
 */
export function CompanySection({
  id,
  eyebrow,
  title,
  lead,
  children,
  className,
  tone = "plain",
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tone?: "plain" | "paper";
}) {
  return (
    <section
      id={id}
      data-tab-panel={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        // 2026-11-23 (JCE-099): denser rhythm — a section opens with its content, not with a screen of air.
        "scroll-mt-28 py-7 md:py-12",
        tone === "paper" && "border-t border-border bg-paper",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="eyebrow" aria-hidden>
          {eyebrow}
        </p>
        <h2 id={`${id}-heading`} className="seal-mark mt-1 font-serif text-[1.25rem] leading-snug font-semibold md:text-[1.625rem]">
          {title}
        </h2>
        {lead && <div className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{lead}</div>}
        <div className="mt-5 md:mt-7">{children}</div>
      </div>
    </section>
  );
}
