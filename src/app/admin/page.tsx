import { pool } from "@/lib/utils/db.mjs";
import Link from "next/link";

type QuizResultJoinFeedback = QuizResult & { feedback_id: string };

export default async function Page() {
  const qResults = await pool.query<QuizResultJoinFeedback>("SELECT qr.*, f.id AS feedback_id FROM quiz_results qr LEFT JOIN feedbacks f ON qr.id = f.quiz_result_id;");
  return (
    <div className="prose dark:prose-invert container max-w-lg py-3">
      <h1 className="text-center">quiz results go here</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th>score</th>
            <th>feedback</th>
            <th>submited at</th>
          </tr>
        </thead>
        <tbody>
          {qResults.rows.map((result) => (
            <tr key={result.id}>
              <td>{result.score}</td>
              <td>{result.feedback_id ? <Link href={`/admin/feedbacks/${result.feedback_id}`}>View Feedback</Link> : "-"}</td>
              <td>{new Date(result.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
