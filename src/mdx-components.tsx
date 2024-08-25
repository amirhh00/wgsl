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
    a(props) {
      let { className, href, children, ...rest } = props;
      // @ts-expect-error
      const isFootNote = props["data-footnote-ref"] === true || typeof props["data-footnote-backref"] === "string";
      let footNoteClass = "";
      if (isFootNote) {
        footNoteClass = " footnote -mt-[var(--header-height)] pt-[var(--header-height)]";
      }
      if (!href) return <p>{children}</p>;
      return (
        <NextLink href={href} {...rest} className={`${className ?? ""}${footNoteClass}`}>
          {children}
        </NextLink>
      );
    },
    ...components,
  };
}
