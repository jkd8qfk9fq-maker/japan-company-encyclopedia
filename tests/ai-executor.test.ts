import type { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import { describe, expect, it } from "vitest";
import { AGENT_ALLOWED_TOOLS, classifyExecutorFailure, cleanEnv, createExecutor, resetHint } from "../scripts/pipeline/ai-executor.mjs";

/** A fake `claude` process: emits what the test says, then closes. */
const fakeSpawn = (stdout: string, { code = 0, stderr = "", error = null as Error | null, hang = false } = {}) => {
  const calls: { cmd: string; args: string[]; env: NodeJS.ProcessEnv }[] = [];
  const impl = ((cmd: string, args: string[], opts: { env: NodeJS.ProcessEnv }) => {
    calls.push({ cmd, args, env: opts.env });
    const child = new EventEmitter() as EventEmitter & { stdout: EventEmitter; stderr: EventEmitter; kill: () => void };
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    child.kill = () => child.emit("close", null);
    if (!hang) {
      setTimeout(() => {
        if (error) return child.emit("error", error);
        child.stdout.emit("data", stdout);
        if (stderr) child.stderr.emit("data", stderr);
        child.emit("close", code);
      }, 0);
    }
    return child;
  }) as unknown as typeof spawn;
  return { impl, calls };
};

describe("what a failed run said", () => {
  it.each([
    ["You've hit your session limit · resets 5:10am (Asia/Tokyo)", "rate-limit"],
    ["API Error: 429 rate_limit", "rate-limit"],
    ["You've hit your weekly limit · resets 7pm (Asia/Tokyo)", "rate-limit"],
    ["You've hit your limit · resets 5:10am", "rate-limit"],
    ["Not logged in · Please run /login", "auth"],
    ["error_max_budget_usd", "budget"],
    ["fetch failed ECONNRESET", "network"],
    ["503 overloaded", "network"],
    ["ETIMEDOUT", "timeout"],
    ["something else", "other"],
  ])("%s → %s", (text, kind) => expect(classifyExecutorFailure(text)).toBe(kind));

  it("finds when a limit resets", () => expect(resetHint("You've hit your limit · resets 5:10am (Asia/Tokyo)")).toBe("resets 5:10am (Asia/Tokyo)"));
});

describe("the headless agent", () => {
  it("passes the brief as a prompt to the data-research agent, with a budget, a tool allow-list and no session kept", async () => {
    const { impl, calls } = fakeSpawn(JSON.stringify({ result: "完了", total_cost_usd: 0.8, is_error: false }));
    const r = await createExecutor({ spawnImpl: impl, budgetUsd: 2 }).run({ prompt: "会社: アクメ", label: "group1" });
    expect(r).toMatchObject({ ok: true, kind: "ok", costUsd: 0.8 });
    const args = calls[0].args;
    expect(args[args.indexOf("--agent") + 1]).toBe("data-research");
    expect(args[args.indexOf("--max-budget-usd") + 1]).toBe("2");
    expect(args).toContain("--no-session-persistence");
    expect(args[args.indexOf("--permission-mode") + 1]).toBe("dontAsk");
    const tools = args[args.indexOf("--allowedTools") + 1];
    expect(tools).toContain("Write(pipeline/results/**)");
    expect(tools).not.toMatch(/WebSearch|WebFetch/);
  });

  it("allows the web only when asked", async () => {
    const { impl, calls } = fakeSpawn(JSON.stringify({ result: "", is_error: false }));
    await createExecutor({ spawnImpl: impl, allowWeb: true }).run({ prompt: "p", label: "l" });
    expect(calls[0].args[calls[0].args.indexOf("--allowedTools") + 1]).toContain("WebSearch");
  });

  it("can write only into pipeline/results and run only the two checkers", () => {
    const writes = AGENT_ALLOWED_TOOLS.filter((t) => /^(Write|Edit)/.test(t));
    expect(writes.every((t) => t.includes("pipeline/results/**"))).toBe(true);
    const bash = AGENT_ALLOWED_TOOLS.filter((t) => t.startsWith("Bash"));
    expect(bash.join()).not.toMatch(/git|rm |advance|finalize|--write/);
  });

  it("does not hand the EDINET key to the model", () => {
    const env = cleanEnv({ EDINET_API_KEY: "secret", PATH: "x", CLAUDECODE: "1" } as unknown as NodeJS.ProcessEnv);
    expect(env.EDINET_API_KEY).toBeUndefined();
    expect(env.CLAUDECODE).toBeUndefined();
    expect(env.PATH).toBe("x");
  });

  it("calls a limit a rate-limit, with when it resets, and keeps no secret in the text", async () => {
    const { impl } = fakeSpawn(JSON.stringify({ is_error: true, result: "You've hit your session limit · resets 5:10am (Asia/Tokyo) Subscription-Key=abcdef123456" }), { code: 1 });
    const r = await createExecutor({ spawnImpl: impl }).run({ prompt: "p", label: "l" });
    expect(r).toMatchObject({ ok: false, kind: "rate-limit", hint: expect.stringContaining("5:10am") });
    expect(r.text).not.toContain("abcdef123456");
  });

  it("reports a missing CLI as unavailable rather than crashing", async () => {
    const { impl } = fakeSpawn("", { error: Object.assign(new Error("spawn claude ENOENT"), { code: "ENOENT" }) });
    expect((await createExecutor({ spawnImpl: impl }).run({ prompt: "p", label: "l" })).kind).toBe("auth");
  });

  it("gives up on a run that never ends", async () => {
    const { impl } = fakeSpawn("", { hang: true });
    const r = await createExecutor({ spawnImpl: impl, timeoutMs: 20 }).run({ prompt: "p", label: "l" });
    expect(r).toMatchObject({ ok: false, kind: "timeout" });
  });

  it("calls nothing in work-orders mode", async () => {
    const { impl, calls } = fakeSpawn("");
    expect(await createExecutor({ mode: "work-orders", spawnImpl: impl }).run({ prompt: "p", label: "l" })).toMatchObject({ ok: false, kind: "awaiting" });
    expect(calls).toEqual([]);
  });
});
