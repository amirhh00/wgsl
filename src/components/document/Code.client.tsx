"use client";

import type { BuiltinLanguage, SpecialLanguage } from "shiki";

import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

export function CodeBlock(props: { code: string; lang: BuiltinLanguage | SpecialLanguage; tokenLinks?: Map<string, string> }) {
  let code = props.code;
  let lang = props.lang;
  const tokenLinks = props.tokenLinks;

  return (
    <div className="group/code z-20 relative prose-none inline-block">
      <ScrollArea className="w-full">
        <div className="max-h-96 sxs:max-w-56 smd:max-w-96 relative font-mono text-sm before:content-[''] after:content-['']" lang={lang}>
          <RenderCode code={code} lang={lang} tokenLinks={tokenLinks} />
        </div>
      </ScrollArea>
    </div>
  );
}

function RenderCode(props: { code: string; lang: BuiltinLanguage | SpecialLanguage; tokenLinks?: Map<string, string> }) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    import("shiki").then(({ codeToHtml }) => {
      codeToHtml(props.code, {
        theme: "dark-plus",
        lang: props.lang,
      }).then((html) => {
        setHtml(html);
      });
    });
  }, [props.code, props.lang]);

  return <span className="[&_pre]:mt-0" dangerouslySetInnerHTML={{ __html: html }} data-lang={props.lang}></span>;
}
