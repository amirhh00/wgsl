import sql from 'sql-template-strings';
import { pool } from '@/lib/utils/db.mjs';

// nextjs url: /admin/feedbacks/:fid/
export default async function Page({ params: { fid } }: { params: { fid: string } }) {
  const feedbackResultQuery = await pool.query<FeedBackResult>(sql`SELECT * FROM feedbacks WHERE id = ${fid}`);
  if (!feedbackResultQuery || !feedbackResultQuery.rows.length) {
    return (
      <div className="text-center">
        <h1>Feedback not found</h1>
      </div>
    );
  }
  const f = feedbackResultQuery.rows[0];
  return (
    <div className="container max-w-lg py-3 text-center">
      <h1>Feedback received on {f.created_at?.toUTCString()}</h1>
      <p>message: {f.message}</p>
      <p>email: {f.email || ''}</p>
      {f.questionnaire && (
        <div>
          {Object.entries(f.questionnaire).map(([key, value]) => (
            <p key={key}>
              {key}: {value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
