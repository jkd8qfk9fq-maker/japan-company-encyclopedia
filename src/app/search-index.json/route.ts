import { buildSearchIndex } from "@/lib/search/search-index";

/**
 * The search index as a static file, for the suggestions under the header and front-page search fields. Built
 * once at build time (and written out by the static export like a page); the fields fetch it only when a reader
 * focuses them, so no page carries the index in its own HTML or bundle.
 */
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await buildSearchIndex());
}
