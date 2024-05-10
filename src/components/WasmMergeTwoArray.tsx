"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// import styles from "../styles/styles.module.css";

interface VectorMultProps {
  vector1: Int32Array;
  vector2: Int32Array;
}

function allocateSpaceForVector(vector: Int32Array, memory: WebAssembly.Memory): number {
  const ptr = memory.buffer.byteLength;
  const requiredSpace = vector.length * vector.BYTES_PER_ELEMENT;
  memory.grow(Math.ceil(requiredSpace / 65536)); // Grow memory by necessary number of pages
  const view = new Int32Array(memory.buffer, ptr, vector.length);
  view.set(vector);
  return ptr;
}

const WasmVectorMultComponent = ({ vector1, vector2 }: VectorMultProps) => {
  const [mult_two, setMultTwo] = useState<Function | null>(null);
  // const [get_result_len, setGetResultLen] = useState<Function | null>(null);
  const [memory, setMemory] = useState<WebAssembly.Memory | null>(null);

  useEffect(() => {
    const loadWasm = async () => {
      const wasmModule = await import("@/app/showcases/twoArraySum/wasm/pkg/mergearray_bg.wasm");
      setMultTwo(() => wasmModule.add_arrays);
      // setGetResultLen(() => wasmModule.get_result_len);
      setMemory(() => wasmModule.memory);
    };

    loadWasm();
  }, []);

  const [resultVector, setResultVector] = useState<Int32Array | null>(null);
  useEffect(() => {
    if (mult_two && memory) {
      const ptr1 = allocateSpaceForVector(vector1, memory);
      const ptr2 = allocateSpaceForVector(vector2, memory);

      const resultPtr = mult_two(ptr1, vector1.length, ptr2, vector2.length);
      // const resultLen = get_result_len();
      const resultVector = new Int32Array(memory.buffer, resultPtr);
      setResultVector(resultVector);
    }
  }, [mult_two, memory, vector1, vector2]);

  return (
    <div>
      <h1>Vector Result</h1>
      {resultVector ? Array.from(resultVector).map((value: number, index: number) => <div key={index}>{value}</div>) : "Loading..."}
    </div>
  );
};

const WasmVectorMult = dynamic(() => Promise.resolve(WasmVectorMultComponent), {
  // Ensure only client-side execution:
  ssr: false,
});

export default WasmVectorMult;
