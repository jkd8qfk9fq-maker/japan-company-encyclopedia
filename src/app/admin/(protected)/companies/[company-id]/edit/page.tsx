import { join } from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompanyEditor } from "@/components/admin/editor/company-editor";
import { EditingUnavailable } from "@/components/admin/editing-unavailable";
import { ContentStore, localEditingStatus } from "@/lib/content/content-store";
import { companySchema } from "@/lib/content/schemas";
import { companyRepository } from "@/lib/repositories";

export const metadata = { title: "企業を編集" };

export default async function EditCompanyPage({ params }: PageProps<"/admin/companies/[company-id]/edit">) {
  const id = (await params)["company-id"];
  const status = localEditingStatus();

  // Read the FILE, not the module cache: the editor must start from exactly
  // what is on disk, and its version is what a save is checked against.
  const loaded = await new ContentStore(process.cwd()).read("company", id);
  if (!loaded) notFound();
  const parsed = companySchema.safeParse(loaded.data);

  const companies = (await companyRepository.list()).map((c) => ({ id: c.id, name: c.name }));

  return (
    <div>
      <Link href={`/admin/companies/${id}`} className="text-sm text-muted-foreground hover:text-foreground">← 企業の詳細</Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold">{parsed.success ? parsed.data.name : id} を編集</h1>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{join("src", "data", "companies", `${id}.json`)}</p>
      <div className="mt-8">
        {!status.enabled ? (
          <EditingUnavailable reason={status.reason} />
        ) : !parsed.success ? (
          <p role="alert" className="text-sm text-destructive">データファイルが不正な形式のため、エディタで開けません。ファイルを直接確認してください。</p>
        ) : (
          <CompanyEditor initial={parsed.data} version={loaded.version} companies={companies} />
        )}
      </div>
    </div>
  );
}
