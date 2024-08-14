"use client";

import React from "react";
import WGSLMonacoEditor from "@/components/global/MonacoEditor";
import WebGPUShaderDisplay from "@/components/global/WebGPUShaderDisplay";
import useShaderStore from "@/store/shader.state";

export default function MonacoEditorFull() {
  return (
    <div className="flex slg:flex-col gap-4 w-full py-6 flex-wrap">
      <div className="flex flex-col flex-1 min-h-96 xl:h-full max-w-full">
        <WGSLMonacoEditor />
      </div>
      <div className="flex flex-col flex-1 min-h-96 xl:h-full gap-3 sm:min-w-96 mx-auto max-w-lg">
        <DisplayShader />
      </div>
    </div>
  );
}

function DisplayShader() {
  const { savedCustomCodes: models } = useShaderStore();
  const shaderCode = models.find((c) => c.currentActive)?.code || "";

  return (
    <div>
      <WebGPUShaderDisplay shaderCode={shaderCode} />
    </div>
  );
}
