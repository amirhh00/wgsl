import { pool } from '@/lib/utils/db.mjs';
import Link from 'next/link';

function ScatterPlot({ data }: { data: { familiarityLevel: number; quizScore: number }[] }) {
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 350 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;

  const xMax = Math.max(...data.map((d) => d.familiarityLevel));
  const yMax = Math.max(...data.map((d) => d.quizScore));

  const xScale = (value: number) => (value / xMax) * width;
  const yScale = (value: number) => height - (value / yMax) * height;

  return (
    <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* X and Y axes */}
        <line x1={0} y1={height} x2={width} y2={height} stroke="currentColor" />
        <line x1={0} y1={0} x2={0} y2={height} stroke="currentColor" />

        {/* X and Y axis labels */}
        <text x={width / 2} y={height + margin.bottom - 10} textAnchor="middle" fill="currentColor">
          Familiarity Level
        </text>
        <text transform={`rotate(-90)`} x={-height / 2} y={-margin.left + 20} textAnchor="middle" fill="currentColor">
          Quiz Score
        </text>

        {/* Data points */}
        {data.map((d, i) => (
          <circle key={i} cx={xScale(d.familiarityLevel)} cy={yScale(d.quizScore)} r={5} fill="steelblue" />
        ))}
      </g>
    </svg>
  );
}

export default async function page() {
  const feedbacks = await pool.query<FeedBackResult>(
    'SELECT feedbacks.*, quiz_results.id AS quiz_result_id, quiz_results.score AS quiz_result_score FROM feedbacks LEFT JOIN quiz_results ON feedbacks.quiz_result_id = quiz_results.id ORDER BY feedbacks.created_at ASC'
  );
  const FamiliarityLevel = ['Not Familiar', 'Somewhat Familiar', 'Familiar', 'Very Familiar'] as const;

  const data = feedbacks.rows.map((feedback) => ({
    familiarityLevel: FamiliarityLevel.indexOf(
      feedback.questionnaire['shaderLanguages'] as (typeof FamiliarityLevel)[number]
    ),
    quizScore: feedback.quiz_result_score ?? 0,
  }));
  return (
    <div className="prose dark:prose-invert container max-w-lg py-3">
      <h1 className="text-center">Feedbacks</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th>feedback detail</th>
            <th>Quiz Result</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.rows.map((feedback) => (
            <tr key={feedback.id}>
              <td>
                <Link href={`/admin/feedbacks/${feedback.id}`}>View Feedback</Link>
              </td>
              <td>{feedback.quiz_result_score ?? '-'}</td>
              <td>{new Date(feedback.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-center">Familiarity Level vs Quiz Score</h2>
      <p>
        This scatter plot shows the relationship between familiarity level with GPU programming languages and quiz
        score.
      </p>
      <ScatterPlot data={data} />
    </div>
  );
}
