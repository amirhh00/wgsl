"use client";

import { useState } from "react";
import Spinner from "@/components/global/Spinner";
import { ResultResponse } from "@/@types/etc";
import wasmModulePromis from "@/app/showcases/heavyMathCalculation/wasm/pkg/heavycalculation";
import { Button } from "@/components/ui/button";

interface VectorMultProps {
  vector1: Float32Array | null;
  vector2: Float32Array | null;
}

function allocateSpaceForVector(vector: Float32Array, memory: WebAssembly.Memory): number {
  const ptr = memory.buffer.byteLength;
  const requiredSpace = vector.length * vector.BYTES_PER_ELEMENT;
  memory.grow(Math.ceil(requiredSpace / 65536)); // Grow memory by necessary number of pages
  const view = new Float32Array(memory.buffer, ptr, vector.length);
  view.set(vector);
  return ptr;
}

const WasmHeavyMathCalculationComponent = ({ vector1, vector2 }: VectorMultProps) => {
  const [res, setRes] = useState<ResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadWasm = async () => {
    if (vector1 && vector2) {
      setIsLoading(true);
      // const wasmModule = await import("@/app/showcases/heavyMathCalculation/wasm/pkg/heavycalculation_bg.wasm");
      const wasmModule = await wasmModulePromis();
      const startTime = performance.now();
      const resultPtr = wasmModule.heavy_math(
        allocateSpaceForVector(vector1, wasmModule.memory),
        vector1.length,
        allocateSpaceForVector(vector2, wasmModule.memory),
        vector2.length
      );
      const endTime = performance.now();
      const duration = endTime - startTime;
      const resultVector = new Float32Array(wasmModule.memory.buffer, resultPtr!);
      setRes({
        result: resultVector,
        duration,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button className="pl-7" onClick={loadWasm}>
        run in WebAssembly <Spinner isLoading={isLoading} />
      </Button>
      {res && (
        <pre>
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

export default WasmHeavyMathCalculationComponent;
