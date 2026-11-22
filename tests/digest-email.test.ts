import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildDigest } from "../src/lib/digest";
import {
  DIGEST_EMAIL_MAX_HIGHLIGHT,
  DIGEST_EMAIL_MAX_LISTED,
  buildDigestEmail,
} from "../src/lib/digest-email";
import type { UpdatesData } from "../src/lib/engagement-data";

/** JCE-086: the weekly digest as a mail draft — same week's filings as /digest, as a training prompt. */

const TODAY = "2026-11-22"; // a Sunday: this week is Mon 2026-11-16 – Sun 2026-11-22.
const SUMMARY = "2026年3月期 第2四半期（累計）：売上 25兆円、純利益 2兆円";

const fixtureUpdates = (): UpdatesData => ({
  asOf: TODAY,
  days: 120,
  names: {
    toyota: "トヨタ自動車",
    sony: "ソニーグループ",
    nintendo: "任天堂",
    panasonic: "パナソニック ホールディングス",
    hitachi: "日立製作所",
    canon: "キヤノン",
    mitsubishi: "三菱商事",
    softbank: "ソフトバンクグループ",
    fastretailing: "ファーストリテイリング",
    keyence: "キーエンス",
    daikin: "ダイキン工業",
    fanuc: "ファナック",
    recruit: "リクルートホールディングス",
    lastec: "レーザーテック",
    oldco: "古い会社",
  },
  // In buildUpdates order: date desc, companyId asc within a day — the order /digest receives.
  events: [
    ["softbank", "yuho", "2026-11-22", "2026年3月期の有価証券報告書", SUMMARY],
    ["canon", "hanki", "2026-11-21", "2026年12月期の半期報告書", SUMMARY],
    ["fastretailing", "yuho", "2026-11-21", "2026年8月期の有価証券報告書", SUMMARY],
    ["keyence", "yuho", "2026-11-20", "2026年3月期の有価証券報告書", SUMMARY],
    ["mitsubishi", "correction", "2026-11-20", "掲載内容の訂正"],
    ["toyota", "tanshin", "2026-11-20", "2026年3月期 第2四半期の決算短信", SUMMARY],
    ["daikin", "yuho", "2026-11-19", "2026年3月期の有価証券報告書", SUMMARY],
    ["hitachi", "yuho", "2026-11-19", "2026年3月期の有価証券報告書", SUMMARY],
    ["fanuc", "yuho", "2026-11-18", "2026年3月期の有価証券報告書", SUMMARY],
    ["sony", "tanshin", "2026-11-18", "2026年3月期 第2四半期の決算短信", SUMMARY],
    ["nintendo", "tanshin", "2026-11-17", "2026年3月期 第2四半期の決算短信", SUMMARY],
    ["recruit", "yuho", "2026-11-17", "2026年3月期の有価証券報告書", SUMMARY],
    ["lastec", "yuho", "2026-11-16", "2026年3月期の有価証券報告書", SUMMARY],
    ["panasonic", "tanshin", "2026-11-16", "2026年3月期 第2四半期の決算短信", SUMMARY],
    ["sony", "tanshin", "2026-11-13", "2026年3月期 第1四半期の決算短信", SUMMARY],
    ["toyota", "yuho", "2026-11-10", "2025年3月期の有価証券報告書", SUMMARY],
    ["oldco", "yuho", "2026-11-01", "2026年3月期の有価証券報告書", SUMMARY],
  ],
});

describe("buildDigestEmail", () => {
  it("covers the same week as /digest, in the same order", () => {
    const updates = fixtureUpdates();
    const digest = buildDigest(updates, TODAY);
    const email = buildDigestEmail(updates, TODAY);
    expect(email.subject).toBe("決算定期便：今週の開示 14件（11月16日〜11月22日）");
    expect(email.text).toContain("今週は 14件 の開示がありました");
    expect(email.text).toContain("先週の開示は 2件でした");
    // The mail's week is the page's week: same companies, same order, nothing older.
    const digestIds = digest.thisWeek.map((e) => e.companyId);
    for (const id of digestIds.slice(0, DIGEST_EMAIL_MAX_LISTED)) expect(email.text).toContain(updates.names[id]!);
    expect(email.text).not.toContain("古い会社");
    expect(digest.lastWeek).toHaveLength(2);
  });

  it("lists at most 12 filings and points at /digest for the rest", () => {
    const email = buildDigestEmail(fixtureUpdates(), TODAY);
    expect(email.text).toContain("ほか 2件の開示は、決算定期便のページでご覧ください。");
    expect(email.text).not.toContain("レーザーテック");
  });

  it("highlights at most 3 決算短信, as a rule — never a ranking", () => {
    const email = buildDigestEmail(fixtureUpdates(), TODAY);
    const section = email.text.split("■ 今週の決算短信")[1]!.split("■ 今週の開示")[0]!;
    expect(section).toContain("トヨタ自動車");
    expect(section).toContain("ソニーグループ");
    expect(section).toContain("任天堂");
    expect(section).not.toContain("パナソニック");
    expect(DIGEST_EMAIL_MAX_HIGHLIGHT).toBe(3);
  });

  it("carries the verified figures with their period, and no figures on a correction", () => {
    const email = buildDigestEmail(fixtureUpdates(), TODAY);
    expect(email.text).toContain(SUMMARY);
    const correction = email.text.split("三菱商事")[1]!.split("・")[0]!;
    expect(correction).not.toContain("売上");
    expect(correction).not.toContain("純利益");
    expect(correction).toContain("読み方：訂正は企業ページの数字で確かめる");
  });

  it("links the reader's own verification and the lessons, not a news feed", () => {
    const email = buildDigestEmail(fixtureUpdates(), TODAY);
    expect(email.text).toContain("https://kigyo-hyakka.com/digest");
    expect(email.text).toContain("https://kigyo-hyakka.com/learn#training-history");
    expect(email.text).toContain("https://kigyo-hyakka.com/learn");
    expect(email.text).toContain("企業レポート（分析5観点）：https://kigyo-hyakka.com/companies/toyota/report");
    expect(email.html).toContain('<a href="https://kigyo-hyakka.com/companies/toyota/report">企業レポート（分析5観点）</a>');
  });

  it("never carries a valuation, a score, or a recommendation", () => {
    const email = buildDigestEmail(fixtureUpdates(), TODAY);
    for (const banned of ["株価", "PER", "PBR", "ROE", "ROA", "推奨", "おすすめ", "買い時", "売り時", "目標株価", "格付け", "スコア", "配当利回り"]) {
      expect(email.text).not.toContain(banned);
      expect(email.html).not.toContain(banned);
    }
  });

  it("is still a valid draft when the week has no filings", () => {
    const empty: UpdatesData = { asOf: TODAY, days: 120, names: {}, events: [] };
    const email = buildDigestEmail(empty, TODAY);
    expect(email.subject).toContain("今週の開示 0件");
    expect(email.text).toContain("今週（月曜から日曜まで）の開示は、まだありません。");
  });
});

describe("send-weekly-digest.mjs", () => {
  const runScript = (updatesPath: string, recipientsPath: string, outDir: string) =>
    execFileSync(
      "node",
      ["scripts/digest/send-weekly-digest.mjs", "--updates", updatesPath, "--recipients", recipientsPath, "--today", TODAY, "--out", outDir],
      { encoding: "utf8", cwd: process.cwd() },
    );

  it("writes a draft and reports 送信対象なし when the list is empty", () => {
    const dir = mkdtempSync(join(tmpdir(), "digest-email-"));
    const updatesPath = join(dir, "updates.json");
    const recipientsPath = join(dir, "recipients.csv");
    const outDir = join(dir, "drafts");
    writeFileSync(updatesPath, JSON.stringify(fixtureUpdates()), "utf8");
    writeFileSync(recipientsPath, "email,name,source\n", "utf8");
    const stdout = runScript(updatesPath, recipientsPath, outDir);
    expect(stdout).toContain("送信対象なし");
    const draftPath = join(outDir, `${TODAY}-digest-draft.md`);
    expect(existsSync(draftPath)).toBe(true);
    const draft = readFileSync(draftPath, "utf8");
    expect(draft).toContain("決算定期便：今週の開示 14件");
    expect(draft).toContain("宛先: 0件");
  });

  it("counts one recipient and still sends nothing", () => {
    const dir = mkdtempSync(join(tmpdir(), "digest-email-"));
    const updatesPath = join(dir, "updates.json");
    const recipientsPath = join(dir, "recipients.csv");
    const outDir = join(dir, "drafts");
    writeFileSync(updatesPath, JSON.stringify(fixtureUpdates()), "utf8");
    writeFileSync(recipientsPath, "email,name,source\ntest@example.com,テスト,form\n", "utf8");
    const stdout = runScript(updatesPath, recipientsPath, outDir);
    expect(stdout).toContain("送信対象: 1件");
    expect(stdout).toContain("送信は行いません");
  });

  it("refuses a malformed recipient list instead of guessing", () => {
    const dir = mkdtempSync(join(tmpdir(), "digest-email-"));
    const updatesPath = join(dir, "updates.json");
    const recipientsPath = join(dir, "recipients.csv");
    writeFileSync(updatesPath, JSON.stringify(fixtureUpdates()), "utf8");
    writeFileSync(recipientsPath, "email,name,source\nnot-an-email,テスト,form\n", "utf8");
    expect(() => runScript(updatesPath, recipientsPath, join(dir, "drafts"))).toThrow("メールアドレスの形が正しくありません");
  });
});
