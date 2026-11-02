/**
 * The 47 prefectures in JIS order (総務省's 都道府県コード 01–47), with the id their page lives at and the region
 * they are grouped under on the map pages. The ids are the romanised names, kebab-case like every external name.
 */
export const PREFECTURES = [
  { code: "01", id: "hokkaido", name: "北海道", region: "北海道" },
  { code: "02", id: "aomori", name: "青森県", region: "東北" },
  { code: "03", id: "iwate", name: "岩手県", region: "東北" },
  { code: "04", id: "miyagi", name: "宮城県", region: "東北" },
  { code: "05", id: "akita", name: "秋田県", region: "東北" },
  { code: "06", id: "yamagata", name: "山形県", region: "東北" },
  { code: "07", id: "fukushima", name: "福島県", region: "東北" },
  { code: "08", id: "ibaraki", name: "茨城県", region: "関東" },
  { code: "09", id: "tochigi", name: "栃木県", region: "関東" },
  { code: "10", id: "gunma", name: "群馬県", region: "関東" },
  { code: "11", id: "saitama", name: "埼玉県", region: "関東" },
  { code: "12", id: "chiba", name: "千葉県", region: "関東" },
  { code: "13", id: "tokyo", name: "東京都", region: "関東" },
  { code: "14", id: "kanagawa", name: "神奈川県", region: "関東" },
  { code: "15", id: "niigata", name: "新潟県", region: "中部" },
  { code: "16", id: "toyama", name: "富山県", region: "中部" },
  { code: "17", id: "ishikawa", name: "石川県", region: "中部" },
  { code: "18", id: "fukui", name: "福井県", region: "中部" },
  { code: "19", id: "yamanashi", name: "山梨県", region: "中部" },
  { code: "20", id: "nagano", name: "長野県", region: "中部" },
  { code: "21", id: "gifu", name: "岐阜県", region: "中部" },
  { code: "22", id: "shizuoka", name: "静岡県", region: "中部" },
  { code: "23", id: "aichi", name: "愛知県", region: "中部" },
  { code: "24", id: "mie", name: "三重県", region: "近畿" },
  { code: "25", id: "shiga", name: "滋賀県", region: "近畿" },
  { code: "26", id: "kyoto", name: "京都府", region: "近畿" },
  { code: "27", id: "osaka", name: "大阪府", region: "近畿" },
  { code: "28", id: "hyogo", name: "兵庫県", region: "近畿" },
  { code: "29", id: "nara", name: "奈良県", region: "近畿" },
  { code: "30", id: "wakayama", name: "和歌山県", region: "近畿" },
  { code: "31", id: "tottori", name: "鳥取県", region: "中国" },
  { code: "32", id: "shimane", name: "島根県", region: "中国" },
  { code: "33", id: "okayama", name: "岡山県", region: "中国" },
  { code: "34", id: "hiroshima", name: "広島県", region: "中国" },
  { code: "35", id: "yamaguchi", name: "山口県", region: "中国" },
  { code: "36", id: "tokushima", name: "徳島県", region: "四国" },
  { code: "37", id: "kagawa", name: "香川県", region: "四国" },
  { code: "38", id: "ehime", name: "愛媛県", region: "四国" },
  { code: "39", id: "kochi", name: "高知県", region: "四国" },
  { code: "40", id: "fukuoka", name: "福岡県", region: "九州・沖縄" },
  { code: "41", id: "saga", name: "佐賀県", region: "九州・沖縄" },
  { code: "42", id: "nagasaki", name: "長崎県", region: "九州・沖縄" },
  { code: "43", id: "kumamoto", name: "熊本県", region: "九州・沖縄" },
  { code: "44", id: "oita", name: "大分県", region: "九州・沖縄" },
  { code: "45", id: "miyazaki", name: "宮崎県", region: "九州・沖縄" },
  { code: "46", id: "kagoshima", name: "鹿児島県", region: "九州・沖縄" },
  { code: "47", id: "okinawa", name: "沖縄県", region: "九州・沖縄" },
] as const;

export type Prefecture = (typeof PREFECTURES)[number];
export type PrefectureName = Prefecture["name"];

export const PREFECTURE_NAMES = PREFECTURES.map((p) => p.name) as [PrefectureName, ...PrefectureName[]];
export const REGIONS = [...new Set(PREFECTURES.map((p) => p.region))];

export const prefectureById = (id: string) => PREFECTURES.find((p) => p.id === id) ?? null;
export const prefectureByName = (name: string) => PREFECTURES.find((p) => p.name === name) ?? null;
