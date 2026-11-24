export type RateLimit = { limit: (options: { key: string }) => Promise<{ success: boolean }> };

export type AdminEnv = {
  ADMIN_EMAILS?: string;
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
  if (!env.ADMIN_EMAILS?.trim()) missing.push("ADMIN_EMAILS（ログインできるメールアドレス）");
  if (!env.GITHUB_TOKEN) missing.push("GITHUB_TOKEN（プルリクエストを作るための GitHub のトークン）");
  if (!usesAccess(env) && !env.RESEND_API_KEY && env.LOGIN_LINK_LOG !== "1") missing.push("RESEND_API_KEY（ログイン用メールの送信）");
  return missing;
}

export const allowedEmails = (env: AdminEnv) =>
  new Set((env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));

/** With Cloudflare Access configured, it is the sign-in; the e-mailed link is the fallback for when it is not. */
export const usesAccess = (env: AdminEnv) => Boolean(env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD);
