"use client";

import React, { Suspense } from "react";
import WebWorkerHeavyMathCalculation from "@/components/WebWorkerHeavyMathCalculation";
import WebGPUCanvas from "@/components/WgslHeavyMathCalculation";
import Spinner from "@/components/global/Spinner";
import WasmHeavyMathCalculation from "@/components/WasmHeavyMathCalculation";

const HeavyMathCalculation = (props: any) => {
  const [vector1, setVector1] = React.useState<Float32Array | null>(null);
  const [vector2, setVector2] = React.useState<Float32Array | null>(null);
  const [isLoading, setLoading] = React.useState(false);

  const handleGenerateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const digit = formData.get("digit") as string;
    const worker = new Worker(new URL("@/app/showcases/heavyMathCalculation/worker/GenerateRandomNumbers.worker", import.meta.url));
    worker.postMessage({ digit });
    worker.onmessage = (e) => {
      const { vector1, vector2 } = e.data;
      setVector1(vector1);
      setVector2(vector2);
      setLoading(false);
    };
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex flex-col ">
        <form className="flex w-full items-center" onSubmit={handleGenerateSubmit}>
          <button type="submit" className="btn ">
            Generate Random Vectors <Spinner isLoading={isLoading} />
          </button>
          <input type="number" autoFocus name="digit" className="input p-3 -ml-1 text-black max-w-[150px]" defaultValue={10} placeholder="number of digits" />
        </form>

        {vector1 && vector2 && (
          <pre className="mb-6">
            {`Vector1: ${Array.from(vector1.slice(0, 10))
              .map((v) => v.toFixed(2))
              .join(", ")}${vector1.length > 10 ? "..." : ""} \n`}
            {`Vector2: ${Array.from(vector2.slice(0, 10))
              .map((v) => v.toFixed(2))
              .join(", ")}${vector2.length > 10 ? "..." : ""}`}
          </pre>
        )}
        {!vector1 || !vector2 ? (
          <div className="h-[48px] mb-6">
            <p>Click the button to generate random vectors</p>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-10 items-center">
        <div className="flex flex-col gap-4 items-center w-full">
          <p>WebAssembly: heavy Math Calculation</p>
          {vector1 && vector2 && <WasmHeavyMathCalculation vector1={vector1} vector2={vector2} />}
        </div>
        <div className="flex flex-col gap-4 items-center w-full">
          <p>JavaScript: heavy Math Calculation</p>
          {vector1 && vector2 && <WebWorkerHeavyMathCalculation vector1={vector1} vector2={vector2} />}
        </div>
        <div className="flex flex-col gap-4 w-full">
          <p className="text-center">WGSL: heavy Math Calculation</p>
          {vector1 && vector2 && <WebGPUCanvas vector1={vector1} vector2={vector2} />}
        </div>
      </div>
    </div>
  );
};

export default HeavyMathCalculation;
