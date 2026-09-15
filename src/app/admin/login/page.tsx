import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminConfig, isAdmin } from "@/lib/admin/session";

export const metadata: Metadata = { title: "ログイン" };

// Reads the session and configuration at request time, not build time.
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  const configured = getAdminConfig() !== null;

  return (
    <section className="mx-auto max-w-sm py-16">
      <h1 className="font-serif text-3xl font-semibold">管理画面</h1>
      {configured ? (
        <div className="mt-8">
          <LoginForm />
        </div>
      ) : (
        // Deliberately vague to the public; the operator's instructions are in CLAUDE.md.
        <p className="mt-6 text-sm leading-7 text-muted-foreground">管理画面は現在利用できません。</p>
      )}
    </section>
  );
}
