import { QuizLevel, quizLevels } from '@/app/quiz/[level]/questions';
import { cookies } from 'next/headers';
import { getQuizStatus } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { redirect, RedirectType } from 'next/navigation';
import CategoryFinishedModal from './CategoryFinishedModal';

export default async function Page({ params: { level } }: { params: { level: string | number } }) {
  if (!level) throw new Error('You need to start a quiz first');
  level = Number(level);
  if (level > quizLevels.length || level < 1) {
    // redirect to 404 page
    redirect('/404', RedirectType.replace);
  }
  const cookieStore = cookies();
  const answerCookie = cookieStore.get(`answer-${level}`);
  const quizStatus = await getQuizStatus();
  const quizFinished = quizStatus.every((status) => status.userAnswered);

  if (quizFinished) {
    redirect(`/quiz/score`, RedirectType.replace);
  }
  // if has an un-answered question and is on the last question, disable the button
  const shouldDisable =
    level === quizLevels.length && quizStatus.some((status, i) => !status.userAnswered && i + 1 !== level);

  return (
    <>
      <div className="prose dark:prose-invert">
        {answerCookie?.value && (
          <p className="text-xs">
            you already answered this question. you can change your answer before submitting the quiz.
          </p>
        )}
        <form method="POST" action="/api/quiz/[level]">
          <p className="font-semibold text-lg mb-1">
            {level}. {quizLevels[level - 1].question}
          </p>
          {quizLevels[level - 1].options.map((option, index) => {
            const shouldCheck = answerCookie?.value === (index + 1).toString();
            return (
              <div className="ml-5" key={index}>
                <label className="block">
                  <input
                    className="mr-2"
                    type="radio"
                    required
                    name="answer"
                    value={index + 1}
                    defaultChecked={shouldCheck}
                  />
                  {option}
                </label>
              </div>
            );
          })}
          <input type="hidden" name="level" value={level} />
          <button
            className={cn('button mt-2', shouldDisable && 'opacity-50 cursor-not-allowed')}
            type="submit"
            disabled={shouldDisable}
            title={
              shouldDisable
                ? 'You have to answer all questions before submitting the quiz'
                : level === quizLevels.length
                ? 'Submit Quiz'
                : 'Submit Answer'
            }
          >
            {level === quizLevels.length ? ' Submit Quiz' : 'Submit Answer'}
          </button>
        </form>
      </div>
    </>
  );
}
