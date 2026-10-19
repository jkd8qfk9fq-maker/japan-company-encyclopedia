import type { MetadataRoute } from "next";
import { BASE_PATH, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `${BASE_PATH}/`,
    name: SITE_NAME,
    short_name: "企業百科",
    description: SITE_DESCRIPTION,
    lang: "ja",
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: "standalone",
    background_color: "#fdfdfd",
    theme_color: "#fdfdfd",
    categories: ["education", "books", "reference"],
    icons: [
      { src: `${BASE_PATH}/icons/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${BASE_PATH}/icons/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${BASE_PATH}/icons/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
