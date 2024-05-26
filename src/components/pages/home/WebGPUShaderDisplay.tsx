import React, { useRef, useEffect } from "react";

interface WGSLShaderComponentProps {
  shaderCode: string;
}

const WGSLShaderComponent: React.FC<WGSLShaderComponentProps> = ({ shaderCode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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
            code: shaderCode,
          }),
          entryPoint: "vtx_main",
        },
        fragment: {
          module: device.createShaderModule({
            code: shaderCode,
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
  }, [shaderCode]);

  return <canvas ref={canvasRef} width="600" height="600"></canvas>;
};

export default WGSLShaderComponent;
