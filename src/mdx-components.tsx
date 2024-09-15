import type { MDXComponents } from "mdx/types";
import NextLink from "next/link";
import { TBody, Table, Td, Th, Tr } from "@/components/document/Table";
import { CodeBlock, InlineCode } from "@/components/document/Code";
import type { BuiltinLanguage } from "shiki";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    code(props) {
      const code = props.children;
      const lang = props.className?.replace("language-", "");
      if (!props.className) {
        return <InlineCode code={typeof code === "string" ? code : ""} />;
      }

      return <CodeBlock lang={lang as BuiltinLanguage} code={typeof code === "string" ? code : ""} />;
    },
    table(props) {
      return <Table>{props.children}</Table>;
    },
    th(props) {
      return <Th>{props.children}</Th>;
    },
    td(props) {
      return <Td>{props.children}</Td>;
    },
    tr(props) {
      return <Tr>{props.children}</Tr>;
    },
    tbody(props) {
      return <TBody>{props.children}</TBody>;
    },
    pre(props) {
      return <>{props.children}</>;
    },
    img(props) {
      return (
        <figure>
          <img className="mx-auto text-center" {...props} />
          {props.alt && <figcaption className="text-center text-sm text-gray-500">{props.alt}</figcaption>}
        </figure>
      );
    },
    p(props) {
      // if there is an img in the paragraph children, don't wrap it with p tag in ssr mode
      if (props.children && (props.children as any)?.type?.name && (props.children as any).type?.name === "img") {
        return <>{props.children}</>;
      }
      return <p>{props.children}</p>;
    },
    a(props) {
      let { className, href, children, ...rest } = props;
      // @ts-expect-error
      const isFootNote = props["data-footnote-ref"] === true || typeof props["data-footnote-backref"] === "string";
      let footNoteClass = "";
      if (isFootNote) {
        footNoteClass = " footnote -mt-[calc(var(--header-height)_+_5px)] pt-[calc(var(--header-height)_+_5px)] [--outColor:transparent] focus:[--outColor:white]";
      }
      if (!href) return <p>{children}</p>;
      return (
        <NextLink href={href} {...rest} className={`${className ?? ""}${footNoteClass} break-words`}>
          <span className="text-white outline-2 outline-dashed outline-[var(--outColor,transparent)]">{children}</span>
        </NextLink>
      );
    },
    // h1(props) {
    //   return (
    //     <div>
    //       <h1 {...props}>{props.children}</h1>
    //     </div>
    //   );
    // },
    h2(props) {
      return (
        <div className="relative group">
          <h2 {...props}>{props.children}</h2>
          <HeadingAnchore {...props} />
        </div>
      );
    },
    h3(props) {
      return (
        <div className="relative group">
          <h3 {...props}>{props.children}</h3>
          <HeadingAnchore {...props} />
        </div>
      );
    },
    h4(props) {
      return (
        <div className="relative group">
          <h4 {...props}>{props.children}</h4>
          <HeadingAnchore {...props} />
        </div>
      );
    },
    h5(props) {
      return (
        <div className="relative group">
          <h5 {...props}>{props.children}</h5>
          <HeadingAnchore {...props} />
        </div>
      );
    },
    h6(props) {
      return (
        <div className="relative group">
          <h6 {...props}>{props.children}</h6>
          <HeadingAnchore {...props} />
        </div>
      );
    },
    ...components,
  };
}

function HeadingAnchore(props: { children?: any; [key: string]: any }) {
  return typeof props.children === "string" ? (
    <a
      id={props.children.toLowerCase().replace(/ /g, "-")}
      aria-label={`Permalink: ${props.children}`}
      href={`#${props.children.toLowerCase().replace(/ /g, "-")}`}
      className="
        text-sm
        [.footnotes_&]:hidden
        -mt-[var(--header-height)]
        pt-[var(--header-height)]
        anchor
        h-[200%]
        text-gray-500
        absolute
        -left-6
        w-6
        top-0
        flex
        justify-start
        items-center
        opacity-0
        transition-opacity
        overflow-visible
        group-hover:opacity-100"
    >
      <svg className="fill-current" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
        <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>
      </svg>
    </a>
  ) : null;
}
