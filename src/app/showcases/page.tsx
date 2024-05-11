import Link from "next/link";
import { FC } from "react";

interface IShowCasesProps {
  // [key: string]: any;
}

const ShowCases: FC<IShowCasesProps> = (props) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1>showcases</h1>
      <Link className="btn outline p-3" href="/showcases/heavyMathCalculation">
        heavy math calculation
      </Link>
    </div>
  );
};

export default ShowCases;
