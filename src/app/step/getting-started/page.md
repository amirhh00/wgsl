# Getting Started with WebGPU Shading Language (WGSL)

**What you'll need**:

- A recent version of Chrome (113 or later) on Windows, macOS, or ChromeOS.
- Although WebGPU is a cross-platform and cross-browser API, it hasn't launched everywhere yet.

## Basic Syntax

- **Data Types**:

  - WGSL supports scalar types (integers, floats), vectors, matrices, arrays, and structures.
  - Example: `f32` for a 32-bit floating-point number.

- **Variables**:

  - Declare variables using `var`.
  - Example: `var myColor: vec3<f32> = vec3<f32>(1.0, 0.0, 0.0);`

- **Functions**:
  - Define functions using `fn`.
  - Example:
    ```wgsl
    fn add(a: f32, b: f32) -> f32 {
        return a + b;
    }
    ```

## Hello World Shader

Here's a simple fragment shader that colors a primitive red:

```wgsl
@fragment
fn fragmentMain() -> [[location(0)]] vec4<f32> {
    return vec4<f32>(1.0, 0.0, 0.0, 1.0); // Red color
}
```

## Integration with WebGPU API

1. Create a WebGPU context:

- Initialize a canvas element and create a WebGPU context.
- Set up the necessary GPU resources (buffers, textures, etc.).

2. Compile and Run Shaders:

- Compile the WGSL shaders using the WebGPU API.
- Bind shaders to the appropriate pipeline stages (vertex, fragment, etc.).

3. Render the Scene:

- Use the WebGPU API to draw the scene using the compiled shaders.
- Present the rendered frame to the screen.

## Resources and Further Reading

- [WebGPU Shading Language Specification](https://gpuweb.github.io/gpuweb/wgsl/)

- [WebGPU Samples](https://webglsamples.org/)

- [WebGPU Explainer](https://gpuweb.github.io/gpuweb/explainer/)

Happy coding! 🚀
