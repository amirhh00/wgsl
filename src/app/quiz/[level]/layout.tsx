import { getQuizStatus } from "@/lib/utils";
import Link from "next/link";

export default async function QuizLayout({ children }: { children: React.ReactNode }) {
  const quizStatus = await getQuizStatus();

  return (
    <>
      <div className="quiz-status flex gap-1">
        Questions status:
        {quizStatus.map((status, index) => (
          <div key={index} className="flex items-center gap-1">
            <Link
              key={index}
              href={`/quiz/${index + 1}`}
              style={{ "--before-content": `'${index + 1}'` } as React.CSSProperties}
              className={`w-4 h-4 rounded-full relative before:absolute before:content-[var(--before-content)] before:bottom-full before:left-1/2 before:-translate-x-1/2 before:text-[10px] before:w-full before:text-center
                 ${
                   status.userAnswered
                     ? "after:content-[''] after:scale-105 after:bg-black after:w-full after:h-full after:rounded-full after:absolute after:top-1/2 bg-gray-300 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
                     : "bg-gray-300"
                 }`}
            />
            {index + 1 === quizStatus.length ? null : "-"}
          </div>
        ))}
      </div>
      {children}
    </>
  );
}
