import { cookies } from "next/headers";
import { pool } from "@/lib/utils/db.mjs";
import sql from "sql-template-strings";
import { QueryResult } from "pg";

export default async function FeedBack() {
  const quizId = cookies().get("quizId");
  let quizResult: QueryResult<QuizResult> | undefined;
  if (quizId) {
    quizResult = await pool.query<QuizResult>(sql`SELECT * FROM quiz_results WHERE id = ${quizId.value}`);
  }
  return (
    <div>
      FeedBack
      {quizId && <p>Quiz ID : {quizId.value}</p>}
      {quizResult && (
        <p>
          Quiz score : {quizResult.rows[0].score} out of {quizResult.rows[0].results.length}
        </p>
      )}
    </div>
  );
}
