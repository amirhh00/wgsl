"use client";

import { useState } from "react";
import WGSLMonacoEditor from "@/components/pages/home/MonacoEditor";
import WebGPUShaderDisplay from "./WebGPUShaderDisplay";

const defaultCode = `\
@binding(0) @group(0) var<uniform> frame : u32;
@vertex
fn vtx_main(@builtin(vertex_index) vertex_index : u32) -> @builtin(position) vec4f {
  const pos = array(
    vec2( 0.0,  0.5),
    vec2(-0.5, -0.5),
    vec2( 0.5, -0.5)
  );

  return vec4f(pos[vertex_index], 0, 1);
}

@fragment
fn frag_main() -> @location(0) vec4f {
  return vec4(1, sin(f32(frame) / 128), 0, 1);
}
`;

const HomePage = () => {
  const [code, setCode] = useState(defaultCode);

  const handleCodeChange = (newValue: string) => {
    setCode(newValue);
  };

  // const runShader = () => {
  //   // Placeholder for running the shader
  //   // You need to implement the actual WebGPU shader execution logic here
  //   try {
  //     // Simulate shader run
  //     setShaderOutput(`Shader output for the code: ${code}`);
  //   } catch (error) {
  //     console.error("Shader execution error:", error);
  //     setShaderOutput("Shader execution failed.");
  //   }
  // };

  return (
    <div className="flex gap-4">
      <div>
        <h1>WGSL Editor</h1>
        <WGSLMonacoEditor value={code} onChange={handleCodeChange} />
      </div>
      <div>
        <h2>Shader Output:</h2>
        <WebGPUShaderDisplay shaderCode={code} />
      </div>
    </div>
  );
};

export default HomePage;
