import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { pool } from '@/lib/utils/db.mjs';
import sql from 'sql-template-strings';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const body = await request.formData();
  const resultFeedback = body.get('resultFeedback');
  let quizId = cookieStore.get('quizId')?.value;
  if (resultFeedback) {
    // feedback from OpenAI, need to be saved in the database
    if (!quizId) throw new Error('You need to start a quiz first');
    await pool.query(sql`UPDATE quiz_results SET aiFeedback = ${resultFeedback} WHERE id = ${quizId}`);
    return new Response(null, {
      status: 200,
      statusText: 'OK',
    });
  }
}
