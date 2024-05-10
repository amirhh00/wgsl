"use client";

import { FC, useState } from "react";

interface IWebWorkerMergeTwoArrayProps {
  vector1: Int32Array;
  vector2: Int32Array;
}

type WorkerResponse = {
  result: Int32Array;
  duration: number;
};

const WebWorkerMergeTwoArray: FC<IWebWorkerMergeTwoArrayProps> = (props) => {
  const [res, setRes] = useState<WorkerResponse | null>(null);
  return (
    <div>
      <button
        className="btn text-center w-full max-w-lg p-3 bg-blue-700 my-3 text-white rounded-md"
        onClick={() => {
          const worker = new Worker(new URL("@/app/showcases/twoArraySum/worker/mergeArray.worker", import.meta.url));
          worker.postMessage({ vector1: props.vector1, vector2: props.vector2 });
          worker.onmessage = (e) => {
            setRes(e.data);
          };
        }}
      >
        JavaScript Merge
      </button>
      {res && (
        <pre>
          {/* only show first 10, and if more, show first 10 and ... */}
          {`Result: ${Array.from(res.result.slice(0, 10)).join(", ")}${res.result.length > 10 ? "..." : ""} \n`}
          {`Duration: ${res.duration}ms`}
        </pre>
      )}
    </div>
  );
};

export default WebWorkerMergeTwoArray;
