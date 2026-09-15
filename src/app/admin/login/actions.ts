"use server";

import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/admin/crypto";
import { clientAddress, getAdminConfig, startSession } from "@/lib/admin/session";

export type LoginState = { error?: string };

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

/**
 * Failed attempts per client address, in memory. Best effort: on a serverless
 * host each instance has its own map, so this slows guessing rather than
 * stopping it. The real defence is the password's length (the hash script
 * refuses fewer than 12 characters) and scrypt's cost per guess.
 */
const failures = new Map<string, { count: number; first: number }>();

export async function login(_previous: LoginState, form: FormData): Promise<LoginState> {
  const config = getAdminConfig();
  if (!config) return { error: "管理画面が設定されていません。" };

  const address = await clientAddress();
  const now = Date.now();
  const record = failures.get(address);
  if (record && now - record.first < WINDOW_MS && record.count >= MAX_ATTEMPTS) {
    return { error: "試行回数が多すぎます。15分ほどしてからもう一度お試しください。" };
  }

  const password = form.get("password");
  const ok = typeof password === "string" && password.length > 0 && (await verifyPassword(password, config.passwordHash));
  if (!ok) {
    const fresh = !record || now - record.first >= WINDOW_MS;
    failures.set(address, fresh ? { count: 1, first: now } : { count: record.count + 1, first: record.first });
    // One message for every failure: never reveal whether the account or the password was wrong.
    return { error: "パスワードが違います。" };
  }

  failures.delete(address);
  await startSession(config);
  redirect("/admin");
}
