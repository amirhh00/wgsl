"use client";

import React, { useRef, useEffect } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CodeBlock } from "../document/Code.client";
interface WGSLShaderComponentOtherProps {
  shaderCode: string;
  showTooltip?: boolean;
}

type WGSLShaderComponentProps = WGSLShaderComponentOtherProps & React.HTMLAttributes<HTMLCanvasElement>;

let frameNumber = 0;
const WGSLShaderComponent: React.FC<WGSLShaderComponentProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const deviceRef = useRef<GPUDevice | null>(null);
  const { shaderCode: activeShaderCode = "", ...rest } = props;

  useEffect(() => {
    let animationFrameId: number;

    const initWebGPU = async () => {
      if (!navigator.gpu) {
        console.error("WebGPU is not supported by this browser.");
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) throw new Error("Failed to create GPU adapter");
      if (!deviceRef.current) {
        deviceRef.current = await adapter.requestDevice({
          label: "GPU Device " + Math.random(),
        });
      }
      const device = deviceRef.current;
      if (!device) throw new Error("Failed to create GPU device");

      // Set label for the device

      const context = canvasRef.current?.getContext("webgpu");
      const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
      context!.configure({
        device,
        format: presentationFormat,
        alphaMode: "premultiplied",
      });

      const uniformBuffer = device.createBuffer({
        size: 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      // Set label for the uniform buffer
      uniformBuffer.label = "Uniform Buffer";

      const bindGroupLayout = device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: "uniform" as any },
          },
        ],
      });

      const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          {
            binding: 0,
            resource: {
              buffer: uniformBuffer,
            },
          },
        ],
      });

      const pipeline = device.createRenderPipeline({
        vertex: {
          module: device.createShaderModule({
            code: activeShaderCode,
          }),
          entryPoint: "vtx_main",
        },
        fragment: {
          module: device.createShaderModule({
            code: activeShaderCode,
          }),
          entryPoint: "frag_main",
          targets: [
            {
              format: presentationFormat,
            },
          ],
        },
        primitive: {
          topology: "triangle-list",
        },
        layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
      });

      // Set label for the pipeline
      pipeline.label = "Render Pipeline";

      const render = () => {
        // Update the uniform buffer with the current frame number
        frameNumber++;
        if (!device) return;
        device.queue.writeBuffer(uniformBuffer, 0, new Uint32Array([frameNumber]));

        const commandEncoder = device.createCommandEncoder();
        const textureView = context!.getCurrentTexture().createView();

        const renderPassDescriptor: GPURenderPassDescriptor = {
          // @ts-ignore
          colorAttachments: [
            {
              view: textureView,
              loadOp: "clear",
              storeOp: "store",
              clearValue: { r: 0, g: 0, b: 0, a: 0 },
            },
          ],
        };

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.draw(3, 1, 0, 0);
        passEncoder.end();

        device.queue.submit([commandEncoder.finish()]);

        // Schedule the next frame
        animationFrameId = requestAnimationFrame(render);
      };

      // Start the rendering loop
      render();
    };

    initWebGPU();

    return () => {
      cancelAnimationFrame(animationFrameId);
      // Clean up the device and resources
      if (deviceRef.current && process.env.NODE_ENV !== "development") {
        deviceRef.current.destroy();
      }
    };
  }, [props.shaderCode]);

  const { className, showTooltip, ...otherAttrs } = rest;
  if (!props.showTooltip) {
    return <canvas {...otherAttrs} className={`${className ?? "w-full aspect-square"}`} ref={canvasRef}></canvas>;
  }
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <canvas {...otherAttrs} className={`${className ?? "w-full aspect-square"}`} ref={canvasRef}></canvas>
      </HoverCardTrigger>
      <HoverCardContent className="bg-transparent !w-auto !p-0 !border-none z-20">
        <CodeBlock code={activeShaderCode} lang="wgsl" />
      </HoverCardContent>
    </HoverCard>
  );
};

export default WGSLShaderComponent;
