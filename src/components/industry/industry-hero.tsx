import Image, { type StaticImageData } from "next/image";

/**
 * A photograph band with a title over it: the 仕組み tab of each industry, and the industries hub. The photograph is
 * illustrative (Unsplash / Pexels, src/assets/industries) and never presented as any company's own; the words over it
 * are labels only, so the picture carries no claim.
 *
 * JCE-080: the wordmark over the photograph is a caption, not a poster — it takes the industry label tier
 * (max 1.75rem, JCE-077), not the 3rem it had, which also repeated the page header's wordmark at a larger
 * size on the industry page. The band itself is shorter for the same reason: the first view owes its
 * height to the words under the photograph, not to the photograph.
 */
export function IndustryHero({
  image,
  eyebrow,
  title,
  priority = false,
}: {
  image: StaticImageData;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  priority?: boolean;
}) {
  return (
    <div className="relative h-28 overflow-hidden rounded-lg bg-foreground md:h-48">
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
        <p className="wordmark text-[clamp(1.25rem,4vw,1.75rem)] leading-none" aria-hidden>
          {eyebrow}
        </p>
        <p className="mt-2 font-serif text-base font-semibold md:text-xl">{title}</p>
      </div>
    </div>
  );
}
