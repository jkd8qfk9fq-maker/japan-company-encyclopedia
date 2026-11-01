import Image, { type StaticImageData } from "next/image";

/**
 * A photograph band with a title over it: the 仕組み tab of each industry, and the industries hub. The photograph is
 * illustrative (Unsplash / Pexels, src/assets/industries) and never presented as any company's own; the words over it
 * are labels only, so the picture carries no claim.
 */
export function IndustryHero({
  image,
  eyebrow,
  title,
  priority = false,
}: {
  image: StaticImageData;
  eyebrow: string;
  title: string;
  priority?: boolean;
}) {
  return (
    <div className="relative h-44 overflow-hidden rounded-md bg-foreground md:h-72">
      <Image
        src={image}
        alt=""
        fill
        priority={priority}
        placeholder="blur"
        sizes="(min-width: 72rem) 72rem, 100vw"
        className="object-cover"
      />
      {/* Darkens the lower half only, so white text stays readable on any photograph. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-8">
        <p className="wordmark text-[clamp(1.75rem,5vw,3rem)] leading-none" aria-hidden>
          {eyebrow}
        </p>
        <p className="mt-2 font-serif text-lg font-semibold md:text-2xl">{title}</p>
      </div>
    </div>
  );
}
