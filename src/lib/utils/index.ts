import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type QuizStatus = {
  userAnswered: boolean;
}[];

export async function getQuizStatus(): Promise<QuizStatus> {
  const cookies = (await import('next/headers')).cookies;
  const quizLevels = (await import('@/app/quiz/[level]/questions')).quizLevels;
  const cookieStore = cookies();
  return quizLevels.map((_quiz, index) => {
    const answerCookie = cookieStore.get(`answer-${index + 1}`);
    return { userAnswered: !!answerCookie?.value };
  });
}
