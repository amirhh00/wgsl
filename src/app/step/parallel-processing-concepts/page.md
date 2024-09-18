# Parallel Processing Concepts

As we have seen in the [first section](/step/introduction), Shader is basically a piece of code that runs on the GPU as opposed to the CPU.

You can think of the GPU as a factory with thousands of workers, each capable of performing a specific task. When you run a shader on the GPU, it is like giving instructions to all the workers in the factory at the same time. This parallel processing capability is what makes the GPU so powerful for graphics rendering and other computationally intensive tasks.

![Illustration of a factory with numerous workers, symbolizing the GPU's parallel processing capability](/images/factory.jpeg)

Shaders are particularly useful in various fields such as **3D rendering**, **visual effects**, **generative art**, and even **simulations**. The advantage of using the GPU over the CPU is that while the **CPU has a few powerful** cores, the GPU is designed with **hundreds of cores**, making it much more efficient at handling parallel tasks. This parallel processing capability allows shaders to handle operations like pixel manipulation across large screens or complex **computations**[^1] at much faster rates.

In the next [step](/step/wgsl-basics/), we will dive into some practical examples of writing and using shaders with WGSL to demonstrate how parallel processing works in the context of WebGPU. This will help you get hands-on experience with both the syntax and the core concepts of parallelism that are foundational to shaders.

## Further Sources

NVIDIA. (2009, December 4). Mythbusters Demo GPU versus CPU [Video]. YouTube. [https://www.youtube.com/watch?v=-P28LKWTzrI](https://www.youtube.com/watch?v=-P28LKWTzrI)

**Footnotes**

[^1]: [An example of using compute shader](/showcases/heavyMathCalculation)
