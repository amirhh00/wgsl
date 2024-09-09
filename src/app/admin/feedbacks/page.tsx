import { pool } from "@/lib/utils/db.mjs";

export default async function page() {
  const feedbacks = await pool.query<FeedBackResult>("SELECT * FROM feedbacks");
  return { feedbacks: feedbacks.rows };
}
