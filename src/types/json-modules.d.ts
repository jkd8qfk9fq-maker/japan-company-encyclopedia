/**
 * JSON modules are `unknown` on purpose (JCE-076, docs/decisions.md).
 *
 * Every content JSON in this repository is validated when it is loaded, not when it is compiled:
 * companies, industries and terms go through `parseContent` (the zod schemas in
 * src/lib/content/schemas.ts), headquarters and websites do the same in the static repositories,
 * and the few files read directly (the Japan map, the released-with-notes list) carry a type
 * annotation at the import site. The literal types `resolveJsonModule` would infer instead are
 * pure cost — with ~3,900 company files they grew the type-check program to 5,162 files and
 * ~2.75 GB, which is what ran the production build's type check out of memory (the PR#44 build,
 * 2026-11-20). As `unknown`, the program is ~1,200 files and ~0.6 GB, and the runtime validation
 * stays exactly as strong.
 *
 * This declaration only takes effect together with `resolveJsonModule: false` in
 * tsconfig.base.json: with it enabled, an import resolves to the real file and this declaration
 * is never consulted.
 */
declare module "*.json" {
  const value: unknown;
  export default value;
}
