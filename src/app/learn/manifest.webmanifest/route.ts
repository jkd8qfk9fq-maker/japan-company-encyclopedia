import { BASE_PATH, SITE_NAME, TRAINING_APP_DESCRIPTION, TRAINING_APP_NAME } from "@/lib/site";

/**
 * The training app's own manifest (JCE-108): installed from /learn, it lands on the home screen as 分析訓練 with
 * its own icon and opens straight into the course — a separate app for the reader, on the same origin so the
 * training record kept in this browser carries over. The scope stays the whole site because the daily question
 * and the digest live at /quiz and /digest, and a lesson links out to company pages.
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
      scope: `${BASE_PATH}/`,
      display: "standalone",
      background_color: "#ffffff",
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
