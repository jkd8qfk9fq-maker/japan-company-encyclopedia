import { LocalReports } from "@/components/admin/local-reports";

export const metadata = { title: "報告" };

export default function AdminReports() {
  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">報告</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        表示されるのは、この端末のブラウザに保存された報告だけです。他の読者の報告は、サーバー側の保存先が決まるまで受け取れません（JCE-008）。
      </p>
      <div className="mt-8">
        <LocalReports />
      </div>
    </div>
  );
}
