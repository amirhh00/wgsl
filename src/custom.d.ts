// wgsl-files.d.ts
declare module "*.wgsl" {
  const content: string;
  export default content;
}

declare global {
  interface Window {
    monaco: import("monaco-editor");
  }
}

export {};
