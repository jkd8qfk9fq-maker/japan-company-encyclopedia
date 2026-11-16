import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, siteUrl } from "@/lib/site";
import { DIAGNOSIS_URL } from "@/lib/support";

export const metadata: Metadata = {
  title: "使い方・よくある質問",
  description: `${SITE_NAME}の使い方と、よくある質問。データの出典、更新、保存される情報、プレミアムプラン、困ったときの対処。`,
  alternates: { canonical: "/help" },
};

const STEPS: { title: string; body: React.ReactNode }[] = [
  { title: "会社を探す", body: <>名前や証券コードで<Link href="/search" className="link-ink">検索</Link>するか、<Link href="/industries" className="link-ink">業界</Link>・<Link href="/prefectures" className="link-ink">本社所在地</Link>からたどります。</> },
  { title: "3秒で「何の会社か」をつかむ", body: <>企業ページのいちばん上に、事業の構造を図で置いています。続けて、お金の流れ、5期分の数字、沿革、つながりを読めます。</> },
  { title: "つながりから、次の会社へ", body: <><Link href="/network" className="link-ink">企業ネットワーク</Link>で取引先や競合を立体でたどるか、<Link href="/discover" className="link-ink">発見</Link>で1社ずつスワイプして出会います。</> },
  { title: "気になる会社をフォローする", body: <>企業ページの「フォロー」を押すと、新しい決算が出たときにベルのマークでお知らせします。出会った会社は<Link href="/discover/collection" className="link-ink">マイ企業図鑑</Link>に残ります。</> },
];

// Plain strings as well as the rendered answer: the same text feeds the FAQ structured data below.
const FAQ: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "掲載している内容",
    items: [
      { q: "データはどこから来ていますか？", a: "金融庁の EDINET で公開されている有価証券報告書と半期報告書がもとです。第1・第3四半期の数字だけは、EDINET DB が決算短信を構造化したデータを、EDINET の数字と照合したうえで使っています。各ページの下に、出典の書類を載せています。" },
      { q: "どのくらいの頻度で更新されますか？", a: "新しい有価証券報告書・半期報告書が出ていないかを毎日確かめ、出ていれば数字を更新します。更新や訂正は、記録を残したうえで反映します。" },
      { q: "文章は誰が書いていますか？", a: "有価証券報告書の記載をもとに、AI が下書きを作成し、出典と照合する検査を通したものを掲載しています。出典で確かめられない事実は載せません。誤りに気づかれたら、お問い合わせからお知らせください。" },
      { q: "「計算値」と書かれた数字は何ですか？", a: "有価証券報告書に印字された同じ年の数字から、ページ上で計算した比率です（事業ごとの売上の割合、純利益率、海外売上高比率など）。計算式を数字のそばに表示しています。" },
      { q: "投資の参考にしてよいですか？", a: "本サイトは「この会社は何をしているか」を知るための百科事典で、投資の判断材料や推奨を提供するものではありません。株価や投資指標は載せていません。" },
      { q: "載っていない会社があります。", a: "国内の証券取引所に上場している会社を、順に追加しています。事業の説明まで整った会社と、数字だけを先に載せている会社があります。" },
    ],
  },
  {
    group: "保存される情報",
    items: [
      { q: "会員登録は必要ですか？", a: "不要です。ログインもありません。" },
      { q: "フォローや図鑑、連続日数はどこに保存されますか？", a: "お使いのブラウザの中だけに保存され、サーバーには送られません。そのため、別の端末やブラウザには引き継がれず、ブラウザのデータを消すと記録も消えます。" },
      { q: "記録を消したいときは？", a: "「設定」のページで、閲覧履歴、フォロー、マイ企業図鑑と記録を、それぞれ消せます。" },
      { q: "通知は届きますか？", a: "メールやプッシュ通知は送りません。フォローした会社に新しい決算が出ると、サイトを開いたときにベルのマークに件数が出ます。" },
    ],
  },
  {
    group: "プレミアムプラン",
    items: [
      { q: "無料でどこまで使えますか？", a: "企業ページ（事業の構造、お金の流れ、最新期の数字、5期のグラフ、四半期の動き、沿革、つながり）、業界のしくみ、企業ネットワーク、発見、今日の1問は無料です。" },
      { q: "プレミアムプランで増えるものは？", a: "企業ページの「業界比較」と「財務の深掘り」、業界の「数字で見る」が読めるようになり、広告が表示されなくなります。同じプランで、企業タイプ診断の全機能も使えます。" },
      { q: "申し込み・解約はどこでしますか？", a: "企業タイプ診断のプランのページで行います。料金、解約の方法、特定商取引法に基づく表記も、そちらに掲載しています。" },
      { q: "別の端末でもプレミアムを使えますか？", a: "使えます。プランのページで、申し込みに使ったメールアドレスにリンクを送る「メールで復元」か、購入コードの入力で、その端末でも使えるようになります。" },
    ],
  },
  {
    group: "困ったとき",
    items: [
      { q: "ページの表示がおかしい、古い内容が出ます。", a: "ページを再読み込みしてください。ホーム画面に追加して使っている場合は、いちど閉じて開き直すと新しい内容に切り替わります。" },
      { q: "プレミアムなのに、有料の部分が開きません。", a: "プランのページを開くと、購入コードをいちど確かめ直します。それでも開かないときは、同じページの「メールで復元」をお試しください。解約済み・支払いの失敗のときは開きません。" },
      { q: "企業ネットワークが動きません。", a: "図はドラッグで回転、ピンチ（パソコンはホイール）で拡大、タップで会社を選べます。図の下にも同じつながりを一覧で出しているので、そちらからも移動できます。" },
      { q: "ホーム画面に追加（アプリとして使う）には？", a: "iPhone は Safari の共有ボタンから「ホーム画面に追加」、Android やパソコンの Chrome はメニューの「アプリをインストール」です。「設定」のページにも案内があります。" },
    ],
  },
];

export default function HelpPage() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.flatMap((g) => g.items).map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
    url: siteUrl("/help"),
  };
  return (
    <div className="mx-auto max-w-3xl px-5 pt-12 pb-8 md:px-8 md:pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, "\\u003c") }} />
      <p className="eyebrow" aria-hidden>Help</p>
      <h1 className="mt-3 font-serif text-[2rem] font-semibold md:text-[2.75rem]">使い方・よくある質問</h1>
      <p className="prose-ja mt-4 text-muted-foreground">はじめての方へ、4つの使い方と、よくいただく質問をまとめました。</p>

      <h2 className="mt-12 font-serif text-xl font-semibold">使い方</h2>
      <ol className="mt-4 border-t border-foreground">
        {STEPS.map((step, i) => (
          <li key={step.title} className="grid gap-2 border-b border-border py-6 md:grid-cols-[3rem_1fr]">
            <span className="figures font-display text-2xl text-seal" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="font-medium">{step.title}</p>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-muted-foreground">
        自分に近い会社から探したいときは、<a href={DIAGNOSIS_URL} className="link-ink">企業タイプ診断</a>（無料）もあります。
      </p>

      {FAQ.map((group) => (
        <section key={group.group} className="mt-14" aria-labelledby={`faq-${group.group}`}>
          <h2 id={`faq-${group.group}`} className="font-serif text-xl font-semibold">{group.group}</h2>
          <div className="mt-4 border-t border-foreground">
            {group.items.map((item) => (
              <details key={item.q} className="group border-b border-border">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 font-medium">
                  {item.q}
                  <span aria-hidden className="text-muted-foreground transition-transform group-open:rotate-45">＋</span>
                </summary>
                <p className="pb-5 text-sm leading-7 text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      <p className="mt-14 text-sm">
        解決しないときは、<Link href="/contact" className="link-ink">お問い合わせ</Link>からお知らせください。
      </p>
    </div>
  );
}
