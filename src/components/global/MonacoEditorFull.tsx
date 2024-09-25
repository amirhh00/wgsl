'use client';

import React from 'react';
import WGSLMonacoEditor from '@/components/global/MonacoEditor';
import WebGPUShaderDisplay from '@/components/global/WebGPUShaderDisplay';
import useShaderStore from '@/store/shader.state';

export default function MonacoEditorFull() {
  return (
    <div className="flex slg:flex-col gap-4 w-full py-6 flex-nowrap min-h-96">
      <div className="lg:max-w-[60%]">
        <WGSLMonacoEditor />
      </div>
      <div className="lg:w-[40%] gap-3 sm:min-w-96 mx-auto max-w-lg">
        <DisplayShader />
      </div>
    </div>
  );
}

function DisplayShader() {
  const { savedCustomCodes: models } = useShaderStore();
  const shaderCode = models.find((c) => c.currentActive)?.code || '';

  return (
    <div className="lg:mt-14">
      <WebGPUShaderDisplay shaderCode={shaderCode} />
    </div>
  );
}
