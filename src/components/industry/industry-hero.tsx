import Image from "next/image";
import { INDUSTRY_IMAGES } from "@/assets/industries";
import type { IndustryId } from "@/types/company";

/**
 * The 仕組み tab's opening picture: a photograph of the kind of work the industry does, with its name over it. The
 * photograph is illustrative (Unsplash) and is never presented as any company's own; the words over it are the
 * industry's label and nothing more, so the picture carries no claim.
 */
export function IndustryHero({ id, name, nameEn }: { id: IndustryId; name: string; nameEn: string }) {
  return (
    <div className="relative h-48 overflow-hidden rounded-md bg-foreground md:h-72">
      <Image
        src={INDUSTRY_IMAGES[id]}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="(min-width: 72rem) 72rem, 100vw"
        className="object-cover"
      />
      {/* Darkens the lower half only, so white text stays readable on any photograph. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-8">
        <p className="wordmark text-[clamp(1.75rem,5vw,3rem)] leading-none" aria-hidden>
          {nameEn}
        </p>
        <p className="mt-2 font-serif text-lg font-semibold md:text-2xl">{name}業界の仕組み</p>
      </div>
    </div>
  );
}
