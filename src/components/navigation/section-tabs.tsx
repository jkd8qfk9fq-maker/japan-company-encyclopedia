"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

export type SectionLink = { id: string; label: string };

const PHONE = "(max-width: 47.99rem)";
const SWIPE_MIN = 64;

function subscribePhone(onChange: () => void) {
  const query = window.matchMedia(PHONE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Section tabs for a page made of `CompanySection`s (or any `[data-tab-panel]` children of `containerId`).
 *
 * `tabbed="mobile"` — the company page. On a wide screen the tabs are anchors into one continuous page (the order is
 * the order understanding deepens) and the active one follows the scroll. On a phone they become real tabs: one
 * section at a time, switched by tapping or by swiping sideways, so a reader moves across the page instead of down
 * a very long one (operator request, 2026-10-20).
 * `tabbed="always"` — compact pages such as an industry: tabs at every width.
 *
 * Every section is still rendered on the server and stays in the document; a tab only hides the others with CSS,
 * and only once this script has run. Without JavaScript — or offline from a saved page — everything is shown, in
 * order, as before. A link to an element inside a hidden section (a hash) opens that section first.
 */
export function SectionTabs({
  sections,
  containerId,
  tabbed,
}: {
  sections: SectionLink[];
  containerId: string;
  tabbed: "mobile" | "always";
}) {
  const [active, setActive] = useState(sections[0]?.id);
  // Whether the current width shows one panel at a time. False on the server and before hydration: nothing hidden.
  const isTabbed = useSyncExternalStore(
    subscribePhone,
    () => tabbed === "always" || window.matchMedia(PHONE).matches,
    () => false,
  );
  const listRef = useRef<HTMLUListElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Mark the container so the CSS in globals.css hides the panels that are not current.
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.dataset.tabbed = tabbed;
    for (const panel of container.querySelectorAll<HTMLElement>(":scope > [data-tab-panel]")) {
      if (panel.dataset.tabPanel === active) panel.dataset.current = "";
      else delete panel.dataset.current;
    }
  }, [active, containerId, tabbed]);

  const show = useCallback(
    (id: string, direction: 1 | -1 = 1) => {
      setActive(id);
      const panel = document.getElementById(id);
      if (!panel) return;
      panel.style.setProperty("--tab-from", direction > 0 ? "2.5rem" : "-2.5rem");
      panel.removeAttribute("data-entering");
      // Restart the slide-in animation on every switch.
      void panel.offsetWidth;
      panel.setAttribute("data-entering", "");
      // Start the new panel at its top, just under the sticky tabs, if the reader had scrolled past it.
      const nav = navRef.current;
      if (nav && nav.getBoundingClientRect().top <= parseFloat(getComputedStyle(nav).top) + 1) {
        const header = parseFloat(getComputedStyle(nav).top) || 0;
        window.scrollTo({ top: panel.getBoundingClientRect().top + window.scrollY - header - nav.offsetHeight - 8 });
      }
    },
    [],
  );

  // Wide screen, anchor mode: the active tab follows the scroll.
  useEffect(() => {
    if (isTabbed) return;
    const elements = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null);
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
  }, [sections, isTabbed]);

  // A hash pointing into a hidden panel (#related-companies-list, a chip linking to #business) opens that panel.
  useEffect(() => {
    if (!isTabbed) return;
    const open = () => {
      const target = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
      const panel = target?.closest<HTMLElement>("[data-tab-panel]");
      if (panel?.dataset.tabPanel && sections.some((s) => s.id === panel.dataset.tabPanel)) {
        setActive(panel.dataset.tabPanel);
        requestAnimationFrame(() => target!.scrollIntoView());
      }
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [isTabbed, sections]);

  // Sideways swipe on the panels moves to the neighbouring tab. A mostly vertical gesture is a scroll and is ignored,
  // and so is a swipe that starts inside something that scrolls sideways itself (a timeline, a wide table).
  useEffect(() => {
    if (!isTabbed) return;
    const container = document.getElementById(containerId);
    if (!container) return;
    let start: { x: number; y: number } | null = null;
    const down = (e: TouchEvent) => {
      const el = e.target as HTMLElement;
      const scroller = el.closest<HTMLElement>("[data-scroll-x], .overflow-x-auto");
      start = scroller && scroller.scrollWidth > scroller.clientWidth ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const up = (e: TouchEvent) => {
      if (!start) return;
      const dx = e.changedTouches[0].clientX - start.x;
      const dy = e.changedTouches[0].clientY - start.y;
      start = null;
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      const index = sections.findIndex((s) => s.id === active);
      const next = sections[index + (dx < 0 ? 1 : -1)];
      if (next) show(next.id, dx < 0 ? 1 : -1);
    };
    container.addEventListener("touchstart", down, { passive: true });
    container.addEventListener("touchend", up, { passive: true });
    return () => {
      container.removeEventListener("touchstart", down);
      container.removeEventListener("touchend", up);
    };
  }, [active, containerId, isTabbed, sections, show]);

  // Keep the active tab visible inside the horizontally scrolling bar. Scroll the BAR only: scrollIntoView() once
  // scrolled the whole document on load and opened every company page past its hero.
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
      ref={navRef}
      aria-label="このページの項目"
      className="sticky top-(--header-height) z-30 border-b border-border bg-background/90 backdrop-blur"
    >
      <ul
        ref={listRef}
        role={isTabbed ? "tablist" : undefined}
        className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-2.5 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {sections.map((section, i) => (
          <li key={section.id} className="shrink-0" role={isTabbed ? "presentation" : undefined}>
            <a
              href={`#${section.id}`}
              data-section={section.id}
              role={isTabbed ? "tab" : undefined}
              aria-selected={isTabbed ? active === section.id : undefined}
              aria-current={!isTabbed && active === section.id ? "true" : undefined}
              onClick={(e) => {
                if (!isTabbed) return;
                e.preventDefault();
                const from = sections.findIndex((s) => s.id === active);
                show(section.id, i >= from ? 1 : -1);
              }}
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
