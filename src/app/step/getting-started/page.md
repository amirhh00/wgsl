# Getting Started with WebGPU Shading Language (WGSL)

**What you'll need**:

- A recent version of Chrome (113 or later) on Windows, macOS, or ChromeOS. You can also use Firefox Nightly or Safari on mobile using _WebGPU feature flag_ `enabled`[^1].
- Although WebGPU is a cross-platform and cross-browser API, it hasn't launched everywhere yet.
- For this tutorial, it's recommended to use the desktop version of your browser.
- A basic understanding of programming concepts.

## Integration with WebGPU API

Since the focus of this lesson is on the WebGPU shading language, we won't be going over how to configure the WebGPU API in the browser. To begin creating WGSL code, navigate to [editor page](/editor). Alternatively, see [this tutorial](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) for the setup for the web implementation.

Please be aware that WebGPU is a low-level API, necessitating a considerable amount of boilerplate code for effective initialization and usage across various platforms, including web browsers. In this tutorial, we will not be directly writing WebGPU API code. As a result, you will not be able to visualize the output of the shader code in the browser without integrating it with the WebGPU API and configuring the appropriate **pipeline**. Each shader type, whether it be a compute shader, vertex shader, or fragment shader, requires a specific set of pipeline configurations to render the output.

If you are interested in using WebGPU in Rust, you can check out the WGPU [^2] which serves as the core of the WebGPU integration in Firefox and Deno.

There is also a WebGPU implementation in C++ called Dawn [^3]. It is the underlying implementation of WebGPU in Chromium.

![WebGPU Integration with other APIs](/images/webgpuChart.svg)

## debugging

Since WGSL is a new shading language, there is no debugging tool for WGSL in the browser. You can use the developer tools to see the errors and warnings in the console.

The `wgpu::DawnTogglesDeviceDescriptor` in _C++/dawn_ can be configured to emit HLSL debug symbols by setting certain parameters.

**References:**

[^1]: https://caniuse.com/webgpu
[^2]: https://github.com/gfx-rs/wgpu
[^3]: https://github.com/google/dawn
