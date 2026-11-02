import { headquartersRepository } from "@/lib/repositories";
import { formatDateJa } from "@/lib/utils/format";

/**
 * The credit every map and prefecture page carries. 公共データ利用規約 (PDL 1.0), under which EDINET content is used,
 * asks for the source to be named and for an edited result to say it was edited, and by whom.
 */
export async function HeadquartersSource({ unplaced }: { unplaced?: number }) {
  const source = await headquartersRepository.source();
  return (
    <p className="text-xs leading-5 text-muted-foreground">
      本社の所在地は、{source.publisher}「
      <a href={source.url} className="underline underline-offset-2 hover:text-foreground">
        {source.title}
      </a>
      」（{formatDateJa(source.downloadedAt)}取得）の所在地を、総務省「全国地方公共団体コード」で都道府県に当てはめて日本企業百科事典が加工したものです。
      {unplaced !== undefined && unplaced > 0 && `市区町村名から都道府県が一つに決まらない会社など${unplaced.toLocaleString("ja-JP")}社は含めていません。`}
      地図の輪郭は Natural Earth（パブリックドメイン）を簡略化しています。
    </p>
  );
}
