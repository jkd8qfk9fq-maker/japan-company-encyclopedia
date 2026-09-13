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
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-28 py-16 md:py-24", tone === "paper" && "bg-paper", className)}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="eyebrow" aria-hidden>
          {eyebrow}
        </p>
        <h2 id={`${id}-heading`} className="mt-3 font-serif text-[1.75rem] font-semibold md:text-[2.25rem]">
          {title}
        </h2>
        {lead && <div className="prose-ja mt-5 max-w-3xl text-muted-foreground">{lead}</div>}
        <div className="mt-10 md:mt-12">{children}</div>
      </div>
    </section>
  );
}
