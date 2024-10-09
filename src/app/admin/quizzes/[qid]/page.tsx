import sql from 'sql-template-strings';
import { pool } from '@/lib/utils/db.mjs';

export default async function Page({ params: { qid } }: { params: { qid: string } }) {
  const quizResultQuery = await pool.query<QuizResult>(sql`SELECT * FROM quiz_results WHERE id = ${qid}`);
  if (!quizResultQuery || !quizResultQuery.rows.length) {
    return (
      <div className="text-center">
        <h1>Quiz not found</h1>
      </div>
    );
  }
  const q = quizResultQuery.rows[0];

  return (
    <div className="container max-w-lg py-3 text-center">
      <h1> Quiz result received on {q.created_at?.toUTCString()}</h1>
      <p>score: {q.score}</p>
      <ul className="list-disc">
        {q.results.map((r) => {
          const isCorrect = r.answer + 1 === r.userAnswer ? 'correct' : 'incorrect';
          return (
            <li key={r.id} className="text-left my-2" style={{ color: isCorrect === 'correct' ? 'green' : 'red' }}>
              <p>{r.question}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
