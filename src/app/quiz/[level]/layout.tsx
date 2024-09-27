import { getQuizStatus } from '@/lib/utils';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { headers } from 'next/headers';
import { Badge } from '@/components/ui/badge';
import { quizLevels } from './questions';
import CategoryFinishedModal from './CategoryFinishedModal';

interface QuizLayoutProps {
  children: React.ReactNode;
}

export default async function QuizLayout(props: QuizLayoutProps) {
  const quizStatus = await getQuizStatus();
  // get pathname from headers
  const pathname = headers().get('x-current-path');
  // get the level from the pathname
  const level = pathname?.split('/')[2];
  const currentQuiz = quizLevels[Number(level) - 1];

  return (
    <>
      <ScrollArea>
        <div className="quiz-status w-full flex gap-1 min-h-max">
          {quizStatus.map((status, index) => {
            const isCurrent = index + 1 === Number(level);
            const thisQuiz = quizLevels[index];
            return (
              <div key={index} className="flex items-center gap-1 pt-4 pb-3 px-1 ">
                <Link
                  key={index}
                  href={`/quiz/${index + 1}`}
                  title={`Go to ${thisQuiz.difficulty} question number ${index + 1}`}
                  style={
                    {
                      '--before-content': `'${index + 1}'`,
                      '--outline-c': isCurrent ? 'currentColor' : 'transparent',
                      backgroundColor: `hsl(var(--bg-${thisQuiz.difficulty}))`,
                    } as React.CSSProperties
                  }
                  className={`w-4 h-4 p-1 not-prose outline outline-1 outline-[var(--outline-c)] rounded-full relative before:absolute before:content-[var(--before-content)] before:bottom-full before:left-1/2 before:-translate-x-1/2 before:text-[10px] before:w-full before:text-center`}
                >
                  {status.userAnswered && (
                    <span className="absolute top-0 left-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <line x1="24" y1="2" x2="0" y2="22" strokeWidth="2" />
                      </svg>
                    </span>
                  )}
                </Link>
                {index + 1 === quizStatus.length ? null : <span className="ml-2">-</span>}
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Badge style={{ backgroundColor: `hsl(var(--bg-${currentQuiz.difficulty}))` }} className={`capitalize`}>
        {currentQuiz.difficulty}
      </Badge>
      {props.children}
      {/* <CategoryFinishedModal
        quizLevels={quizLevels.map((level, i) => ({ ...level, answer: NaN, userAnswered: quizStatus[i].userAnswered }))}
      /> */}
    </>
  );
}
