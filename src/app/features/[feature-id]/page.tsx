import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeatureArticle } from "@/components/feature/feature-article";
import { featureRepository } from "@/lib/repositories";

export const dynamicParams = false;

export async function generateStaticParams() {
  const features = await featureRepository.list();
  // An empty list would make the build treat the segment as unused; a
  // placeholder param that 404s keeps the route valid with zero features.
  return features.length > 0 ? features.map((f) => ({ "feature-id": f.id })) : [{ "feature-id": "none" }];
}

export async function generateMetadata({ params }: PageProps<"/features/[feature-id]">): Promise<Metadata> {
  const feature = await featureRepository.get((await params)["feature-id"]);
  if (!feature) return {};
  return {
    title: feature.title,
    description: feature.subtitle,
    alternates: { canonical: `/features/${feature.id}` },
    openGraph: { title: feature.title, description: feature.subtitle, type: "article", url: `/features/${feature.id}` },
  };
}

export default async function FeaturePage({ params }: PageProps<"/features/[feature-id]">) {
  const feature = await featureRepository.get((await params)["feature-id"]);
  if (!feature) notFound();
  return <FeatureArticle feature={feature} />;
}
