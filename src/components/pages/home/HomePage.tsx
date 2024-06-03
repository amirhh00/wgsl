"use client";

import WGSLMonacoEditor from "@/components/pages/home/MonacoEditor";
import WebGPUShaderDisplay from "./WebGPUShaderDisplay";

const HomePage = () => {
  return (
    <div className="flex slg:flex-col gap-4 w-full h-screen py-10">
      <div className="flex flex-col flex-1 min-h-96 xl:h-full max-w-4xl">
        <WGSLMonacoEditor />
      </div>
      <div className="flex flex-col flex-1 min-h-96 xl:h-full gap-3 max-w-lg min-w-96 mx-auto">
        <WebGPUShaderDisplay />
      </div>
    </div>
  );
};

export default HomePage;
