/**
 * A company's own website, as its 有価証券報告書 prints it in 【株式事務の概要】公告掲載方法 (the address where it posts its
 * electronic public notices), reduced to the site's origin by scripts/pipeline/sync-websites.py (JCE-055). A company
 * that prints no address, or prints one that other companies print too (a notice service, a parent's site), is absent.
 */
export interface Website {
  /** The origin only: https://www.nissui.co.jp/ */
  url: string;
  /** The entry's own yuho-* source the address was read from. */
  sourceId: string;
}

export interface WebsiteData {
  locator: string;
  /** YYYY-MM-DD the filings were read. */
  readAt: string;
  companies: Record<string, Website>;
}
