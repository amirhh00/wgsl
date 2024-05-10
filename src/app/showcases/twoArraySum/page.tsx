"use client";

import React, { Suspense } from "react";
import WasmMergeTwoArray from "@/components/WasmMergeTwoArray";
import WebWorkerMergeTwoArray from "@/components/WebWorkerMergeTwoArray";

interface ITwoArraySumPageProps {
  // [key: string]: any;
}

const TwoArraySumPage: React.FC<ITwoArraySumPageProps> = (props) => {
  const [vector1, setVector1] = React.useState<Int32Array | null>(null);
  const [vector2, setVector2] = React.useState<Int32Array | null>(null);
  const [Loading, setLoading] = React.useState(false);

  const handleGenerateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const digit = formData.get("digit") as string;
    const worker = new Worker(new URL("@/app/showcases/twoArraySum/worker/GenerateRandomNumbers.worker", import.meta.url));
    worker.postMessage({ digit });
    worker.onmessage = (e) => {
      const { vector1, vector2 } = e.data;
      setVector1(vector1);
      setVector2(vector2);
      setLoading(false);
    };
  };

  return (
    <>
      <div className="flex flex-col max-w-lg">
        <form className="flex w-full items-center" onSubmit={handleGenerateSubmit}>
          <button type="submit" className="btn flex gap-4 justify-center text-center w-full p-3 bg-blue-700 my-3 text-white rounded-md">
            Generate Random Vectors {Loading && <Spinner />}
          </button>
          <input type="number" name="digit" className="input p-3 -ml-1 text-black max-w-[150px]" defaultValue={10} placeholder="number of digits" />
        </form>

        {vector1 && vector2 && (
          <pre className="mb-6">
            {`Vector1: ${Array.from(vector1.slice(0, 10)).join(", ")}${vector1.length > 10 ? "..." : ""} \n`}
            {`Vector2: ${Array.from(vector2.slice(0, 10)).join(", ")}${vector2.length > 10 ? "..." : ""}`}
          </pre>
        )}
        {!vector1 || !vector2 ? (
          <div className="h-[48px] mb-6">
            <p>Click the button to generate random vectors</p>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-10">
        <div>
          <p>WebAssembly: Merge Two Array</p>

          <Suspense fallback={<div>Loading...</div>}>{/* <WasmMergeTwoArray vector1={Vector1} vector2={Vector2} /> */}</Suspense>
        </div>
        <div>
          <p>JavaScript: Merge Two Array</p>
          {vector1 && vector2 && <WebWorkerMergeTwoArray vector1={vector1} vector2={vector2} />}
        </div>
      </div>
    </>
  );
};

function Spinner() {
  return (
    <div role="status" className="inline">
      <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default TwoArraySumPage;
