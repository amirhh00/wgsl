'use client';

import type { BuiltinLanguage, SpecialLanguage } from 'shiki';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

export function InlineCode(props: { code: string; className?: string }) {
  return (
    <code
      className={cn(
        "max-h-20 rounded-md border bg-b-700 px-1.5 py-0.5 text-[0.875em] before:content-[''] after:content-['']",
        props.className
      )}
      style={{
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
      }}
    >
      {props.code}
    </code>
  );
}

export function CodeBlock(props: {
  code: string;
  lang: BuiltinLanguage | SpecialLanguage;
  tokenLinks?: Map<string, string>;
}) {
  let code = props.code;
  let lang = props.lang;
  const tokenLinks = props.tokenLinks;

  return (
    <div className="group/code z-20 relative prose-none inline-block">
      <ScrollArea className="w-full">
        <div
          className="max-h-96 sxs:max-w-56 smd:max-w-96 relative font-mono text-sm before:content-[''] after:content-['']"
          lang={lang}
        >
          <RenderCode code={code} lang={lang} tokenLinks={tokenLinks} />
        </div>
      </ScrollArea>
    </div>
  );
}

export function RenderCode(props: {
  code: string;
  lang: BuiltinLanguage | SpecialLanguage;
  tokenLinks?: Map<string, string>;
}) {
  const [html, setHtml] = useState<string>('');
  const { resolvedTheme: theme } = useTheme();

  useEffect(() => {
    import('shiki').then(({ codeToHtml }) => {
      codeToHtml(props.code, {
        theme: theme === 'dark' ? 'dark-plus' : 'light-plus',
        lang: props.lang,
      }).then((html) => {
        setHtml(html);
      });
    });
  }, [props.code, props.lang]);

  return <span className="[&_pre]:mt-0" dangerouslySetInnerHTML={{ __html: html }} data-lang={props.lang}></span>;
}
