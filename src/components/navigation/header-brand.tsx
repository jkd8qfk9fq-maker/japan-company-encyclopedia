"use client";

// A Client Component: the name in the header follows the path — the encyclopedia's, or the training app's (JCE-108).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/components/i18n/t";
import { isTrainingPath } from "./navigation-items";

export function HeaderBrand({ siteName, siteNameEn, tagline, taglineEn, appName }: { siteName: string; siteNameEn: string; tagline: string; taglineEn: string; appName: string }) {
  const training = isTrainingPath(usePathname());
  if (training) {
    return (
      <Link href="/learn" className="seal-mark flex flex-col py-1 leading-tight outline-offset-4">
        <span className="font-serif text-[1.25rem] font-semibold tracking-[0.08em] md:text-[1.5rem]">{appName}</span>
        <span className="text-[0.6875rem] text-muted-foreground md:text-xs"><T m={{ ja: `${siteName}の学習アプリ`, en: `Training app of ${siteNameEn}` }} /></span>
      </Link>
    );
  }
  return (
    <Link href="/" className="seal-mark flex flex-col py-1 leading-tight outline-offset-4">
      <span className="font-serif text-[1.25rem] font-semibold tracking-[0.08em] whitespace-nowrap md:text-[1.5rem] [&_[data-l=en]]:text-[1.0625rem] [&_[data-l=en]]:tracking-[0.02em] md:[&_[data-l=en]]:text-[1.25rem]"><T m={{ ja: siteName, en: siteNameEn }} /></span>
      <span className="hidden text-xs whitespace-nowrap text-muted-foreground md:block"><T m={{ ja: tagline, en: taglineEn }} /></span>
    </Link>
  );
}
