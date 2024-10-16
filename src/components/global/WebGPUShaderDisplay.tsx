"use client";

import React, { useRef, useEffect } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CodeBlock } from "@/components/document/Code.client";

interface WGSLShaderComponentOtherProps {
  shaderCode: string;
  showTooltip?: boolean;
  textureUrl?: string;
}

type WGSLShaderComponentProps = WGSLShaderComponentOtherProps & React.HTMLAttributes<HTMLCanvasElement>;

let frameNumber = 0;
const WGSLShaderComponent: React.FC<WGSLShaderComponentProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { shaderCode: activeShaderCode = "", ...rest } = props;
  useEffect(() => {
    let animationFrameId: number;
    let device: GPUDevice;
    const initWebGPU = async () => {
      if (!navigator.gpu) {
        console.error("WebGPU is not supported by this browser.");
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) throw new Error("Failed to create GPU adapter");
      device = await adapter.requestDevice();
      if (!device) throw new Error("Failed to create GPU device");

      // Set label for the device
      const image = await createTextureFromUrl(props.textureUrl ?? "/images/404.png", device);

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

      const texture = device.createTexture({
        size: { width: image.width, height: image.height },
        format: "rgba8unorm",
        usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT,
      });

      const data = await createImageBitmap(image);

      device.queue.copyExternalImageToTexture({ source: data }, { texture: texture }, { width: image.width, height: image.height });

      const sampler = device.createSampler();

      const textureBindGroupLayout = device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {},
          },
          {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {},
          },
        ],
      });

      const textureBindGroup = device.createBindGroup({
        layout: textureBindGroupLayout,
        entries: [
          {
            binding: 0,
            resource: sampler,
          },
          {
            binding: 1,
            resource: texture.createView(),
          },
        ],
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
        label: "Render Pipeline",
        vertex: {
          module: device.createShaderModule({
            code: activeShaderCode,
          }),
        },
        fragment: {
          module: device.createShaderModule({
            code: activeShaderCode,
          }),
          targets: [
            {
              format: presentationFormat,
            },
          ],
        },
        primitive: {
          topology: "triangle-list",
        },
        layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout, textureBindGroupLayout] }),
      });

      // Set label for the pipeline
      pipeline.label = "Render Pipeline";
      const renderPassDescriptor: GPURenderPassDescriptor = {
        // @ts-ignore
        colorAttachments: [
          {
            // view: textureView,
            loadOp: "clear",
            storeOp: "store",
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
          },
        ],
      };
      const render = () => {
        // Update the uniform buffer with the current frame number
        frameNumber++;
        if (!device) return;
        device.queue.writeBuffer(uniformBuffer, 0, new Uint32Array([frameNumber]));

        const commandEncoder = device.createCommandEncoder({ label: "Command Encoder" });
        // const textureView = context!.getCurrentTexture().createView();
        (renderPassDescriptor as any).colorAttachments[0].view = context!.getCurrentTexture().createView();

        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.setBindGroup(1, textureBindGroup);
        passEncoder.draw(6);
        passEncoder.end();

        device.queue.submit([commandEncoder.finish()]);

        // Schedule the next frame
        animationFrameId = requestAnimationFrame(render);
      };

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.devicePixelContentBoxSize?.[0].inlineSize || entry.contentBoxSize[0].inlineSize * devicePixelRatio;
          const height = entry.devicePixelContentBoxSize?.[0].blockSize || entry.contentBoxSize[0].blockSize * devicePixelRatio;
          const canvas = entry.target as HTMLCanvasElement;
          canvas.width = Math.max(1, Math.min(width, device.limits.maxTextureDimension2D));
          canvas.height = Math.max(1, Math.min(height, device.limits.maxTextureDimension2D));
          cancelAnimationFrame(animationFrameId);
          render();
        }
      });
      if (!canvasRef.current) return;
      try {
        observer.observe(canvasRef.current, { box: "device-pixel-content-box" });
      } catch {
        observer.observe(canvasRef.current, { box: "content-box" });
      }
    };

    initWebGPU();

    return () => {
      cancelAnimationFrame(animationFrameId);
      // Clean up the device and resources
      if (device && process.env.NODE_ENV !== "development") {
        device.destroy();
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

function createTextureFromUrl(url: string, device: GPUDevice) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}
