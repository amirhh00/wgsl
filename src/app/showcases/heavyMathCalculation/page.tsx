import { FC } from "react";
import OneDimensionHeavyMathCalculation from "@/components/heavyMathCalculation/oneDimensionArray";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface IPageProps {
  // [key: string]: any;
}

const Page: FC<IPageProps> = (props) => {
  return (
    <div>
      <Breadcrumb>
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
      </Breadcrumb>
      <Tabs defaultValue="1D" className="w-full text-center">
        <TabsList className="my-4">
          <TabsTrigger value="1D">calculations on one-dimention arrays</TabsTrigger>
          <TabsTrigger value="matrix">calculations on matrix</TabsTrigger>
        </TabsList>
        <TabsContent value="1D">
          <OneDimensionHeavyMathCalculation />
        </TabsContent>
        <TabsContent value="matrix">matrix here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
