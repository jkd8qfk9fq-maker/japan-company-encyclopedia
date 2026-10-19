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
  //
  // Scroll the BAR only. scrollIntoView() was used here first and scrolled the
  // whole document to bring the bar into view on page load, so every company
  // page opened already scrolled past its hero — hiding exactly the 3-second
  // content the page exists to show.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-section="${active}"]`);
    if (!list || !link) return;
    const linkBox = link.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    if (linkBox.left < listBox.left) list.scrollBy({ left: linkBox.left - listBox.left - 12 });
    else if (linkBox.right > listBox.right) list.scrollBy({ left: linkBox.right - listBox.right + 12 });
  }, [active]);

  return (
    <nav
      aria-label="このページの項目"
      className="sticky top-(--header-height) z-30 border-b border-border bg-background/90 backdrop-blur"
    >
      <ul
        ref={listRef}
        className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-2.5 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((section) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              data-section={section.id}
              aria-current={active === section.id ? "true" : undefined}
              className={cn(
                "flex min-h-10 items-center rounded-full border px-4 text-[0.8125rem] whitespace-nowrap transition-colors",
                active === section.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground",
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
