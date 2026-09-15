"use client";

import { ArrowDown, ArrowUp, ExternalLink, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import type { Source } from "@/types/source";

/**
 * Plain, operational inputs for the local content editor. No styling ambition:
 * the editor must be obvious and hard to misuse, not beautiful.
 */

const inputClass =
  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-6 outline-none focus-visible:border-foreground";

export function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="block text-xs font-semibold text-muted-foreground">
      {children}
      {hint && <span className="ml-2 font-normal">{hint}</span>}
    </span>
  );
}

export function TextField({
  label,
  value,
  onChange,
  hint,
  optional,
  mono,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  hint?: string;
  /** Empty input becomes undefined (the key is removed) instead of "". */
  optional?: boolean;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <Label hint={hint}>{label}{optional && "（任意）"}</Label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(optional && e.target.value === "" ? undefined : e.target.value)}
        className={`${inputClass} ${mono ? "font-mono text-xs" : ""}`}
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  limit,
  rows = 3,
  optional,
  hint,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  limit?: number;
  rows?: number;
  optional?: boolean;
  hint?: string;
}) {
  const length = (value ?? "").length;
  return (
    <label className="block">
      <Label hint={hint}>{label}{optional && "（任意）"}</Label>
      <textarea
        value={value ?? ""}
        rows={rows}
        onChange={(e) => onChange(optional && e.target.value === "" ? undefined : e.target.value)}
        className={inputClass}
      />
      {limit && (
        <span className={`block text-right text-xs ${length > limit ? "font-semibold text-destructive" : "text-muted-foreground"}`}>
          {length} / {limit}
        </span>
      )}
    </label>
  );
}

/** A string list, one item per line. */
export function LinesField({
  label,
  value,
  onChange,
  optional,
}: {
  label: string;
  value: string[] | undefined;
  onChange: (value: string[] | undefined) => void;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <Label hint="1行に1つ">{label}{optional && "（任意）"}</Label>
      <textarea
        value={(value ?? []).join("\n")}
        rows={Math.max(2, (value ?? []).length + 1)}
        onChange={(e) => {
          const items = e.target.value.split("\n");
          // Keep a trailing empty line while typing; drop empty items otherwise.
          const cleaned = items.filter((line, i) => line.trim() !== "" || i === items.length - 1);
          const final = cleaned.filter((l) => l.trim() !== "");
          onChange(optional && final.length === 0 && e.target.value.trim() === "" ? undefined : cleaned);
        }}
        onBlur={() => {
          const final = (value ?? []).filter((l) => l.trim() !== "").map((l) => l.trim());
          onChange(optional && final.length === 0 ? undefined : final);
        }}
        className={inputClass}
      />
    </label>
  );
}

/**
 * Which sources support this section. Every source shows its title and a link
 * to the original, so the editor can inspect the evidence while correcting
 * (spec §10) instead of trusting an id.
 */
export function SourceIdsField({
  sources,
  value,
  onChange,
}: {
  sources: Source[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const selected = new Set(value);
  return (
    <fieldset className="rounded-md border border-border p-3">
      <legend className="px-1 text-xs font-semibold text-muted-foreground">
        出典 {value.length === 0 && <span className="text-destructive">（1つ以上選んでください）</span>}
      </legend>
      <ul className="space-y-1">
        {sources.map((source) => (
          <li key={source.id} className="flex items-start gap-2 text-xs leading-5">
            <input
              type="checkbox"
              checked={selected.has(source.id)}
              onChange={(e) =>
                onChange(e.target.checked ? [...value, source.id] : value.filter((id) => id !== source.id))
              }
              className="mt-1 size-4 shrink-0 accent-foreground"
              aria-label={source.title}
            />
            <span className="min-w-0 flex-1">
              {source.title}
              <span className="text-muted-foreground"> — {source.publisher}</span>
            </span>
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-ink" title="原文を開く">
              <ExternalLink className="size-3.5" aria-hidden />
              <span className="sr-only">原文を開く</span>
            </a>
          </li>
        ))}
        {value.filter((id) => !sources.some((s) => s.id === id)).map((id) => (
          <li key={id} className="text-xs text-destructive">出典一覧にない id: {id}（出典タブで追加するか、ここから外してください）
            <button type="button" className="ml-2 underline" onClick={() => onChange(value.filter((v) => v !== id))}>外す</button>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

export function RowControls({
  onUp,
  onDown,
  onRemove,
  label,
}: {
  onUp?: () => void;
  onDown?: () => void;
  onRemove: () => void;
  label: string;
}) {
  return (
    <div className="flex shrink-0 gap-1">
      <button type="button" disabled={!onUp} onClick={onUp} className="rounded border border-border p-1.5 disabled:opacity-30" title="上へ">
        <ArrowUp className="size-3.5" aria-hidden /><span className="sr-only">{label}を上へ</span>
      </button>
      <button type="button" disabled={!onDown} onClick={onDown} className="rounded border border-border p-1.5 disabled:opacity-30" title="下へ">
        <ArrowDown className="size-3.5" aria-hidden /><span className="sr-only">{label}を下へ</span>
      </button>
      <button type="button" onClick={onRemove} className="rounded border border-border p-1.5 text-destructive" title="削除">
        <Trash2 className="size-3.5" aria-hidden /><span className="sr-only">{label}を削除</span>
      </button>
    </div>
  );
}

/** Array helpers that never mutate the draft in place. */
export const list = {
  set<T>(items: T[], index: number, value: T): T[] {
    return items.map((item, i) => (i === index ? value : item));
  },
  remove<T>(items: T[], index: number): T[] {
    return items.filter((_, i) => i !== index);
  },
  move<T>(items: T[], index: number, delta: -1 | 1): T[] {
    const target = index + delta;
    if (target < 0 || target >= items.length) return items;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  },
};

/**
 * Money is entered in 百万円 — the unit filings print — and stored in whole
 * yen. Converting by hand is exactly where a digit gets dropped, so the field
 * does it, and an input that is not a whole number of 百万円 is shown as an
 * error rather than rounded.
 */
export function MillionYenField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const id = useId();
  const [text, setText] = useState(value === null ? "" : String(value / 1_000_000));
  const [invalid, setInvalid] = useState(false);
  return (
    <label className="block" htmlFor={id}>
      <Label hint="百万円・空欄=確認できず">{label}</Label>
      <input
        id={id}
        inputMode="numeric"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          const normalized = e.target.value.replace(/[,，\s]/g, "").replace(/^[△▲]/, "-");
          if (normalized === "") {
            setInvalid(false);
            onChange(null);
          } else if (/^-?\d+$/.test(normalized)) {
            setInvalid(false);
            onChange(Number(normalized) * 1_000_000);
          } else {
            setInvalid(true);
          }
        }}
        className={`${inputClass} figures ${invalid ? "border-destructive" : ""}`}
        aria-invalid={invalid}
      />
      {invalid && <span className="text-xs text-destructive">百万円単位の整数で入力してください（△は負の値）</span>}
    </label>
  );
}
