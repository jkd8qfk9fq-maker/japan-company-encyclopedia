"use client";

import { useId, useState } from "react";

/**
 * Tabs over charts that are already rendered on the server: the panels are passed in as children and only the
 * chosen one is shown. Client-side because choosing is an interaction; the charts themselves stay server SVG, and
 * every panel is in the HTML, so nothing is fetched when a tab is chosen.
 */
export function ChartTabs({ tabs, children }: { tabs: { id: string; label: string }[]; children: React.ReactNode[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  return (
    <div>
      <div role="tablist" aria-label="グラフにする数字" className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${i}`}
            onClick={() => setActive(i)}
            className={`min-h-9 shrink-0 rounded-full border px-3.5 text-sm transition-colors ${
              i === active ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children.map((panel, i) => (
        <div key={tabs[i].id} role="tabpanel" id={`${base}-panel-${i}`} aria-labelledby={`${base}-tab-${i}`} hidden={i !== active} className="mt-5">
          {panel}
        </div>
      ))}
    </div>
  );
}
