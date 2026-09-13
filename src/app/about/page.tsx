import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "このサービスについて",
  description: `${SITE_NAME}が何を目指し、どのように情報をつくっているか。`,
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  {
    title: "何をしている会社かを、最初に。",
    body: "企業ページは、会社名・一文の説明・事業構造の順に並んでいます。数秒で「何の会社か」がわかることを、いちばん大切にしています。",
  },
  {
    title: "出典のない事実は載せません。",
    body: "事業の説明、売上・利益の数値、歴史は、有価証券報告書や決算短信、各社の公式資料に基づいています。各項目の「出典を見る」から、元の資料を確認できます。確認できなかった情報は、推測で埋めずに空欄のままにしています。",
  },
  {
    title: "AIが作成し、公開後も直します。",
    body: "掲載内容はAIが公開資料を読み取って作成しています。誤りが見つかった場合は資料を確認して訂正し、訂正の記録を残します。",
  },
  {
    title: "投資の判断材料ではありません。",
    body: "株価や投資指標は扱いません。売上と利益は、会社の規模と事業を理解するための手がかりとして掲載しています。投資の勧誘や助言を目的としたものではありません。",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-8 md:px-8 md:pt-20">
      <p className="eyebrow" aria-hidden>About</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold md:text-[2.75rem]">このサービスについて</h1>
      <p className="mt-8 text-[1.25rem] leading-[1.9] md:text-[1.5rem]">
        {SITE_NAME}は、日本の上場企業を、会社名ではなく「何をしている会社なのか」から理解するための百科事典です。
      </p>

      <ol className="mt-16 border-t border-foreground">
        {PRINCIPLES.map((p, i) => (
          <li key={p.title} className="grid gap-3 border-b border-border py-10 md:grid-cols-[4rem_1fr]">
            <span className="wordmark figures text-3xl text-muted-foreground" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-serif text-xl font-semibold">{p.title}</h2>
              <p className="prose-ja mt-3">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-12 text-muted-foreground">
        誤りを見つけた場合は、<Link href="/report" className="link-ink">情報の誤りを報告</Link>からお知らせください。
      </p>
    </div>
  );
}
