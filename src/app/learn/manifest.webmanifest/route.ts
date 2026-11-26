import { BASE_PATH, SITE_NAME, TRAINING_APP_DESCRIPTION, TRAINING_APP_NAME } from "@/lib/site";

/**
 * The training app's own manifest: installed from /learn, it lands on the home screen as 分析訓練 with its own
 * icon and opens straight into the course — a separate app for the reader, on the same origin so the training
 * record kept in this browser carries over (storage belongs to the origin, not to the manifest scope).
 *
 * The scope is /learn only (JCE-125, revising JCE-108): the app is the training itself, not the whole
 * encyclopedia. The course, its lessons and the review queue live under /learn and stay in the app; the daily
 * question (/quiz), the digest (/digest) and company pages open in the browser instead (on platforms that
 * apply scope — iOS does not use it). The splash background matches the dark UI the app opens into.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      id: `${BASE_PATH}/learn`,
      name: `${TRAINING_APP_NAME}（${SITE_NAME}）`,
      short_name: TRAINING_APP_NAME,
      description: TRAINING_APP_DESCRIPTION,
      lang: "ja",
      start_url: `${BASE_PATH}/learn`,
      scope: `${BASE_PATH}/learn`,
      display: "standalone",
      background_color: "#0f1626",
      theme_color: "#0f1626",
      categories: ["education"],
      icons: [
        { src: `${BASE_PATH}/icons/training-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
        { src: `${BASE_PATH}/icons/training-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
        { src: `${BASE_PATH}/icons/training-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    { headers: { "content-type": "application/manifest+json" } },
  );
}
