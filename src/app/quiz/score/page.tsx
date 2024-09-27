import { quizLevels } from '@/app/quiz/[level]/questions';
import { cookies } from 'next/headers';
import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import FireWorks from './fireWorks';
import { pool } from '@/lib/utils/db.mjs';
import sql from 'sql-template-strings';
import AiQuizFeedback from '@/components/global/AiQuizFeedback';

export default async function QuizScore() {
  const quizId = cookies().get('quizId');
  const scoreCookie = cookies().get('score');
  if (!scoreCookie || !quizId) {
    return <p>You need to complete the quiz first</p>;
  }

  const quizResultQueryResposne = await pool.query<QuizResult>(
    sql`SELECT * FROM quiz_results WHERE id = ${quizId.value}`
  );
  const quizResult = quizResultQueryResposne.rows[0];
  if (!quizResult) {
    return <p>Quiz not found</p>;
  }
  const score = quizResult.score;
  const quizResults = quizResult.results;
  const quizFeedback = quizResult.aifeedback || undefined;

  return (
    <div className="prose dark:prose-invert">
      {score === quizLevels.length && <FireWorks />}

      <h1>Quiz Score</h1>
      <p>You have completed the quiz!</p>

      <p>
        Score: {Math.ceil(Number(score / quizLevels.length) * 100)}%
        <br />
      </p>
      <AiQuizFeedback quizResult={quizResult} score={score} quizFeedback={quizFeedback} />

      <h2>Results:</h2>
      <ul>
        {quizResults.map((quiz, index) => (
          <Fragment key={index}>
            <h3>Question: {quiz.question}</h3>
            <ul className="" key={index}>
              {quiz.options.map((option, index) => {
                const isItUsersAnswer = quiz.userAnswer === index + 1;
                const isAnswerCorrect = isItUsersAnswer && quiz.answer + 1 === quiz.userAnswer;

                return (
                  <li
                    className={cn(
                      ' relative',
                      isItUsersAnswer
                        ? isAnswerCorrect
                          ? "text-green-500 after:content-['✓'] after:absolute after:left-full after:top-0 after:ml-2"
                          : "text-red-500 after:content-['✗'] after:absolute after:left-full after:top-0 after:ml-2"
                        : quiz.answer === index && 'text-green-500'
                    )}
                    key={index}
                  >
                    <span className="text-current">{option}</span>
                  </li>
                );
              })}
            </ul>
          </Fragment>
        ))}
      </ul>
      <p>
        If you would like to submit a feedback for the website, please click <Link href="/feedback">here</Link>
      </p>
    </div>
  );
}
