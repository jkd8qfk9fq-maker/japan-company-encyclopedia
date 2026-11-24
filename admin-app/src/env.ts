export type RateLimit = { limit: (options: { key: string }) => Promise<{ success: boolean }> };

export type AdminEnv = {
  /** Editors: may make pull requests. */
  ADMIN_EMAILS?: string;
  /** Approvers (also editors): may merge a pull request whose checks passed. Unset → no one merges from the app. */
  APPROVER_EMAILS?: string;
  /** Viewers: may read every screen, change nothing. */
  VIEWER_EMAILS?: string;
  GITHUB_TOKEN?: string;
  RESEND_API_KEY?: string;
  GITHUB_REPO: string;
  SITE_ORIGIN: string;
  LOGIN_LIMIT?: RateLimit;
  /** Cloudflare Access (JCE-109): the team domain and this application's audience tag. When both are set, sign-in is Access's. */
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  /** Development only: log the sign-in link instead of mailing it. */
  LOGIN_LINK_LOG?: string;
};

/** What the app still lacks to run, in the operator's words. */
export function missingSettings(env: AdminEnv): string[] {
  const missing: string[] = [];
  if (!env.ADMIN_EMAILS?.trim() && !env.APPROVER_EMAILS?.trim()) missing.push("ADMIN_EMAILS（ログインできるメールアドレス）");
  if (!env.GITHUB_TOKEN) missing.push("GITHUB_TOKEN（プルリクエストを作るための GitHub のトークン）");
  if (!usesAccess(env) && !env.RESEND_API_KEY && env.LOGIN_LINK_LOG !== "1") missing.push("RESEND_API_KEY（ログイン用メールの送信）");
  return missing;
}

const list = (value: string | undefined) => new Set((value ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));

/** Everyone who may sign in at all: viewers, editors and approvers. */
export const allowedEmails = (env: AdminEnv) => new Set([...list(env.ADMIN_EMAILS), ...list(env.APPROVER_EMAILS), ...list(env.VIEWER_EMAILS)]);

export type Role = "viewer" | "editor" | "approver";

/** One role per address, the highest it is listed for (JCE-109 stage 3: 閲覧・編集・承認). */
export function roleOf(env: AdminEnv, email: string | null): Role | null {
  if (!email) return null;
  const e = email.toLowerCase();
  if (list(env.APPROVER_EMAILS).has(e)) return "approver";
  if (list(env.ADMIN_EMAILS).has(e)) return "editor";
  if (list(env.VIEWER_EMAILS).has(e)) return "viewer";
  return null;
}

export const ROLE_LABEL: Record<Role, string> = { viewer: "閲覧", editor: "編集", approver: "承認" };

/** With Cloudflare Access configured, it is the sign-in; the e-mailed link is the fallback for when it is not. */
export const usesAccess = (env: AdminEnv) => Boolean(env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD);
