"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SectionLink = { id: string; label: string };

/**
 * The company page's "tabs".
 *
 * They are anchors into one continuous page, not panels that hide content.
 * The page is already ordered the way understanding deepens — 概要 (3 s),
 * 事業 (30 s), ビジネスモデル (3 min), 財務, 歴史, 業界 (10 min) — so scrolling
 * IS the progression, and hiding sections behind tabs would break it, break
 * in-page search, and make offline reading of a saved page partial.
 *
 * Sticky under the header; horizontally scrollable on a phone rather than
 * squeezing seven labels into one row; the active section follows the scroll.
 */
export function SectionNavigation({ sections }: { sections: SectionLink[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A section counts as current once it reaches the upper third of the viewport.
      { rootMargin: "-20% 0px -65% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Keep the active tab visible inside the horizontally scrolling bar.
  useEffect(() => {
    const link = listRef.current?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    link?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  return (
    <nav
      aria-label="このページの項目"
      className="sticky top-(--header-height) z-30 border-b border-border bg-background/90 backdrop-blur"
    >
      <ul
        ref={listRef}
        className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 [scrollbar-width:none] md:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              data-section={section.id}
              aria-current={active === section.id ? "true" : undefined}
              className={cn(
                "relative flex min-h-12 items-center px-3 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
                active === section.id &&
                  "font-medium text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-foreground",
              )}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
