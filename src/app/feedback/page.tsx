import { cookies } from "next/headers";
import { pool } from "@/lib/utils/db.mjs";
import sql from "sql-template-strings";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function FeedBack() {
  const quizId = cookies().get("quizId");
  const feedbackId = cookies().get("feedbackId");

  let quizResult: QuizResult | undefined;
  if (quizId) {
    const quizResultQuery = await pool.query<QuizResult>(sql`SELECT * FROM quiz_results WHERE id = ${quizId.value}`);
    quizResult = quizResultQuery.rows[0];
  }

  let feedbackResult: FeedBackResult | undefined;
  if (feedbackId) {
    const feedbackQuery = await pool.query<FeedBackResult>(sql`SELECT * FROM feedbacks WHERE id = ${feedbackId.value}`);
    feedbackResult = feedbackQuery.rows[0];
  }

  return (
    <div className="container max-w-lg py-3">
      <h1>Feedback</h1>
      <form className="flex flex-col gap-3 mt-2" action="/api/feedback" method="POST">
        <Input name="email" type="" placeholder="Email" defaultValue={feedbackResult?.email} />
        <Textarea name="message" placeholder="Type your message here." defaultValue={feedbackResult?.message} />
        {quizId && <input type="hidden" name="quizId" value={quizId.value} />}
        {feedbackResult && <input type="hidden" name="feedbackId" value={feedbackResult.id} />}
        <Button className="self-start" type="submit" variant="outline">
          {feedbackResult ? "Update Feedback" : "Submit Feedback"}
        </Button>
      </form>
    </div>
  );
}
