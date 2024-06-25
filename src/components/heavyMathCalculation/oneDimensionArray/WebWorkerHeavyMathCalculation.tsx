"use client";

import { FC, useEffect, useState } from "react";
import { ResultResponse } from "@/@types/etc";
import Spinner from "@/components/global/Spinner";
import { Button } from "@/components/ui/button";

interface IWebWorkerHeavyMathCalculationProps {
  vector1: Float32Array;
  vector2: Float32Array;
}

const WebWorkerHeavyMathCalculation: FC<IWebWorkerHeavyMathCalculationProps> = (props) => {
  const [res, setRes] = useState<ResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRes(null);
  }, [props.vector1, props.vector2]);

  return (
    <div className="w-full">
      <Button
        name="run-js"
        className="pl-7"
        onClick={() => {
          const worker = new Worker(new URL("@/app/showcases/heavyMathCalculation/worker/heavyMathCalculation.worker", import.meta.url));
          setIsLoading(true);
          worker.postMessage({ vector1: props.vector1, vector2: props.vector2 });
          worker.onmessage = (e) => {
            setRes(e.data);
            window.durations.js[props.vector1.length] = e.data.duration;
            setIsLoading(false);
          };
        }}
      >
        run in javaScript <Spinner isLoading={isLoading} />
      </Button>
      {res && (
        <pre data-length={props.vector1.length} data-type="js">
          Result:{" "}
          {Array.from(res.result.slice(0, 7))
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
