"use client";

import { FC, useState } from "react";
import { ResultResponse } from "@/@types/etc";
import Spinner from "./global/Spinner";

interface IWebWorkerHeavyMathCalculationProps {
  vector1: Float32Array;
  vector2: Float32Array;
}

const WebWorkerHeavyMathCalculation: FC<IWebWorkerHeavyMathCalculationProps> = (props) => {
  const [res, setRes] = useState<ResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="w-full">
      <button
        className="btn"
        onClick={() => {
          const worker = new Worker(new URL("@/app/showcases/heavyMathCalculation/worker/heavyMathCalculation.worker", import.meta.url));
          setIsLoading(true);
          worker.postMessage({ vector1: props.vector1, vector2: props.vector2 });
          worker.onmessage = (e) => {
            setRes(e.data);
            setIsLoading(false);
          };
        }}
      >
        JavaScript Merge <Spinner isLoading={isLoading} />
      </button>
      {res && (
        <pre>
          Result:{" "}
          {Array.from(res.result.slice(0, 10))
            .map((v) => v.toFixed(2))
            .join(", ")}{" "}
          <br />
          Duration: <b>{res.duration}</b>ms
        </pre>
      )}
    </div>
  );
};

export default WebWorkerHeavyMathCalculation;
