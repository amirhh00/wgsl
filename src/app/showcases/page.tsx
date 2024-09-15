import Link from "next/link";
import { FC } from "react";
import { Button } from "@/components/ui/button";

interface IShowCasesProps {
  // [key: string]: any;
}

const ShowCases: FC<IShowCasesProps> = (props) => {
  return (
    <div className="prose dark:prose-invert">
      <h1>showcases</h1>
      <ul>
        <li>
          <Link className="" href="/showcases/heavyMathCalculation">
            heavy math calculation
          </Link>
        </li>
        <li>
          <Link className="" href="/showcases/sum-array">
            sum array
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ShowCases;
