"use client";
import WGSLShaderComponent from "@/components/global/WebGPUShaderDisplay";
import wgslCode from "./fireWorks.wgsl";

const Fireworks = () => {
  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-[-1]">
      <WGSLShaderComponent style={{ height: "100%" }} className="w-full max-h-full z-[-1]" shaderCode={wgslCode} />
    </div>
  );
};

export default Fireworks;
