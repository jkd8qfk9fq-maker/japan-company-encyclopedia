"use client";

import type { ReactNode } from "react";
import { LEARN } from "@/lib/learning-ui";

/**
 * Small shared pieces of the learning area's bright theme (JCE-088): a progress ring and the raised
 * call-to-action button. The learning area is white-based in both site themes — the encyclopedia's navy
 * survives as heading text — so these pieces carry their own colours from `LEARN` and the unit styles
 * rather than the site theme variables.
 */

export function ProgressRing({ fraction, size = 64, stroke = 7, color = LEARN.cta, children }: { fraction: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, fraction));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`進捗 ${Math.round(clamped * 100)}%`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={LEARN.track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/** The raised button: a darker ledge under the face that the press sinks into. One green for every CTA. */
export function LearnButton({
  children,
  onClick,
  disabled = false,
  color = LEARN.cta,
  dark = LEARN.ctaDark,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: string;
  dark?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-h-12 w-full rounded-2xl px-5 text-base font-bold text-white transition-transform ${disabled ? "cursor-not-allowed opacity-40" : "active:translate-y-[3px]"} ${className}`}
      style={disabled ? { backgroundColor: "#b9c6cf", boxShadow: "0 4px 0 #9fb0bc" } : { backgroundColor: color, boxShadow: `0 4px 0 ${dark}` }}
    >
      {children}
    </button>
  );
}
