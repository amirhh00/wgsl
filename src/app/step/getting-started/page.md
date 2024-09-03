# Getting Started with WebGPU Shading Language (WGSL)

**What you'll need**:

- A recent version of Chrome (113 or later) on Windows, macOS, or ChromeOS. You can also use Firefox Nightly or Safari on mobile using _WebGPU feature flag_ `enabled`[^1].
- Although WebGPU is a cross-platform and cross-browser API, it hasn't launched everywhere yet.
- For this tutorial, it's recommended to use the desktop version of your browser.
- A basic understanding of programming concepts.

## Integration with WebGPU API

In this tutorial, since we are focusing on the shading language, we will skip the setup of the WebGPU API in the browser. You can go to [editor page](/editor) to start writing WGSL code.

You can find the setup for the web in the [Getting Started with WebGPU](https://web.dev/getting-started-with-webgpu/) tutorial.

If you are interested in using WebGPU in Rust, you can check out the WGPU [^2] which serves as the core of the WebGPU integration in Firefox and Deno.

There is also a WebGPU implementation in C++ called Dawn [^3]. It is the underlying implementation of WebGPU in Chromium.

## debugging

Since WGSL is a new shading language, there is no debugging tool for WGSL in the browser. You can use the developer tools to see the errors and warnings in the console.

The `wgpu::DawnTogglesDeviceDescriptor` in _C++/dawn_ can be configured to emit HLSL debug symbols by setting certain parameters.

**References:**

[^1]: https://caniuse.com/webgpu
[^2]: https://github.com/gfx-rs/wgpu
[^3]: https://github.com/google/dawn
