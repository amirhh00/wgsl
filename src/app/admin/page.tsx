import { pool } from '@/lib/utils/db.mjs';
import Link from 'next/link';

type QuizResultJoinFeedback = QuizResult & { feedback_id: string };

export default async function Page() {
  const qResults = await pool.query<QuizResultJoinFeedback>(
    'SELECT qr.*, f.id AS feedback_id FROM quiz_results qr LEFT JOIN feedbacks f ON qr.id = f.quiz_result_id ORDER BY qr.created_at ASC'
  );

  const easy = qResults.rows.reduce((acc, result) => {
    return acc + result.results.filter((r) => r.difficulty === 'easy' && r.answer + 1 === r.userAnswer).length;
  }, 0);
  const medium = qResults.rows.reduce((acc, result) => {
    return acc + result.results.filter((r) => r.difficulty === 'medium' && r.answer + 1 === r.userAnswer).length;
  }, 0);
  const totalCorrect =
    qResults.rows.reduce((acc, result) => {
      return acc + result.results.filter((r) => r.answer + 1 === r.userAnswer).length;
    }, 0) || 1;
  const easyPercent = easy / totalCorrect;
  const mediumPercent = medium / totalCorrect;
  const hardPercent = 1 - easyPercent - mediumPercent;

  const e = `${(easyPercent * 100).toFixed(2)}%`;

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
              <td>
                <Link className="mx-2 text-sm text-blue-500" href={`/admin/quizzes/${result.id}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    className="w-4 h-4 text-current fill-current inline-flex"
                  >
                    <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                  </svg>
                </Link>
                {result.score}
              </td>
              <td>
                {result.feedback_id ? <Link href={`/admin/feedbacks/${result.feedback_id}`}>View Feedback</Link> : '-'}
              </td>
              <td>{new Date(result.created_at).toUTCString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        View all feedbacks <Link href="/admin/feedbacks">here</Link>
      </p>
      <div className="flex flex-col">
        <h2 className="text-center my-2">Distribution of Correct Answers by Difficulty Level Among All Users</h2>
        <div className="flex justify-center gap-4">
          <div className="flex justify-center items-center gap-2">
            <div className="bg-[tomato] w-5 aspect-square" />
            <div className="flex flex-col items-center justify-center">
              <p
                data-percent={`${(easyPercent * 100).toFixed(1)}%`}
                className={`relative after:content-[attr(data-percent)] after:text-xs after:opacity-90 after:-top-4 after:left-1/2 after:-translate-x-1/2 after:absolute`}
              >
                easy
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="bg-[aqua] w-5 aspect-square" />
            <div className="flex flex-col items-center justify-center">
              <p
                data-percent={`${(mediumPercent * 100).toFixed(1)}%`}
                className={`relative after:content-[attr(data-percent)] after:text-xs after:opacity-90 after:-top-4 after:left-1/2 after:-translate-x-1/2 after:absolute`}
              >
                medium
              </p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div className="bg-[forestgreen] w-5 aspect-square" />
              <div className="flex flex-col items-center justify-center">
                <p
                  data-percent={`${(hardPercent * 100).toFixed(1)}%`}
                  className={`relative after:content-[attr(data-percent)] after:text-xs after:opacity-90 after:-top-4 after:left-1/2 after:-translate-x-1/2 after:absolute`}
                >
                  hard
                </p>
              </div>
            </div>
          </div>
        </div>
        <svg viewBox="-1 -1 2 2" className="-rotate-90 max-w-xs mx-auto mb-6">
          {(() => {
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
