import type { Metadata } from "next";
import { LessonPlayer } from "@/components/engagement/lesson-player";
import { LEARN } from "@/lib/learning-ui";
import { MICRO_LESSON_IDS } from "@/lib/micro-lessons";

export function generateStaticParams() {
  return MICRO_LESSON_IDS.map((id) => ({ "lesson-id": id }));
}

export const metadata: Metadata = {
  title: "レッスン",
  description: "実在企業の決算で読み方を鍛えるマイクロレッスン。1画面1ステップで、読んで、予測して、その場で確かめます。",
  alternates: { canonical: "/learn" },
};

/**
 * One lesson, played one step at a time (JCE-088). The lesson's content — its reading and its questions,
 * each with its source and period — is the same bound course the path on /learn points at; only the
 * presentation changed, from a scrolling page to a player.
 */
export default async function LessonPage({ params }: { params: Promise<{ "lesson-id": string }> }) {
  const { "lesson-id": lessonId } = await params;
  return (
    <div className="mx-auto max-w-2xl px-5 pt-6 pb-16 md:px-8">
      <div className="rounded-3xl border-2 bg-white p-5 sm:p-7" style={{ borderColor: LEARN.line, color: LEARN.ink }}>
        <LessonPlayer lessonId={lessonId} />
      </div>
    </div>
  );
}
