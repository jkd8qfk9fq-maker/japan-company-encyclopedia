#!/usr/bin/env node
/**
 * Syncs the entrance form's answers into the hosted admin app's KV namespace (JCE-117), the store the
 * console at admin.kigyo-hyakka.com reads. The answers hold contact emails — personal data that is never
 * committed and never shown on a public page — so they live only in that KV namespace, exactly as the
 * local console keeps them only in `.data/entrance-form.json` (JCE-115).
 *
 * The read path is the same one the morning new-answer check uses: the Google Forms connector. This
 * script does not call Google itself; it merges the connector's output:
 *
 *   /opt/hatch/bin/hatch_gws_cli forms forms responses list \
 *     --params '{"formId":"17uAeskow3hUo8v3CsUE1qiAPmCtpCXG5sMB_Kdmuycs","pageSize":100}' > /tmp/entrance-responses.json
 *   CLOUDFLARE_ACCOUNT_ID=… CLOUDFLARE_API_TOKEN=… node scripts/admin/sync-entrance-kv.mjs /tmp/entrance-responses.json
 *
 * (Follow `nextPageToken` and merge each page, or pass several files.) The token needs only "Workers KV
 * Storage: Edit" for this account; it lives in the operator environment, never in this repository.
 * Merging never touches the operator's handling record: an answer already in KV keeps its status and
 * memo. Counts only are printed — no answer, and no email address, goes to the terminal log.
 */
import { readFileSync } from "node:fs";

const FORM_ID = "17uAeskow3hUo8v3CsUE1qiAPmCtpCXG5sMB_Kdmuycs";
// The namespace the hosted admin app binds as ENTRANCE_KV (admin-app/wrangler.jsonc). An id is a public
// identifier, not a secret; ENTRANCE_KV_NAMESPACE_ID overrides it for a test namespace.
const NAMESPACE_ID = process.env.ENTRANCE_KV_NAMESPACE_ID ?? "f203f7196c0149df9cf44e35aace9f55";
// Question ids from the form definition (read 2026-11-25, same as sync-entrance-form.mjs). If the form is
// rebuilt, re-read it with `hatch_gws_cli forms forms get` and update these — an unknown question id is
// ignored, never guessed.
const QUESTION = {
  email: "4740c1e2", // 連絡先メールアドレス
  company: "36b107e5", // 興味のある会社（社名または証券コード）
  beta: "5fbd6c3c", // 有料βの案内を希望しますか（「希望する」/「今はしない（無料体験だけ）」）
};
const BETA_YES = "希望する";
const STATUSES = ["new", "delivered", "beta-sent", "declined"];

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
if (!accountId || !apiToken) {
  console.error("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required (the token needs Workers KV Storage: Edit).");
  process.exit(1);
}

const kvUrl = (key) =>
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(key)}`;

const kvGet = async (key) => {
  const response = await fetch(kvUrl(key), { headers: { authorization: `Bearer ${apiToken}` } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`KV get ${key}: ${response.status} ${(await response.text()).slice(0, 200)}`);
  return response.text();
};

const kvPut = async (key, value) => {
  const response = await fetch(kvUrl(key), {
    method: "PUT",
    headers: { authorization: `Bearer ${apiToken}`, "content-type": "text/plain" },
    body: value,
  });
  if (!response.ok) throw new Error(`KV put ${key}: ${response.status} ${(await response.text()).slice(0, 200)}`);
};

const textAnswer = (response, questionId) => {
  const answers = response?.answers?.[questionId]?.textAnswers?.answers;
  return Array.isArray(answers) && typeof answers[0]?.value === "string" ? answers[0].value : "";
};

const toEntry = (response) => ({
  responseId: String(response.responseId),
  submittedAt: String(response.lastSubmittedTime ?? response.createTime ?? ""),
  email: textAnswer(response, QUESTION.email),
  company: textAnswer(response, QUESTION.company),
  betaInterest: textAnswer(response, QUESTION.beta) === BETA_YES,
  status: "new",
  memo: "",
  statusUpdatedAt: null,
});

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: node scripts/admin/sync-entrance-kv.mjs <responses.json> [more.json …]");
  process.exit(1);
}

const incoming = [];
for (const file of files) {
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  // The Forms API omits `responses` entirely when a form has no answers yet — that is an empty list,
  // not a malformed file. A `responses` that is present but not an array is malformed.
  const list = Array.isArray(parsed) ? parsed : (parsed.responses ?? []);
  if (!Array.isArray(list)) {
    console.error(`${file}: responses is not an array in this file`);
    process.exit(1);
  }
  incoming.push(...list);
}

let added = 0;
let total = 0;
for (const response of incoming) {
  if (!response?.responseId) continue;
  const fresh = toEntry(response);
  const key = `resp:${fresh.responseId}`;
  const existingText = await kvGet(key);
  let entry = fresh;
  if (existingText) {
    try {
      const existing = JSON.parse(existingText);
      // The form's answers are the source for the answer fields; the operator's status/memo stay untouched.
      entry = {
        ...fresh,
        status: STATUSES.includes(existing.status) ? existing.status : "new",
        memo: typeof existing.memo === "string" ? existing.memo : "",
        statusUpdatedAt: typeof existing.statusUpdatedAt === "string" ? existing.statusUpdatedAt : null,
      };
    } catch {
      entry = fresh;
    }
  } else {
    added += 1;
  }
  await kvPut(key, JSON.stringify(entry));
  total += 1;
}

await kvPut("meta", JSON.stringify({ formId: FORM_ID, syncedAt: new Date().toISOString() }));
console.log(`entrance-form KV: ${total} answers synced (${added} new)`);
