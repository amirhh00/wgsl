import { NextRequest } from "next/server";
import { pool } from "@/lib/utils/db.mjs";
import sql from "sql-template-strings";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const feedbackData: Record<string, string> = {};
    const quiz_result_id = formData.get("quizId");
    const email = formData.get("email");
    const message = formData.get("message");
    const feedbackId = formData.get("feedbackId");
    for (const [name, value] of formData.entries()) {
      if (name === "quizId" || name === "email" || name === "message" || name === "feedbackId") continue;
      feedbackData[name] = value as string;
    }
    if (feedbackId) {
      // update the feedback
      await pool.query(sql`UPDATE feedbacks SET email = ${email}, message = ${message}, questionnaire = ${feedbackData} WHERE id = ${feedbackId}`);
    } else {
      const inserFeedbackResult = await pool.query<FeedBackResult>(
        sql`INSERT INTO feedbacks (quiz_result_id, email, message, questionnaire) VALUES (${quiz_result_id}, ${email}, ${message}, ${feedbackData}) RETURNING id`
      );
      cookies().set("feedbackId", inserFeedbackResult.rows[0].id.toString());
    }
    // redirect to the feedback page
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/feedback",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", {
      status: 500,
    });
  }
}
