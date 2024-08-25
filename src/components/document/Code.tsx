import "server-only";

import { BuiltinLanguage, codeToTokens, SpecialLanguage, ThemedToken } from "shiki";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";

export async function CodeBlock(props: { code: string; lang: BuiltinLanguage | SpecialLanguage; tokenLinks?: Map<string, string> }) {
  let code = props.code;
  let lang = props.lang;
  const tokenLinks = props.tokenLinks;

  return (
    <div className="group/code relative prose-none inline-block">
      <code className="relative bg-code-bg inline-block font-mono text-sm before:content-[''] after:content-['']" lang={lang}>
        <ScrollArea className="w-min">
          <span>
            <RenderCode code={code} lang={lang} tokenLinks={tokenLinks} />
            <ScrollBar className="absolute top-0 right-0 h-full" />
          </span>
        </ScrollArea>
      </code>
    </div>
  );
}

export function InlineCode(props: { code: string; className?: string }) {
  return (
    <code
      className={cn("max-h-20 rounded-md border bg-b-700 px-1.5 py-0.5 text-[0.875em] before:content-[''] after:content-['']", props.className)}
      style={{
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {props.code}
    </code>
  );
}

async function RenderCode(props: { code: string; lang: BuiltinLanguage | SpecialLanguage; tokenLinks?: Map<string, string> }) {
  const { tokens } = await codeToTokens(props.code, {
    // theme: "github-dark",
    lang: props.lang,
    themes: {
      light: "github-light-default",
      dark: "dark-plus",
    },
  });

  const getThemeColors = (token: ThemedToken) => {
    const styleStr = token.htmlStyle;
    const [lightStyle, darkStyle] = styleStr?.split(";") || [];
    const lightColor = lightStyle?.split(":")[1];
    const darkColor = darkStyle?.split(":")[1];
    return {
      lightColor,
      darkColor,
    };
  };

  return (
    <div>
      <pre className="bg-inherit m-0 p-0" data-lang={props.lang}>
        {tokens.map((line, i) => {
          return (
            <div key={i}>
              {line.map((token, i) => {
                const { lightColor, darkColor } = getThemeColors(token);

                const style = {
                  "--code-light-color": lightColor,
                  "--code-dark-color": darkColor,
                } as React.CSSProperties;

                const href = props.tokenLinks && props.tokenLinks.has(token.content) ? props.tokenLinks.get(token.content) : undefined;

                if (href) {
                  return (
                    <Link key={i} href={href || "#"} className="group/codelink relative py-0.5" style={style}>
                      {/* Token */}
                      <span className="relative z-codeToken transition-colors duration-200 group-hover/codelink:text-b-900">{token.content}</span>
                      {/* Line */}
                      <span
                        className={cn(
                          "absolute bottom-0 left-0 right-0 z-codeTokenHighlight inline-block h-[3px] scale-105 translate-y-[2px]",
                          "rounded-sm bg-current opacity-20",
                          "transition-all duration-200 group-hover/codelink:opacity-100 group-hover/codelink:h-full group-hover/codelink:translate-y-0"
                        )}
                      />
                    </Link>
                  );
                }

                return (
                  <span key={i} style={style} data-token={token.content} className="text-[var(--code-light-color)] dark:text-[var(--code-dark-color)]">
                    {token.content}
                  </span>
                );
              })}

              {line.length === 0 && i !== tokens.length - 1 && " "}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
