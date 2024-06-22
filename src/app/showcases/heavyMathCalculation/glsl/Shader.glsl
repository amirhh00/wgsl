#version 310 es
layout(set = 0, binding = 0) buffer Array1 {
    float array1[];
};

layout(set = 0, binding = 1) buffer Array2 {
    float array2[];
};

layout(set = 0, binding = 2) buffer ResultArray {
    float resultArray[];
};

void main() {
    uint index = gl_GlobalInvocationID.x;

    // Ensure we do not access out of bounds
    if (index < array1.length()) {
        float val1 = array1[index];
        float val2 = array2[index];

        // Perform some heavy computation
        float result = sin(val1) * cos(val2) + sqrt(val1 * val2);

        resultArray[index] = result;
    }
}

// WebGL 2.0 does not natively support compute shaders. However, there was an effort to bring compute shader support to
// the web via the WebGL rendering context. This resulted in the WebGL 2.0 Compute specification, which aimed to 
// extend WebGL 2.0 with features from OpenGL ES 3.1, including GPU compute capabilities. 
// Unfortunately, this specification is now considered obsolete, and the focus has shifted to WebGPU, a more 
// performant API for compute shaders on the web https://registry.khronos.org/webgl/specs/latest/2.0-compute/

// Here’s why (TLDR):

// Lack of Adoption:
    // The WebGL 2.0 Compute proposal faced limited adoption and implementation.
    // Browser vendors and the WebGL community did not widely embrace it.
// Performance and Complexity:
    // WebGL 2.0 Compute introduced complexities for browser vendors and developers.
    // Implementing compute shaders in a secure and efficient manner proved challenging.
// Shift to WebGPU:
    // The focus shifted to WebGPU, a more comprehensive and performant API for web graphics.
    // WebGPU aims to provide a unified, low-level interface for both 2D and 3D graphics, including compute shaders.
// WebGPU Advantages:
    // WebGPU is designed with modern hardware and parallelism in mind.
    // It offers better performance, safety, and flexibility compared to WebGL 2.0 Compute.

// (TLDR TLDR):
//      In summary, the industry moved away from WebGL 2.0 Compute in favor of WebGPU,
//      which promises a more robust and future-proof solution for web-based compute shaders.