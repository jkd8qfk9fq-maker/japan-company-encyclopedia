/**
 * The one place the pipeline calls a model. Everything else in the registration pipeline is a program.
 *
 * Two modes:
 *   claude-cli   `claude -p` as a headless agent (the data-research agent definition in .claude/agents). It uses the
 *                operator's own Claude Code login — no API key is handled here and none is invented. One call per
 *                agent group; a budget cap per call; no web tools unless asked.
 *   work-orders  nothing is called. The prompt is written to pipeline/autopilot/orders/ and the run stops at
 *                "awaiting-ai"; a person (or a Claude Code session) does the work and runs `autopilot run` again.
 *                This is also what is used when `claude` is not installed.
 *
 * What comes back is classified, because the right reaction differs: a rate limit pauses the whole queue and
 * costs the company no attempt; a network error is retried; a bad result counts as an attempt; a missing login
 * stops the run (nothing is wrong with the company). The output is passed through scrubSecrets before it is
 * kept anywhere.
 */
import { spawn } from "node:child_process";
import { scrubSecrets } from "../research/edinet.mjs";

/**
 * Classify what a failed or odd executor run said. Pure.
 * @param {string} text stdout + stderr (or the result text)
 * @returns {"rate-limit" | "auth" | "budget" | "network" | "timeout" | "other"}
 */
export function classifyExecutorFailure(text) {
  const t = String(text ?? "");
  if (/(?:session|weekly|monthly|daily|usage|rate)[ _-]?limit|hit your [a-z ]*limit|too many requests|\b429\b|limit reached|resets? (?:at|on|in)\b|resets? \d/i.test(t)) return "rate-limit";
  if (/not logged in|please run \/login|invalid api key|authentication|unauthorized|\b401\b|credit balance/i.test(t)) return "auth";
  if (/max[- _]?budget|budget (?:exceeded|exhausted)|error_max_budget/i.test(t)) return "budget";
  if (/ETIMEDOUT|timed? ?out|timeout/i.test(t)) return "timeout";
  if (/ECONNRESET|ECONNREFUSED|ENOTFOUND|EAI_AGAIN|fetch failed|socket hang up|\b50[234]\b|overloaded|temporarily unavailable/i.test(t)) return "network";
  return "other";
}

/** When a limit message says when it resets ("resets 5:10am (Asia/Tokyo)"), that sentence; otherwise null. */
export function resetHint(text) {
  const m = /resets?\s+[^.\n]{3,60}/i.exec(String(text ?? ""));
  return m ? m[0].trim() : null;
}

/** The environment a model run gets: no EDINET key (it reads the evidence pack; it never calls EDINET) and no inherited nesting flags. */
export function cleanEnv(/** @type {NodeJS.ProcessEnv} */ env) {
  const out = { ...env };
  delete out.EDINET_API_KEY;
  delete out.CLAUDECODE;
  return out;
}

/** Is the `claude` CLI installed and answering? */
export function claudeAvailable(spawnImpl = spawn) {
  return new Promise((resolve) => {
    try {
      const c = spawnImpl("claude", ["--version"], { stdio: "ignore", windowsHide: true });
      c.on("error", () => resolve(false));
      c.on("close", (code) => resolve(code === 0));
    } catch {
      resolve(false);
    }
  });
}

/** Tools the headless agent may use: read the project, write only its own results, run the two checkers. */
export const AGENT_ALLOWED_TOOLS = [
  "Read",
  "Glob",
  "Grep",
  "Write(pipeline/results/**)",
  "Edit(pipeline/results/**)",
  "Bash(node scripts/pipeline/check-prose-figures.mjs *)",
  "Bash(node scripts/pipeline/check-policy.mjs *)",
  "Bash(node scripts/pipeline/merge-fragments.mjs *)",
  "Bash(date -u +%F)",
];

/**
 * @param {{
 *   mode?: "claude-cli" | "work-orders",
 *   model?: string,
 *   budgetUsd?: number,
 *   timeoutMs?: number,
 *   allowWeb?: boolean,
 *   cwd?: string,
 *   env?: NodeJS.ProcessEnv,
 *   spawnImpl?: typeof spawn,
 * }} [options]
 */
export function createExecutor({ mode = "claude-cli", model = "sonnet", budgetUsd = 3, timeoutMs = 25 * 60_000, allowWeb = false, cwd = process.cwd(), env = process.env, spawnImpl = spawn } = {}) {
  /**
   * @param {{ prompt: string, label: string }} job
   * @returns {Promise<{ ok: boolean, kind: "ok" | "awaiting" | "rate-limit" | "auth" | "budget" | "network" | "timeout" | "other", costUsd: number | null, durationMs: number, text: string, hint?: string | null }>}
   */
  async function run({ prompt }) {
    if (mode === "work-orders") return { ok: false, kind: "awaiting", costUsd: null, durationMs: 0, text: "" };
    const args = [
      "-p",
      prompt,
      "--agent",
      "data-research",
      "--model",
      model,
      "--permission-mode",
      "dontAsk",
      "--allowedTools",
      [...AGENT_ALLOWED_TOOLS, ...(allowWeb ? ["WebSearch", "WebFetch"] : [])].join(","),
      "--output-format",
      "json",
      "--max-budget-usd",
      String(budgetUsd),
      "--no-session-persistence",
    ];
    const started = Date.now();
    return await new Promise((resolve) => {
      const child = spawnImpl("claude", args, { cwd, env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
      let out = "";
      let err = "";
      let done = false;
      const finish = (/** @type {any} */ r) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve({ durationMs: Date.now() - started, ...r });
      };
      const timer = setTimeout(() => {
        // Settle first: killing the process makes it emit "close", which must not be read as a failure of its own.
        finish({ ok: false, kind: "timeout", costUsd: null, text: "実行時間の上限に達した" });
        child.kill();
      }, timeoutMs);
      child.stdout?.on("data", (d) => (out += d));
      child.stderr?.on("data", (d) => (err += d));
      child.on("error", (e) => finish({ ok: false, kind: /ENOENT/.test(String(e)) ? "auth" : "other", costUsd: null, text: scrubSecrets(`claude を起動できない: ${e.message}`) }));
      child.on("close", (code) => {
        let parsed = null;
        try {
          parsed = JSON.parse(out);
        } catch {
          /* not JSON: classified from the text below */
        }
        const resultText = scrubSecrets(String(parsed?.result ?? out ?? "") + (err ? `\n${err}` : ""));
        const costUsd = typeof parsed?.total_cost_usd === "number" ? parsed.total_cost_usd : null;
        if (parsed && parsed.is_error !== true && code === 0) return finish({ ok: true, kind: "ok", costUsd, text: resultText.slice(0, 4000) });
        const kind = classifyExecutorFailure(`${parsed?.subtype ?? ""} ${resultText}`);
        finish({ ok: false, kind, costUsd, text: resultText.slice(0, 4000), hint: kind === "rate-limit" ? resetHint(resultText) : null });
      });
    });
  }
  return { mode, run };
}
