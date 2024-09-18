'use client';

import React, { useEffect } from 'react';
import { useChat } from 'ai/react';
import { MemoizedReactMarkdown } from './markdown';
import { CodeBlock, InlineCode } from '@/components/document/Code.client';
import { BuiltinLanguage } from 'shiki';

interface AiExplainProps {
  wholeCode?: string;
  selectedCode?: string;
}

export default function AiExplain(props: AiExplainProps) {
  const { messages, isLoading, stop, setInput, handleSubmit, input } = useChat();

  function setMessage(message: string) {
    if (!props.selectedCode || isLoading || !message) return;
    setInput(message);
  }

  useEffect(() => {
    const code = `explain ${props.selectedCode} in the following code: 
${props.wholeCode}`;

    setMessage(code);
  }, [props.selectedCode]);

  useEffect(() => {
    if (!input) return;
    handleSubmit();
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
        {messages
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
