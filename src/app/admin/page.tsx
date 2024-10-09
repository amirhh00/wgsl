import { pool } from '@/lib/utils/db.mjs';
import Link from 'next/link';

type QuizResultJoinFeedback = QuizResult & { feedback_id: string };

export default async function Page() {
  const qResults = await pool.query<QuizResultJoinFeedback>(
    'SELECT qr.*, f.id AS feedback_id FROM quiz_results qr LEFT JOIN feedbacks f ON qr.id = f.quiz_result_id ORDER BY qr.created_at ASC'
  );

  return (
    <div className="prose dark:prose-invert container max-w-4xl py-3">
      <h1 className="text-center">quiz results by users</h1>
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
              <td>
                {result.feedback_id ? <Link href={`/admin/feedbacks/${result.feedback_id}`}>View Feedback</Link> : '-'}
              </td>
              <td>{new Date(result.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col">
        <h2 className="text-center my-2">Distribution of Correct Answers by Difficulty Level Among All Users</h2>
        <div className="flex justify-center gap-3">
          <div className="flex justify-center items-center gap-2">
            <div className="bg-[tomato] w-5 aspect-square" />
            <p>easy</p>
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="bg-[aqua] w-5 aspect-square" />
            <p>medium</p>
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="bg-[forestgreen] w-5 aspect-square" />
            <p>hard</p>
          </div>
        </div>
        <svg viewBox="-1 -1 2 2" className="-rotate-90 max-w-xs mx-auto mb-6">
          {(() => {
            const easy = qResults.rows.reduce((acc, result) => {
              return (
                acc + result.results.filter((r) => r.difficulty === 'easy' && r.answer + 1 === r.userAnswer).length
              );
            }, 0);
            const medium = qResults.rows.reduce((acc, result) => {
              return (
                acc + result.results.filter((r) => r.difficulty === 'medium' && r.answer + 1 === r.userAnswer).length
              );
            }, 0);
            const totalCorrect =
              qResults.rows.reduce((acc, result) => {
                return acc + result.results.filter((r) => r.answer + 1 === r.userAnswer).length;
              }, 0) || 1;
            const easyPercent = easy / totalCorrect;
            const mediumPercent = medium / totalCorrect;
            const hardPercent = 1 - easyPercent - mediumPercent;
            const slices = [
              { percent: easyPercent, color: 'tomato' },
              { percent: mediumPercent, color: 'aqua' },
              { percent: hardPercent, color: 'forestgreen' },
            ];
            let cumulativePercent = 0;
            function getCoordinatesForPercent(percent: number) {
              const x = Math.cos(2 * Math.PI * percent);
              const y = Math.sin(2 * Math.PI * percent);
              return [x, y];
            }
            return slices.map((slice) => {
              const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
              cumulativePercent += slice.percent;
              const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
              return (
                <path
                  d={`M ${startX} ${startY} A 1 1 0 ${slice.percent > 0.5 ? 1 : 0} 1 ${endX} ${endY} L 0 0`}
                  fill={slice.color}
                  key={slice.color}
                />
              );
            });
          })()}
        </svg>
      </div>
    </div>
  );
}
