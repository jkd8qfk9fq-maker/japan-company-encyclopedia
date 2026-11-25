#!/usr/bin/env node
/**
 * Syncs the entrance form's answers into the local state file the admin page reads:
 * `.data/entrance-form.json` (git-ignored — the answers hold contact emails, personal data that is
 * never committed and never shown on a public page; docs/decisions.md, JCE-115).
 *
 * The read path is the same one the morning new-answer check uses: the Google Forms connector.
 * This script does not call Google itself; it merges the connector's output:
 *
 *   /opt/hatch/bin/hatch_gws_cli forms forms responses list \
 *     --params '{"formId":"17uAeskow3hUo8v3CsUE1qiAPmCtpCXG5sMB_Kdmuycs","pageSize":100}' > /tmp/entrance-responses.json
 *   node scripts/admin/sync-entrance-form.mjs /tmp/entrance-responses.json
 *
 * (Follow `nextPageToken` and merge each page, or pass several files.) Merging never touches the
 * operator's handling record: an answer that is already in the state file keeps its status and memo.
 * Counts only are printed — no answer, and no email address, goes to the terminal log.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const FORM_ID = "17uAeskow3hUo8v3CsUE1qiAPmCtpCXG5sMB_Kdmuycs";
// Question ids from the form definition (read 2026-11-25). If the form is rebuilt, re-read it with
// `hatch_gws_cli forms forms get` and update these — an unknown question id is ignored, never guessed.
const QUESTION = {
  email: "4740c1e2", // 連絡先メールアドレス
  company: "36b107e5", // 興味のある会社（社名または証券コード）
  beta: "5fbd6c3c", // 有料βの案内を希望しますか（「希望する」/「今はしない（無料体験だけ）」）
};
const BETA_YES = "希望する";

const statePath = join(process.cwd(), ".data", "entrance-form.json");

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
  console.error("usage: node scripts/admin/sync-entrance-form.mjs <responses.json> [more.json …]");
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

const state = existsSync(statePath)
  ? JSON.parse(readFileSync(statePath, "utf8"))
  : { formId: FORM_ID, syncedAt: "", entries: [] };
if (!Array.isArray(state.entries)) state.entries = [];

const known = new Map(state.entries.map((e) => [e.responseId, e]));
let added = 0;
for (const response of incoming) {
  if (!response?.responseId) continue;
  const fresh = toEntry(response);
  const existing = known.get(fresh.responseId);
  if (existing) {
    // The form's answers are the source for the answer fields; the operator's status/memo stay untouched.
    existing.submittedAt = fresh.submittedAt;
    existing.email = fresh.email;
    existing.company = fresh.company;
    existing.betaInterest = fresh.betaInterest;
  } else {
    state.entries.push(fresh);
    known.set(fresh.responseId, fresh);
    added += 1;
  }
}
state.formId = FORM_ID;
state.syncedAt = new Date().toISOString();

mkdirSync(dirname(statePath), { recursive: true });
writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
console.log(`entrance-form: ${state.entries.length} answers in .data/entrance-form.json (${added} new)`);
