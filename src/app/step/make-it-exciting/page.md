# Make it Exciting

In this step, we will create a more exciting WGSL shader by utilizing the `Compute shader` [^3].
This type of shader is used to perform general-purpose computation on the GPU. It is an excellent way to offload work from the CPU and take advantage of the parallel processing power of the GPU.
Here, we will use a compute shader to implement a basic `Sum Array` algorithm for unsigned 32-bit integers.

## Sum Array Algorithm

The `Sum Array` algorithm is a simple algorithm that calculates the sum of all elements in an array.

### Algorithm Pseudo Code in CPU

```vb
FUNCTION sumNumbers(array)
  SET sum = 0
  SET n = LENGTH(array)
  FOR i FROM 0 TO n - 1 DO
    sum = sum + array[i]
  END FOR
  RETURN sum
END FUNCTION
```

Note that the time complexity of this algorithm is `O(n)`, where `n` is the number of elements in the array.

## Compute Shader Implementation

The compute shader implementation of the `Sum Array` algorithm is as follows:

```wgsl
@group(0) @binding(0) var<storage, read> input_array: array<f32>;
@group(0) @binding(1) var<storage, read_write> output: atomic<u32>;

@compute @workgroup_size(256, 1, 1) // 256 threads per workgroup
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    if (index >= arrayLength(&input_array)) {
        return;
    }

    let value = input_array[index];
    atomicAdd(&output, bitcast<u32>(value));
}
```

In this compute shader implementation of the `Sum Array` algorithm, we define two storage variables:

1. `input_array`: An array of 32-bit floating-point numbers (f32) that represents the input array.
2. `output`: An atomic unsigned 32-bit integer (u32) that stores the sum of the array elements.

The `@compute` decorator indicates that this shader is a compute shader, and the `@workgroup_size` decorator specifies the number of threads per workgroup. In this case, we have 256 threads per workgroup which is the maximum allowed value on chrome browser. this value can be different on other platforms and devices. the workgroup size is a 3D vector, but we only specify the x dimension here. We could also specify the y and z dimensions if needed for more complex computations. However, for this simple sum array algorithm, we only need one dimension and other dimensions are set to 1 by default.

The `main` function is the entry point of the compute shader and is executed by each thread in the workgroup.

The `global_id` parameter represents the global invocation ID of the thread.

The `index` variable is calculated based on the `global_id.x` value, which corresponds to the index of the element in the input array that the thread will process.

The `if` statement checks if the `index` is within the bounds of the input array. If it is not, the thread returns without performing any computation.

The `value` variable stores the value of the element in the input array at the `index`.

The `atomicAdd` function is used to atomically add the value to the `output` variable, which accumulates the sum of the array elements.

In this line of code, `atomicAdd(&output, bitcast<u32>(value));`, two key operations are being performed:

1. **Atomic Addition** [^1]: The function `atomicAdd` is used to perform an atomic addition operation.
   Atomic operations are crucial in parallel computing environments, such as shaders, where multiple threads might attempt to read and write to the same memory location simultaneously. By using atomic operations, we ensure that these read-modify-write sequences are performed without interference from other threads, thus preventing race conditions. In this case, atomicAdd adds a value to the variable output atomically.

2. **Type Casting** [^2]: The `bitcast<u32>(value)` function is used to cast the value to an unsigned 32-bit integer (u32). The bitcast operation is a type of casting that reinterprets the bit pattern of the value without changing the bits themselves. This is often necessary in shader programming where data might be represented in different formats, and you need to ensure that the data is in the correct format for the operation being performed.

As a result, this compute shader implementation calculates the sum of the array elements using parallel processing on the GPU with time complexity `O(n/workgroup_size)` where `n` is the number of elements in the array and `workgroup_size` is the number of threads per workgroup. This can significantly improve performance compared to the CPU implementation, especially for **large arrays**.

You can run this compute shader on the GPU using WebGPU and see the results in real-time using this [sum array showcases](/showcases/sum-array) link.

**References:**

[^1]: https://www.w3.org/TR/WGSL/#atomic-rmw
[^2]: https://www.w3.org/TR/WGSL/#bitcast-builtin
[^3]: https://www.w3.org/TR/WGSL/#compute-shader-workgroups
