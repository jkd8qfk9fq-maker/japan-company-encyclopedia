import type { Metadata } from "next";
import { ReviewPlayer } from "@/components/engagement/lesson-player";
import { LEARN } from "@/lib/learning-ui";

export const metadata: Metadata = {
  title: "復習キュー",
  description: "以前に答えた問題を、間隔をあけてもう一度。正解すると次の復習は少し先に、間違えると明日また出ます。",
  alternates: { canonical: "/learn" },
};

/** The review queue, played with the same one-step player as a lesson (JCE-088). */
export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-6 pb-16 md:px-8">
      <div className="rounded-3xl border-2 bg-white p-5 sm:p-7" style={{ borderColor: LEARN.line, color: LEARN.ink }}>
        <ReviewPlayer />
      </div>
    </div>
  );
}
