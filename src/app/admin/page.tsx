import { pool } from "@/lib/utils/db.mjs";

export default async function Page() {
  const qResults = await pool.query<QuizResult>("SELECT * FROM quiz_results");
  return (
    <div className="flex flex-col prose dark:prose-invert flex-1 justify-center">
      <h1 className="text-center">quiz results go here</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th>id</th>
            <th>score</th>
            <th>created_at</th>
          </tr>
        </thead>
        <tbody>
          {qResults.rows.map((result) => (
            <tr key={result.id}>
              <td>{result.id}</td>
              <td>{result.score}</td>
              <td>{new Date(result.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
