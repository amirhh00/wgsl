import { quizLevels } from "@/app/quiz/[level]/questions";
import { cookies } from "next/headers";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import FireWorks from "./fireWorks";
import { pool } from "@/lib/utils/db.mjs";
import sql from "sql-template-strings";

export default async function QuizScore() {
  const quizId = cookies().get("quizId");
  if (!quizId) {
    return <p>You need to complete the quiz first</p>;
  }

  const quizResultQueryResposne = await pool.query<QuizResult>(sql`SELECT * FROM quiz_results WHERE id = ${quizId.value}`);
  const quizResult = quizResultQueryResposne.rows[0];
  if (!quizResult) {
    return <p>Quiz not found</p>;
  }
  const score = quizResult.score;
  const quizResults = quizResult.results;

  return (
    <div>
      {score === quizLevels.length && <FireWorks />}

      <h1>Quiz Score</h1>
      <p>Congratulations on completing the quiz!</p>

      <p>
        You scored {score} out of {quizLevels.length}
      </p>

      <h2>Results:</h2>
      <ul>
        {quizResults.map((quiz, index) => (
          <Fragment key={index}>
            <h3>Question: {quiz.question}</h3>
            <ul key={index}>
              {quiz.options.map((option, index) => {
                const isUserAnswerWrong = quiz.userAnswer === index + 1 && quiz.answer !== quiz.userAnswer;
                const isUserAnswerCorrect = quiz.userAnswer === index + 1 && quiz.answer === quiz.userAnswer;
                return (
                  <li
                    className={cn(
                      "w-min relative",
                      isUserAnswerWrong && "text-red-500 after:content-['✗'] after:absolute after:left-full after:top-0 after:ml-2",
                      isUserAnswerCorrect && "after:content-['✓'] after:absolute after:left-full after:top-0 after:ml-2",
                      quiz.answer === index + 1 && "text-green-500"
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
        if you would like to submit a feedback for the website, please click <Link href="/feedback">here</Link>
      </p>
    </div>
  );
}
