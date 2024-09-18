import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation.js';
import { quizLevels } from '@/app/quiz/[level]/questions';

export default async function Page() {
  const level = cookies().get('level');
  const quizId = cookies().get('quizId');

  return (
    <div className="prose dark:prose-invert">
      <h1>Quiz</h1>
      <p> Here you can test your knowledge of the webgpu shader language and concepts. </p>
      <h2>Instructions</h2>
      <ul>
        <li> Answer the questions to the best of your ability. </li>
        <li> You can skip questions and come back to them later. </li>
        <li> You can change your answers before submitting them. </li>
        <li>
          All questions are <b>multiple choice</b>.
        </li>
        <li> Your answers will be saved and you can continue the quiz at a later time. </li>
        <li> You can only submit your answers once. </li>

        <li>
          <b>Good luck!</b>
        </li>
      </ul>
      <div className="flex gap-4 items-end">
        {quizId ? (
          <p>
            You have completed the quiz! You can send your feedback using <Link href="/feedback">this</Link> link.
          </p>
        ) : (
          <>
            {level && (
              <>
                <div className="flex flex-col">
                  <p> You are currently on level {level?.value} </p>
                  <Link className="button" href={`/quiz/${Number(level?.value) + 1}`}>
                    Continue Quiz
                  </Link>
                </div>
                <span className="mb-2">or</span>
              </>
            )}
            <form
              action={async () => {
                'use server';
                // clear all related cookies to the quiz
                cookies().delete('level');
                for (let i = 1; i <= quizLevels.length; i++) {
                  if (!cookies().get(`answer-${i}`)) continue;
                  cookies().delete(`answer-${i}`);
                }
                redirect('/quiz/1');
              }}
            >
              {level?.value !== quizLevels.length.toString() && (
                <button type="submit" className="button">
                  Start a new Quiz
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
