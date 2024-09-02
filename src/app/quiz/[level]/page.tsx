import { quizLevels } from "@/app/quiz/[level]/questions";
import { cookies } from "next/headers";
import { getQuizStatus } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default async function Page({ params: { level } }: { params: { level: string | number } }) {
  if (!level) throw new Error("You need to start a quiz first");
  level = Number(level);
  if (level > quizLevels.length || level < 1) throw new Error("level is out of range");
  const cookieStore = cookies();
  const answerCookie = cookieStore.get(`answer-${level}`);
  const quizStatus = await getQuizStatus();
  // if has an un-answered question and is on the last question, disable the button
  const shouldDisable = level === quizLevels.length && quizStatus.some((status, i) => !status.userAnswered && i + 1 !== level);

  return (
    <div>
      <h1>Question: {level}</h1>
      {answerCookie?.value && <p className="text-sm">you already answered this question. you can change your answer before submitting it.</p>}
      <form method="POST" action="/api/quiz/[level]">
        <p>{quizLevels[level - 1].question}</p>
        {quizLevels[level - 1].options.map((option, index) => {
          const shouldCheck = answerCookie?.value === (index + 1).toString();
          return (
            <div key={index}>
              <input type="radio" required={level === quizLevels.length} name="answer" value={index + 1} defaultChecked={shouldCheck} />
              <label>{option}</label>
            </div>
          );
        })}
        <input type="hidden" name="level" value={level} />
        <button
          className={cn("button", shouldDisable && "opacity-50 cursor-not-allowed")}
          type="submit"
          disabled={shouldDisable}
          title={shouldDisable ? "You have to answer all questions before submitting the quiz" : level === quizLevels.length ? "Submit Quiz" : "Next Question"}
        >
          {level === quizLevels.length ? " Submit Quiz" : "Next Question"}
        </button>
      </form>
    </div>
  );
}
