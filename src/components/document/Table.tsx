import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";

export function Table(props: { children: React.ReactNode }) {
  return (
    <ScrollArea className="rounded-lg whitespace-nowrap">
      <div className="flex w-max">
        <table className="min-w-full my-0 border-collapse text-sm [&_tr:last-of-type]:border-none">{props.children}</table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export const Tr: React.FC<React.HTMLProps<HTMLTableRowElement>> = (props) => {
  const { children, ...rest } = props;
  return (
    <tr {...rest} className="border-b text-left font-medium text-f-200">
      {children}
    </tr>
  );
};

export function TBody(props: { children: React.ReactNode }) {
  return <tbody className="w-full rounded-lg ">{props.children}</tbody>;
}

export function Th(props: { children: React.ReactNode }) {
  return <th className="border-b bg-b-700 p-4 pb-3 pl-8 text-left text-base font-semibold text-f-100 first:pl-0">{props.children}</th>;
}

export function Td(props: { children: React.ReactNode }) {
  return <td className="w-min p-4 pl-8 text-base leading-relaxed text-f-200 first:pl-0">{props.children}</td>;
}
