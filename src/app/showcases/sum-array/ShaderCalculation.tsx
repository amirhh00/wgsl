'use client';

import React, { useEffect, useRef, useState } from 'react';
import shaderCode from './ComputeShader.wgsl';
import { cn } from '@/lib/utils';

export default function ComputeShaderComponent() {
  const [arrayLength, setArrayLength] = useState(10);
  const deviceRef = useRef<GPUDevice | null>(null);
  const [result, setResult] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [arr, setArr] = useState<number[]>([]);
  const arrayLengthRef = useRef<HTMLInputElement>(null);

  async function initWebGPU() {
    if (!navigator.gpu) {
      throw new Error('WebGPU not supported on this browser.');
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error('No appropriate GPUAdapter found.');
    }
    let device = deviceRef.current;
    if (device) {
      return device;
    } else {
      device = await adapter.requestDevice({
        label: 'GPU Device' + Math.random(),
      });
      deviceRef.current = device;
      return device;
    }
  }

  async function sumArrayShader(device: GPUDevice, array: Uint32Array) {
    const inputBuffer = device.createBuffer({
      size: array.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(inputBuffer, 0, array);

    const outputBuffer = device.createBuffer({
      size: Uint32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    });

    const bindGroupLayout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: 'read-only-storage' },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: 'storage' },
        },
      ],
    });

    const bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: inputBuffer } },
        { binding: 1, resource: { buffer: outputBuffer } },
      ],
    });

    const shaderModule = device.createShaderModule({
      code: shaderCode,
    });

    const computePipeline = device.createComputePipeline({
      layout: device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout],
      }),
      compute: {
        module: shaderModule,
        entryPoint: 'main',
      },
    });

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginComputePass();
    passEncoder.setPipeline(computePipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.dispatchWorkgroups(Math.ceil(array.length / 256));
    passEncoder.end();

    const gpuCommands = commandEncoder.finish();
    device.queue.submit([gpuCommands]);

    const resultBuffer = device.createBuffer({
      size: Uint32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    const copyEncoder = device.createCommandEncoder();
    copyEncoder.copyBufferToBuffer(outputBuffer, 0, resultBuffer, 0, Uint32Array.BYTES_PER_ELEMENT);
    device.queue.submit([copyEncoder.finish()]);

    await resultBuffer.mapAsync(GPUMapMode.READ);
    const resultArray = new Uint32Array(resultBuffer.getMappedRange());
    const sum = resultArray[0];
    resultBuffer.unmap();

    return sum;
  }

  async function main(length: number) {
    try {
      const device = await initWebGPU();
      if (!device) return;
      const inputArray = new Uint32Array(length);
      for (let i = 0; i < length; i++) {
        inputArray[i] = Math.floor(Math.random() * 100);
      }
      setArr(Array.from(inputArray));
      const sum1 = sumArrayShader(device, inputArray);
      // const sum2 = await sumArrayJS(inputArray);
      Promise.all([
        sum1,
        // sum2
      ]).then((values) => {
        console.log(
          'sum1:',
          values[0]
          // "sum2:", values[1]
        );
        setResult(values[0]);
      });
      // setResult(sum);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  useEffect(() => {
    setLoading(true);
    main(arrayLength).finally(() => {
      setLoading(false);
      // arrayLengthRef.current?.focus();
    });
  }, [arrayLength]);

  return (
    <div className="">
      <h3 className="text-lg">Compute Shader Calculation Example</h3>
      <div className="flex">
        <div className="flex flex-col justify-center">
          <label htmlFor="arrayLength" className="mr-2">
            array length:
          </label>
          <input
            className={cn('max-w-full bg-secondary pl-1', loading && 'opacity-50')}
            id="arrayLength"
            ref={arrayLengthRef}
            type="number"
            min={1}
            max={16776960}
            maxLength={8}
            disabled={loading}
            step={1}
            value={arrayLength}
            onChange={(e) => setArrayLength(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="flex">
        {loading ? (
          <p className="m-0">Loading...</p>
        ) : (
          // show array
          <div className="flex items-center">
            {arr.slice(0, 10).map((v, i) => (
              <p key={i} className="mr-1 my-0">
                {v}
                {i === arr.length - 1 ? '' : ', '}
              </p>
            ))}
            {arr.length > 10 && '...'}
          </div>
        )}
      </div>
      <div className="flex">
        <p className="m-0">Sum = {result}</p>
      </div>
    </div>
  );
}
