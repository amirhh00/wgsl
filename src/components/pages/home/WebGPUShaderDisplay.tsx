import React, { useRef, useEffect, useState } from "react";
import useShaderStore from "@/store/shader.state";

interface WGSLShaderComponentProps {
  // shaderCode: string;
}
let frameNumber = 0;
const WGSLShaderComponent: React.FC<WGSLShaderComponentProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { savedCustomCodes: models } = useShaderStore();
  // const [frameNumber, setFrameNumber] = useState(0);
  const activeShaderCode = models.find((c) => c.currentActive)?.code || "";

  useEffect(() => {
    let animationFrameId: number;
    const initWebGPU = async () => {
      if (!navigator.gpu) {
        console.error("WebGPU is not supported by this browser.");
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
      const device = await adapter!.requestDevice();
      const context = canvasRef.current?.getContext("webgpu");
      const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
      context!.configure({
        device,
        format: presentationFormat,
        alphaMode: "premultiplied",
      });

      // Create a buffer for the uniform data
      const uniformBuffer = device.createBuffer({
        size: 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      const updateFrame = () => {
        // setFrameNumber((frameNumber) => frameNumber + 1);
        frameNumber++;
        device.queue.writeBuffer(uniformBuffer, 0, new Uint32Array([frameNumber]));
        animationFrameId = requestAnimationFrame(updateFrame);
      };

      updateFrame();

      // Create a bind group layout
      const bindGroupLayout = device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: "uniform" as any },
          },
        ],
      });

      // Create the bind group
      const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          {
            binding: 0,
            resource: { buffer: uniformBuffer },
          },
        ],
      });

      const pipeline = device.createRenderPipeline({
        vertex: {
          module: device.createShaderModule({
            code: activeShaderCode,
          }),
          // entryPoint: "vtx_main",
        },
        fragment: {
          module: device.createShaderModule({
            code: activeShaderCode,
          }),
          // entryPoint: "frag_main",
          targets: [
            {
              format: presentationFormat,
            },
          ],
        },
        primitive: {
          topology: "triangle-list",
        },
        // Use the bind group layout in the pipeline layout
        layout: device.createPipelineLayout({
          bindGroupLayouts: [bindGroupLayout],
        }),
      });

      const commandEncoder = device.createCommandEncoder();
      const textureView = context!.getCurrentTexture().createView();

      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
          {
            view: textureView,
            // @ts-ignore
            loadValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      passEncoder.setPipeline(pipeline);
      passEncoder.setBindGroup(0, bindGroup);
      passEncoder.draw(3, 1, 0, 0);
      passEncoder.end();

      device.queue.submit([commandEncoder.finish()]);
    };

    initWebGPU();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeShaderCode]);

  return <canvas className="w-full aspect-square" ref={canvasRef}></canvas>;
};

export default WGSLShaderComponent;
