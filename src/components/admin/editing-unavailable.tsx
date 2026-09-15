/** Shown in place of an editor anywhere but local development. */
export function EditingUnavailable({ reason }: { reason: string }) {
  return (
    <div className="rounded-md border border-border bg-paper p-5 text-sm leading-7">
      <p className="font-semibold">この環境では編集できません</p>
      <p className="mt-1 text-muted-foreground">{reason}</p>
      <p className="mt-3 text-muted-foreground">
        公開中の内容はリポジトリのデータファイルから作られています。訂正はローカル環境で行い、差分を確認してコミット・プッシュし、デプロイで公開します（docs/correction-workflow.md）。
      </p>
    </div>
  );
}
