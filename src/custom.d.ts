/// <reference types="monaco-editor/monaco.d.ts" />

declare module "*.wgsl" {
  const content: string;
  export default content;
}

declare module "*.glsl" {
  const content: string;
  export default content;
}

type ResultTypes = "js" | "wasm" | "webgpu";

interface Window {
  durations: Record<ResultTypes, Record<string, number>>;
}
