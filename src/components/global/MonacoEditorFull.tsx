"use client";

import React from "react";
import WGSLMonacoEditor from "@/components/global/MonacoEditor";
import WebGPUShaderDisplay from "@/components/global/WebGPUShaderDisplay";
import useShaderStore from "@/store/shader.state";

export default function MonacoEditorFull() {
  return (
    <div className="flex slg:flex-col gap-4 w-full h-screen py-10">
      <div className="flex flex-col flex-1 min-h-96 xl:h-full max-w-4xl">
        <WGSLMonacoEditor />
      </div>
      <div className="flex flex-col flex-1 min-h-96 xl:h-full gap-3 max-w-lg min-w-96 mx-auto">
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
