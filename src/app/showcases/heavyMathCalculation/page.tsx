import { FC } from "react";
import OneDimensionHeavyMathCalculation from "@/components/heavyMathCalculation/oneDimensionArray";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

interface IPageProps {
  // [key: string]: any;
}

const Page: FC<IPageProps> = (props) => {
  return (
    <div className="container mx-auto prose dark:prose-invert mb-6">
      {/* <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/showcases">showcases</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Heavy Math Calculation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb> */}
      <h1 className="text-center">Heavy Math Calculation</h1>
      <sup className="text-center block mb-4 leading-4">
        You can see the performance difference between JavaScript, WebAssembly and WebGPU in heavy math calculations on a graph on
        <Link className="mx-1" target="_blank" href="/benchmark.html">
          this
        </Link>
        page.
      </sup>
      <Tabs defaultValue="1D" className="w-full text-center">
        <TabsList className="my-4">
          <TabsTrigger value="1D">calculations on one-dimention arrays</TabsTrigger>
          <TabsTrigger value="matrix">matrix multiplication</TabsTrigger>
        </TabsList>
        <TabsContent value="1D">
          <OneDimensionHeavyMathCalculation />
        </TabsContent>
        <TabsContent value="matrix">not implemented yet</TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
