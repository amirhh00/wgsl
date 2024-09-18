'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { QuizLevel } from './questions';
import { cookieHandlerClient } from '@/lib/utils/cookieHandler.client';

type QuizLevelLocal = QuizLevel & { userAnswered: boolean };
type QuizCategory = QuizLevel['difficulty'];

interface CategoryFinishedModalProps {
  quizLevels: QuizLevelLocal[];
}

export default function CategoryFinishedModal(props: CategoryFinishedModalProps) {
  const pathname = usePathname();
  const [finishedCategory, setFinishedCategory] = useState<QuizCategory>();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [score, setScore] = useState<number>();

  useEffect(() => {
    const allCategories = props.quizLevels.map((level) => level.difficulty);
    for (const category of allCategories) {
      const cookieName = `category-${category}-finished`;
      const score = cookieHandlerClient(cookieName);
      if (typeof score === 'string' && score !== 'showed') {
        // show modal
        setFinishedCategory(category);
        setScore(Number(score));
        modalRef.current?.showModal();
        cookieHandlerClient(cookieName, 'showed', { path: '/' });
      }
    }
  }, [pathname]);

  return (
    <dialog
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.currentTarget.close();
        }
      }}
      ref={modalRef}
      className="fixed top-0 bg-secondary backdrop:bg-black/45"
    >
      <div className="dialog-content prose dark:prose-invert p-4">
        <h2 className="text-2xl font-bold">Congratulations!</h2>
        <p>
          You have finished all {finishedCategory} questions with a score of{' '}
          {score
            ? (
                (score / props.quizLevels.filter((level) => level.difficulty === finishedCategory).length) *
                100
              ).toFixed(2)
            : NaN}
          %.
        </p>
        <button
          onClick={() => {
            modalRef.current?.close();
          }}
          className="button mt-4 outline outline-1 outline-primary m-1"
        >
          Close
        </button>
      </div>
    </dialog>
  );
}
