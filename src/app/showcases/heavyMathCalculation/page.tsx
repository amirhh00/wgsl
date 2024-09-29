import { FC } from 'react';
import OneDimensionHeavyMathCalculation from '@/components/heavyMathCalculation/oneDimensionArray';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from 'next/link';

interface IPageProps {
  // [key: string]: any;
}

const Page: FC<IPageProps> = (props) => {
  return (
    <div className="container mx-auto prose dark:prose-invert mb-6">
      <h1 className="text-center">Heavy Math Calculation</h1>
      <sup className="text-center block mb-4 leading-4">
        You can see the performance difference between JavaScript, WebAssembly and WebGPU in heavy math calculations on
        a graph on
        <Link className="mx-1" target="_blank" href="/benchmark.html">
          this
        </Link>
        page.
      </sup>
      <OneDimensionHeavyMathCalculation />
    </div>
  );
};

export default Page;
