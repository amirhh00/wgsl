import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { QuizLevel, quizLevels } from '@/app/quiz/[level]/questions';
import { pool } from '@/lib/utils/db.mjs';
import sql from 'sql-template-strings';

export type QuizResults = {
  userAnswer: number;
  question: string;
  options: string[];
  answer: number;
}[];

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  try {
    // get the answer and level from the request body form data
    const body = await request.formData();
    const answer: number | undefined = Number(body.get('answer'));
    const level = Number(body.get('level'));
    if (!level) throw new Error('You need to start a quiz first');
    let quizId = cookieStore.get('quizId')?.value;
    // if (!answer) throw new Error("You need to provide an answer");
    // if quizId cookie is not set, insert a new quiz record in the database and set the cookie
    if (!quizId) {
      const quizQuery = await pool.query<QuizResult>(sql`INSERT INTO quiz_results DEFAULT VALUES RETURNING id`);
      quizId = quizQuery.rows[0].id.toString();
      cookieStore.set('quizId', quizId, { httpOnly: true });
    }
    if (level > quizLevels.length || level < 1) throw new Error('level is out of range');
    // check if the answer is in range of the options
    if (answer) {
      if (quizLevels[level - 1].options.length < answer) {
        throw new Error('answer is out of range');
      }
      cookieStore.set(`answer-${level}`, answer.toString(), { httpOnly: true });
    }
    cookieStore.set('level', level.toString(), { httpOnly: true });
    const currentCategory = quizLevels[level - 1].difficulty;
    // check if the level is the last level of the quiz, if so return the score else redirect to the next level page
    if (level === quizLevels.length) {
      const quizResults = quizLevels.map((quiz, index) => {
        const answerCookie = cookieStore.get(`answer-${index + 1}`);
        if (!answerCookie?.value) throw new Error('You need to complete the quiz first');
        const userAnswer = Number(answerCookie.value);
        return { ...quiz, userAnswer };
      });
      const score = quizResults.reduce((acc, quiz) => {
        return quiz.answer + 1 === quiz.userAnswer ? acc + 1 : acc;
      }, 0);
      // update the quiz record in the database with the score and results
      await pool.query(
        sql`UPDATE quiz_results SET score = ${score}, results = ${JSON.stringify(quizResults)} WHERE id = ${quizId}`
      );
      // set score cookie
      cookieStore.set('score', score.toString(), { httpOnly: false });
      cookieStore.delete('level');
      for (let i = 1; i <= quizLevels.length; i++) {
        cookieStore.delete(`answer-${i}`);
      }
      return new Response(JSON.stringify({ message: 'You have completed the quiz' }), {
        status: 302,
        headers: {
          Location: '/quiz/score',
          'Content-Type': 'application/json',
        },
      });
    } else {
      const quizStatus = quizLevels.map((_quiz, index) => {
        const answerCookie = cookieStore.get(`answer-${index + 1}`);
        return { userAnswered: !!answerCookie?.value };
      });
      const groupedLevels = quizLevels.reduce((groups, level, i) => {
        const difficulty = level.difficulty;
        if (!groups[difficulty]) {
          groups[difficulty] = [];
        }
        level.userAnswered = quizStatus[i].userAnswered;
        level.id = i + 1;
        groups[difficulty].push(level);
        return groups;
      }, {} as Record<string, QuizLevel[]>);
      const quizResults = quizLevels.flatMap((quiz, index) => {
        const answerCookie = cookieStore.get(`answer-${index + 1}`);
        if (!answerCookie?.value) return [];
        const userAnswer = Number(answerCookie.value);
        return { ...quiz, userAnswer };
      });
      // update database with the current quiz status
      await pool.query(sql`UPDATE quiz_results SET results = ${JSON.stringify(quizResults)} WHERE id = ${quizId}`);

      for (const category in groupedLevels) {
        const allAnswered = groupedLevels[category].every((level) => level.userAnswered);
        const cookieName = `category-${category}-finished`;
        if (allAnswered && (!cookieStore.get(cookieName) || currentCategory === category)) {
          const scoreCategory = groupedLevels[category].reduce((acc, quiz) => {
            // calculate current index using category and quizLevels
            const i = quiz.id!;
            const answerCookie = cookieStore.get(`answer-${i}`);
            const correctAnswer = quizLevels[i - 1].answer;
            return correctAnswer + 1 === Number(answerCookie?.value) ? acc + 1 : acc;
          }, 0);
          cookieStore.set(cookieName, scoreCategory.toString(), { httpOnly: false });
        }
      }
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/quiz/${level + 1}`,
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
