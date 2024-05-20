import Link from "next/link";
import { FC } from "react";
import { Button } from "@/components/ui/button";

interface IShowCasesProps {
  // [key: string]: any;
}

const ShowCases: FC<IShowCasesProps> = (props) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1>showcases</h1>
      <Button>
        <Link className="" href="/showcases/heavyMathCalculation">
          heavy math calculation
        </Link>
      </Button>
    </div>
  );
};

export default ShowCases;
