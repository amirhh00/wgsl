# WGSL basics

**Table of contents:**

1. [Plain Types](#1.-plain-types)
2. [Variable Declaration](#2.-variable-declaration)
   1. [Type Conversion](#2.1.-type-conversion)
3. [Vectors](#3.-vectors)
   1. [Vector Accessors](#3.1.-vector-accessors)
   2. [Swizzling](#3.2.-swizzling)
4. [Matrices](#4.-matrices)
   1. [Matrix Accessors](#4.1.-matrix-accessors)
5. [Arrays](#5.-arrays)
   1. [Runtime Arrays](#5.1.-runtime-arrays)
6. [Entry Points](#6.-entry-points)
7. [Shader Attributes](#7.-shader-attributes)
   1. [Inter Stage Communication](#7.1.-inter-stage-communication)
8. [Flow Control](#8.-flow-control)
9. [Built-in Functions](#9.-built-in-functions)

- [Further reading](#further-reading)

## 1. Plain Types

- `i32` : 32 bit signed integer
- `u32` : 32 bit unsigned integer
- `f32` : 32 bit floating point number
- `bool` : boolean value
- `f16` : 16 bit floating point number (f16 extention should be enabled [^1] )

## 2. Variable Declaration

```wgsl
var b: bool = true; // mutable variable declaration
let n: i32 = 5; // immutable variable declaration
const PI: f32 = 3.14159; // compile time constant.
```

```wgsl
fn s1(r: f32) -> f32 {
  return PI * r * r; // correct usage of constant
}

fn s2(r: f32) -> f32 {
  const sc = PI * r * r; // ERROR! const can only be used with compile time expressions
  return sc;
}
```

_Note that in a function declaration, the return type is specified after the `->` symbol._

### 2.1. Type Conversion

```wgsl
let a = 1;     // a is an i32
let b = 2.0;   // b is a f32
let c = a + b; // ERROR can't add an i32 to an f32

let c = f32(a) + b; // OK, a is converted to f32
```

## 3. Vectors

WGSL supports 3 types of vectors: `vec2`, `vec3`, and `vec4`. These are used to represent 2, 3, and 4 component vectors respectively.

```wgsl
let v2: vec2<f32> = vec2<f32>(1.0, 2.0);
let v3: vec3<f32> = vec3<f32>(1.0, 2.0, 3.0);
let v4: vec4<f32> = vec4<f32>(1.0, 2.0, 3.0, 4.0);
```

### 3.1. Vector Accessors

You can access the components of a vector using the following syntax:

```wgsl
let v: vec4<f32> = vec4<f32>(1.0, 2.0, 3.0, 4.0);
let v1: f32 = v.y; // using x, y, z, w accessors
let v2: f32 = v.g; // using r, g, b, a accessors
let v3: f32 = v[1]; // using array index accessors
```

Note that v1, v2, and v3 will all have the value 2.0 as they are accessing the second component of the vector.

### 3.2. Swizzling

Swizzling is a feature that allows you to access the components of a vector in a specific order. For example, if you have a `vec4` and you want to access the `x` and `y` components, you can do so using the following syntax:

```wgsl
let v: vec4<f32> = vec4<f32>(1.0, 2.0, 3.0, 4.0);
let v1: vec2<f32> = v.xy;
let v2: vec3<f32> = v.zzy;

var v3: vec3<f32> = v.xxy;
v3.rgb = v.zzy; // ERROR! Swizzles can not appear on the left!
```

_Note: there is a proposal to allow swizzling on the left side of an assignment, but it is not yet supported in WGSL. [^2]_

## 4. Matrices

WGSL supports many types of matrices, such as `mat2x2`, `mat3x4`, `mat4x4`, etc. These are used to represent 2x2, 3x4, 4x4 matrices, respectively.

```wgsl
let m2: mat2x2<f32> = mat2x2<f32>(
  vec2<f32>(1.0, 2.0),
  vec2<f32>(3.0, 4.0)
);

let m4: mat4x4f = ...;
```

### 4.1. Matrix Accessors

You can access the components of a matrix using the following syntax:

```wgsl
let m: mat2x2<f32> = mat2x2<f32>(
  vec2<f32>(1.0, 2.0),
  vec2<f32>(3.0, 4.0)
);

let m1: f32 = m[1][0]; // accessing the second row, first column
```

## 5. Arrays

WGSL supports arrays of any type, including other arrays. The difference between an array and a vector is that an array has a fixed size, while a vector has a fixed number of components.

```wgsl
let a = array<i32, 3>(1, 2, 3);
let b = array<vec4f, 2>(
  vec4f(1.0, 2.0, 3.0, 4.0),
  vec4f(5.0, 6.0, 7.0, 8.0)
);
```

Note: As of version 1.0, WGSL cannot retrieve the length of a fixed-size array.

### 5.1. Runtime Arrays

WGSL also supports runtime arrays, which are arrays whose size is determined at runtime. These arrays are declared at the root scope of the shader and are the only arrays that can be specified without a size.

```wgsl
struct S1 {
  color: vec4f,
  size: f32,
  verts: array<vec3f>,
}
@group(0) @binding(1) var<storage> foo: S1;

fn main() {
  let numVerts = arrayLength(&foo.verts);
}
```

## 6. Entry Points

An entry point is a function that is called by the host application to start the execution of the shader. It is either a `@vertex`, `@fragment`, or `@compute` function.

```wgsl
@vertex
fn vertex_main() {
  // vertex shader code
}

@fragment
fn fragment_main() {
  // fragment shader code
}

@compute
fn compute_main() {
  // compute shader code
}
```

## 7. Shader Attributes

Shader attributes are used to specify the input and output of a shader. They start with the `@` symbol.

```wgsl

@location(number) // input/output of shaders
```

### 7.1. Inter Stage Communication

Inter-stage communication is done using the `@location` attribute. It is used to specify the location of an input or output variable in the shader.

```wgsl
struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) color: vec4<f32>,
};

struct FragmentInput {
  @location(1) uv: vec2<f32>,
  @location(0) color: vec4<f32>,
};

@vertex fn vertex_main() -> VertexOutput {
  var output: VertexOutput;
  output.position = ...;
  output.color = ...;
  return output;
}

@fragment fn fragment_main(input: FragmentInput) ...
```

In the example above, the `@location` attribute is used to specify the location of the `color` attribute in the `VertexOutput` struct and the `uv` attribute in the `FragmentInput` struct.

The `@builtin` attribute is used to specify built-in attributes that are provided by the WebGPU API [^3].

| Name                   | Stage    | Direction | Type                  |
| ---------------------- | -------- | --------- | --------------------- |
| vertex_index           | vertex   | input     | u32                   |
| instance_index         | vertex   | input     | u32                   |
| clip_distances         | vertex   | output    | array<f32, N> (N ≤ 8) |
| position               | vertex   | output    | vec4<f32>             |
| fragment               | input    | vec4<f32> |
| front_facing           | fragment | input     | bool                  |
| frag_depth             | fragment | output    | f32                   |
| sample_index           | fragment | input     | u32                   |
| sample_mask            | fragment | input     | u32                   |
| fragment               | output   | u32       |
| local_invocation_id    | compute  | input     | vec3<u32>             |
| local_invocation_index | compute  | input     | u32                   |
| global_invocation_id   | compute  | input     | vec3<u32>             |
| workgroup_id           | compute  | input     | vec3<u32>             |
| num_workgroups         | compute  | input     | vec3<u32>             |

## 8. Flow Control

WGSL supports the some of the common flow control statements. the syntax is similar to Rust or C.

- `if` statement

  ```wgsl
  if (condition) {
    // code block
  } else {
    // code block
  }
  ```

- `for` loop

  ```wgsl
  for (var i = 0; i < 10; i++) {
    // code block
  }
  ```

- `while` loop

  ```wgsl
  while (condition) {
    // code block
  }
  ```

- `loop` statement

  ```wgsl
  var k = 0;
  loop {
    k = k + 1;
    if (k == 10) {
      break;
    }
  }
  ```

- `switch` statement

  ```wgsl
  switch expression {
    default: { // default doesn't have to be the last case
      // code block
    }
    case 1: {
      // code block
    }
    case 2: {
      // code block
    }
  }
  ```

- `continue` statement

  ```wgsl

  for (var i = 0; i < 10; i++) {
    if (i == 5) {
      continue;
    }
    // code block
  }
  ```

- `continuing` block

  ```wgsl
  for (var i = 0; i < 10; ++i) {
    if (i == 5) {
      continue;
    }
    // code block

    continuing {
      // continue goes here
    }
  }
  ```

- `discard` statement

  ```wgsl
    if (condition) {
      discard; // early return from the shader (fragment shader only)
    }
  ```

## 9. Built-in Functions

There are many built-in functions in WGSL that can be used to perform common operations [^4]. Some of the most commonly used functions are:

- `abs(x)`: Returns the absolute value of `x`.
- `ceil(x)`: Returns the smallest integer greater than or equal to `x`.
- `clamp(x, min, max)`: Clamps `x` to the range `[min, max]`.
- `cos(x)`: Returns the cosine of `x`.
- `sin(x)`: Returns the sine of `x`.
- `cross(a, b)`: Returns the cross product of `a` and `b`.
- `degrees(x)`: Converts `x` from radians to degrees.
- `length(x)`: Returns the length of `x` from the origin.
- `smoothstep(edge0, edge1, x)`: Returns a smooth interpolation between `edge0` and `edge1` based on `x`.

We will Learn more about these functions in the next steps.

## Further reading

- Ninomiya, K., Jones, B., & Jim, B. (2024). WebGPU W3C Working Draft. w3c. https://www.w3.org/TR/2024/WD-webgpu-20240626/
- https://youtu.be/3mfvZ-mdtZQ?si=gbse6seu9xXVIOpu

[^1]: https://www.w3.org/TR/WGSL/#extension-f16
[^2]: https://github.com/gpuweb/gpuweb/discussions/3478#discussioncomment-3738911
[^3]: https://www.w3.org/TR/WGSL/#builtin-inputs-outputs
[^4]: https://www.w3.org/TR/WGSL/#builtin-functions
