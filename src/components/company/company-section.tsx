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
        "scroll-mt-28 py-14 md:py-[4.5rem]",
        tone === "paper" && "border-t border-border bg-paper",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="eyebrow" aria-hidden>
          {eyebrow}
        </p>
        <h2 id={`${id}-heading`} className="seal-mark mt-2 font-serif text-[1.5rem] font-semibold md:text-[1.75rem]">
          {title}
        </h2>
        {lead && <div className="mt-3 max-w-3xl text-[0.9375rem] leading-7 text-muted-foreground">{lead}</div>}
        <div className="mt-8 md:mt-9">{children}</div>
      </div>
    </section>
  );
}
