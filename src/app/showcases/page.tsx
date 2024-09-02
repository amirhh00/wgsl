import Link from "next/link";
import { FC } from "react";
import { Button } from "@/components/ui/button";

interface IShowCasesProps {
  // [key: string]: any;
}

const ShowCases: FC<IShowCasesProps> = (props) => {
  return (
    <>
      <h1>showcases</h1>
      <Button>
        <Link className="" href="/showcases/heavyMathCalculation">
          heavy math calculation
        </Link>
      </Button>
    </>
  );
};

export default ShowCases;
