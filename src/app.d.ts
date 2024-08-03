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
type ArrayLength = string;
type Durations = Record<ResultTypes, Record<ArrayLength, number>>;
interface Window {
  durations: Durations;
}
