import sql from 'sql-template-strings';
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// create schema if not exists
const queries = [
  sql`CREATE TABLE IF NOT EXISTS users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  password TEXT,
 
  PRIMARY KEY (id)
);`,

  sql`CREATE TABLE IF NOT EXISTS sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
 
  PRIMARY KEY (id)
);`,

  sql`CREATE TABLE IF NOT EXISTS accounts
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
 
  PRIMARY KEY (id)
);`,

  sql`CREATE TABLE IF NOT EXISTS verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
 
  PRIMARY KEY (identifier, token)
);`,

  // table for storing user quiz results. it's ananymous and not linked to user. here we store the score and result as json
  sql`CREATE TABLE IF NOT EXISTS quiz_results
(
  id uuid DEFAULT uuid_generate_v4(),
  score INTEGER NOT NULL DEFAULT -1,
  results JSON NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  aiFeedback TEXT NULL DEFAULT NULL,
 
  PRIMARY KEY (id)
);`,

  // table for storing user feedbacks
  sql`CREATE TABLE IF NOT EXISTS feedbacks
(
  id uuid DEFAULT uuid_generate_v4(),
  email VARCHAR(255),
  message TEXT,
  questionnaire JSON,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  quiz_result_id uuid NULL,

  PRIMARY KEY (id),
  Foreign Key (quiz_result_id) REFERENCES quiz_results(id)
);`,
];

// run all queries in parallel and wait for all to complete before continuing with the rest of the code
export async function createSchema() {
  console.log('making schema if not exist');
  await pool.query(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  await Promise.all(queries.map((query) => pool.query(query)));
}

export const getUserFromDb = async (email, password) => {
  const { rows } = await pool.query(sql`
    SELECT * FROM users WHERE email = ${email} AND password = ${password}
  `);

  return rows[0];
};
