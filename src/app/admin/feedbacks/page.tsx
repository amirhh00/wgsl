import { pool } from '@/lib/utils/db.mjs';
import Link from 'next/link';

export default async function page() {
  const feedbacks = await pool.query<FeedBackResult>('SELECT * FROM feedbacks');
  return (
    <div className="prose dark:prose-invert container max-w-lg py-3">
      <h1 className="text-center">Feedbacks</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th>feedback detail</th>
            <th>Message</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.rows.map((feedback) => (
            <tr key={feedback.id}>
              <td>
                <Link href={`/admin/feedbacks/${feedback.id}`}>View Feedback</Link>
              </td>
              <td>{feedback.message}</td>
              <td>{new Date(feedback.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
