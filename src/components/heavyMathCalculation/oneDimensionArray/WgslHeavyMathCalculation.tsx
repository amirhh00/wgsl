import React, { useEffect, useState } from "react";
import computeShaderCode from "@/app/showcases/heavyMathCalculation/wgsl/computeShader.wgsl";
import { ResultResponse } from "@/@types/etc";
import Spinner from "@/components/global/Spinner";
import { Button } from "@/components/ui/button";

interface WebGPUCanvasProps {
  vector1: Float32Array;
  vector2: Float32Array;
}

type WGSLResultResponse = ResultResponse & { duration2: number };

const WebGPUCanvas: React.FC<WebGPUCanvasProps> = ({ vector1, vector2 }) => {
  const [res, setRes] = useState<WGSLResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function initWebGPU() {
    // Initialize GPU, context, device, etc.
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("WebGPU not supported");
    setIsLoading(true);
    const device = await adapter.requestDevice();

    // Create GPU buffers for the arrays
    const array1Buffer = device.createBuffer({
      label: "Array 1 Buffer",
      size: vector1.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(array1Buffer, 0, vector1.buffer);
    array1Buffer.unmap();

    const array2Buffer = device.createBuffer({
      label: "Array 2 Buffer",
      size: vector2.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(array2Buffer, 0, vector2.buffer);
    array2Buffer.unmap();

    const resultBuffer = device.createBuffer({
      label: "Result Buffer",
      size: vector1.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    });

    const readBuffer = device.createBuffer({
      size: vector1.byteLength,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    // create shader module
    const computeShaderModule = device.createShaderModule({
      label: "Compute Shader Module",
      code: computeShaderCode,
    });
    // Create pipeline, bind groups, etc., using the shader module and buffers
    const bindGroupLayout = device.createBindGroupLayout({
      label: "Compute Bind Group Layout",
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" as any } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" as any } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" as any } },
      ],
    });

    const pipelineLayout = device.createPipelineLayout({
      label: "Cell Pipeline Layout",
      bindGroupLayouts: [bindGroupLayout],
    });

    const computePipeline = device.createComputePipeline({
      label: "Compute Pipeline",
      layout: pipelineLayout,
      compute: { module: computeShaderModule, entryPoint: "main" },
    });

    const bindGroup = device.createBindGroup({
      label: "Compute Bind Group 1",
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: array1Buffer } },
        { binding: 1, resource: { buffer: array2Buffer } },
        { binding: 2, resource: { buffer: resultBuffer } },
      ],
    });

    const encoder = device.createCommandEncoder();
    const computePass = encoder.beginComputePass();
    computePass.setPipeline(computePipeline), computePass.setBindGroup(0, bindGroup);
    const workgroupSize = 64; // This should match your @workgroup_size in WGSL
    const numItems = vector1.length;
    const workgroupsX = Math.min(65535, Math.max(numItems, Math.ceil(numItems / workgroupSize)));
    const workgroupsY = Math.ceil(numItems / (workgroupSize * workgroupsX));

    // Dispatch the compute operation
    computePass.dispatchWorkgroups(workgroupsX, workgroupsY);
    computePass.end();

    // Copy the data from the resultBuffer to the readBuffer
    encoder.copyBufferToBuffer(resultBuffer, 0, readBuffer, 0, vector1.byteLength);
    const startTime = performance.now();
    // Submit the commands to the GPU
    device.queue.submit([encoder.finish()]);

    // Wait for the GPU to finish executing the commands
    await device.queue.onSubmittedWorkDone();
    const endTime = performance.now();
    const duration = endTime - startTime;
    // Map the result buffer for reading
    await readBuffer.mapAsync(GPUMapMode.READ);
    const arrayBufferData = new Float32Array(readBuffer.getMappedRange());
    const endTime2 = performance.now();
    const duration2 = endTime2 - startTime;

    // Now you can access the data from the result buffer
    // console.log(arrayBufferData);
    setRes({ result: arrayBufferData, duration, duration2 });
    window.durations.webgpu[vector1.length] = duration;
    setIsLoading(false);
    // readBuffer.unmap();
  }

  useEffect(() => {
    setRes(null);
  }, [vector1, vector2]);

  if (!navigator.gpu) {
    return <div className="text-center text-red-600 outline outline-red-600 py-3 rounded-md">WebGPU not supported on this browser!</div>;
  }

  return (
    <>
      {vector1 && vector2 && (
        <Button name="run-wgsl" className="pl-7" onClick={initWebGPU}>
          Run in webGpu <Spinner isLoading={isLoading} />
        </Button>
      )}
      {res && (
        <pre data-type="wgsl" data-length={vector1!.length}>
          Result:{" "}
          {Array.from(res.result.slice(0, 7))
            .map((v) => v.toFixed(2))
            .join(", ")}
          {res.result.length > 7 ? "..." : ""} <br />
          Duration: <b>{res.duration}</b>ms <br />
          Duration after copying data from gpu to cpu: <b>{res.duration2}</b>ms
        </pre>
      )}
    </>
  );
};

export default WebGPUCanvas;
