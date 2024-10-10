'use client';

import React, { useEffect } from 'react';
import { useChat } from 'ai/react';
import { MemoizedReactMarkdown } from './markdown';
import { CodeBlock, InlineCode } from '@/components/document/Code.client';
import { BuiltinLanguage } from 'shiki';

interface AiQuizFeedbackProps {
  score: number;
  quizResult: QuizResult;
  quizFeedback?: string;
}

export default function AiQuizFeedback(props: AiQuizFeedbackProps) {
  const { messages, isLoading, stop, setInput, handleSubmit, input } = useChat({
    api: '/api/chat/quiz',
    onFinish(message, options) {
      const formData = new FormData();
      formData.append('resultFeedback', message.content);
      fetch('/api/quiz', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
    },
  });

  function setMessage(message: string) {
    if (!props.quizResult || isLoading || !message) return;
    setInput(message);
  }

  useEffect(() => {
    let msg = `give feedback on below quiz results, I scored ${props.score} out of ${props.quizResult.results.length} questions
`;
    for (const quiz of props.quizResult.results) {
      msg += `
${quiz.question}:
correct answer: ${quiz.options[quiz.answer]}
my answer: ${quiz.options[quiz.userAnswer! - 1]}

      `;
    }
    setMessage(msg);
  }, [props.quizResult]);

  useEffect(() => {
    if (!input) return;
    if (!props.quizFeedback) {
      handleSubmit();
    }
  }, [input]);

  return (
    <>
      <MemoizedReactMarkdown
        className="break-words text-sm"
        components={{
          p({ children }: any) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
          code(props) {
            const code = props.children;
            const lang = props.className?.replace('language-', '');
            if (!props.className) {
              return <InlineCode code={typeof code === 'string' ? code : ''} />;
            }

            return <CodeBlock lang={lang as BuiltinLanguage} code={typeof code === 'string' ? code : ''} />;
          },
        }}
      >
        {props.quizFeedback ??
          messages
            .filter((msg) => msg.role === 'assistant')
            .map((message) => message.content)
            .join('\n')}
      </MemoizedReactMarkdown>

      {isLoading && (
        <button className="w-10 h-10 p-2 float-end z-50" title="Stop AI" onClick={() => stop()}>
          <svg className="w-full h-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm192-96l128 0c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-128 0c-17.7 0-32-14.3-32-32l0-128c0-17.7 14.3-32 32-32z" />{' '}
          </svg>
        </button>
      )}
    </>
  );
}
