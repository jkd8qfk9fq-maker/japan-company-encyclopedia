/**
 * Module hooks that let a pipeline script import the app's own modules (JCE-148): the `@/` alias resolved to
 * `src/`, and JSON imports without an import attribute (the app code imports its data JSON bare, as the bundler
 * allows). Registered only by scripts that need a built subject — the features are built from the entries by
 * `src/lib/feature-articles.ts`, not stored as files a script could read — and only inside that script's process.
 */
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = process.cwd();
const isFile = (p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
};

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const base = join(root, "src", specifier.slice(2));
    for (const cand of [base, `${base}.ts`, `${base}.tsx`, `${base}.json`, join(base, "index.ts"), join(base, "index.tsx")]) {
      if (isFile(cand)) return { url: pathToFileURL(cand).href, format: cand.endsWith(".json") ? "json" : undefined, shortCircuit: true };
    }
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith(".json")) return { format: "json", source: readFileSync(fileURLToPath(url), "utf8"), shortCircuit: true };
  return nextLoad(url, context);
}
