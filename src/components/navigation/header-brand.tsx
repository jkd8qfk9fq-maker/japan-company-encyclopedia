"use client";

// A Client Component: the name in the header follows the path — the encyclopedia's, or the training app's (JCE-108).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isTrainingPath } from "./navigation-items";

export function HeaderBrand({ siteName, tagline, appName }: { siteName: string; tagline: string; appName: string }) {
  const training = isTrainingPath(usePathname());
  if (training) {
    return (
      <Link href="/learn" className="seal-mark flex flex-col py-1 leading-tight outline-offset-4">
        <span className="font-serif text-[1.25rem] font-semibold tracking-[0.08em] md:text-[1.5rem]">{appName}</span>
        <span className="text-[0.6875rem] text-muted-foreground md:text-xs">{siteName}の学習アプリ</span>
      </Link>
    );
  }
  return (
    <Link href="/" className="seal-mark flex flex-col py-1 leading-tight outline-offset-4">
      <span className="font-serif text-[1.25rem] font-semibold tracking-[0.08em] md:text-[1.5rem]">{siteName}</span>
      <span className="hidden text-xs text-muted-foreground md:block">{tagline}</span>
    </Link>
  );
}
