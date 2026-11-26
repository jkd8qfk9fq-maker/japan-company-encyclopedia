"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { T } from "@/components/i18n/t";

const pill =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm text-foreground transition-colors hover:border-foreground";

const subscribeNever = () => () => {};

/**
 * Share a page: X, copy the link, and the device's own share sheet.
 * Instagram has no web share URL — its only routes are the share sheet (mobile) and a pasted
 * link (profile, story link sticker), which is why those two exist instead of an Instagram button.
 * `url` is absolute, built on the server from SITE_URL, so what is shared never points at localhost.
 */
export function ShareActions({ url, text }: { url: string; text: string }) {
  const [copied, setCopied] = useState(false);
  // navigator.share exists only in some browsers; read it on the client without a hydration mismatch.
  const canShare = useSyncExternalStore(subscribeNever, () => typeof navigator.share === "function", () => false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused (insecure context, denied permission); the X link and share sheet still work.
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title: text, url });
    } catch {
      // The reader closed the sheet: not an error.
    }
  };

  const xHref = `https://x.com/intent/post?${new URLSearchParams({ text, url })}`;

  return (
    <div className="flex flex-wrap gap-3">
      <a href={xHref} target="_blank" rel="noopener noreferrer" className={pill}>
        <span data-l="ja"><span aria-hidden className="font-semibold">𝕏</span>
        Xで共有
        <span className="sr-only"><T m={{ ja: "（新しいタブで開きます）", en: "(opens in a new tab)" }} /></span></span><span data-l="en"><span aria-hidden className="font-semibold">𝕏</span>Share on X<span className="sr-only"><T m={{ ja: "（新しいタブで開きます）", en: "(opens in a new tab)" }} /></span></span>
      </a>
      <button type="button" onClick={copy} className={pill}>
        {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
        <span aria-live="polite">{copied ? <T m={{ ja: "コピーしました", en: "Copied" }} /> : <T m={{ ja: "リンクをコピー", en: "Copy link" }} />}</span>
      </button>
      {canShare && (
        <button type="button" onClick={share} className={pill}>
          <span data-l="ja"><Share2 className="size-4" aria-hidden />
          アプリで共有
        </span><span data-l="en"><Share2 className="size-4" aria-hidden />Share via app</span></button>
      )}
    </div>
  );
}
