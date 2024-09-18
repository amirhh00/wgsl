export type QuizLevel = {
  question: string;
  options: string[];
  answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  userAnswered?: boolean;
  id?: number;
};

export type Quiz = Omit<QuizLevel, 'answer'>;

export const quizLevels: QuizLevel[] = [
  {
    question: 'Which Shading Language is not available in browsers?',
    options: ['GLSL', 'WGSL', 'Metal'],
    answer: 2,
    difficulty: 'easy',
  },
  {
    question: 'Which of the following is a basic shader type in WGSL?',
    options: ['Geometry Shader', 'Fragment Shader', 'Turing Shader', 'Blending Shader'],
    answer: 1,
    difficulty: 'easy',
  },
  {
    question: 'In WGSL, what does the @vertex attribute signify?',
    options: [
      'It marks the shader function as a fragment shader',
      'It declares a constant',
      'It marks the shader function as a vertex shader',
      'It imports a library',
    ],
    answer: 2,
    difficulty: 'easy',
  },
  {
    question: 'What is the primary role of a vertex shader in WGSL?',
    options: [
      'To color the pixels',
      'To run CPU-based algorithms',
      'To handle textures',
      'To transform the attributes of vertices',
    ],
    answer: 3,
    difficulty: 'easy',
  },
  {
    question: 'Which data type in WGSL is used to store floating-point numbers?',
    options: ['i32', 'u32', 'f32', 'bool'],
    answer: 2,
    difficulty: 'easy',
  },
  {
    question: 'In WGSL, how do you declare a mutable variable?',
    options: ['var', 'let', 'const', 'static'],
    answer: 0,
    difficulty: 'medium',
  },
  {
    question: 'Which attribute is used to define the entry point of a fragment shader in WGSL?',
    options: ['@vertex', '@entry', '@fragment', '@main'],
    answer: 2,
    difficulty: 'medium',
  },
  {
    question: 'What is the main purpose of a compute shader in WGSL?',
    options: [
      'To process pixel color values',
      'To handle lighting and shading',
      'To perform parallel computations on the GPU',
      'To map textures to objects',
    ],
    answer: 2,
    difficulty: 'medium',
  },
  {
    question: 'What is the correct syntax for a vector with 4 floating-point components in WGSL?',
    options: ['vec4', 'float4', 'f32x4', 'vec4f'],
    answer: 3,
    difficulty: 'medium',
  },
  {
    question: 'How do you initialize a 3D vector in WGSL?',
    options: [
      'let v = vec3<f32>(1.0, 2.0, 3.0);',
      'let v = vector3(1.0, 2.0, 3.0);',
      'let v = float3(1.0, 2.0, 3.0);',
      'let v = f32vec3(1.0, 2.0, 3.0);',
    ],
    answer: 0,
    difficulty: 'medium',
  },
  {
    question: 'What is the difference between a let and a const declaration in WGSL?',
    options: [
      'let is mutable, while const is immutable',
      'let is used for runtime variables, while const is used for compile-time variables',
      'let is immutable, while const is mutable',
      'let is used for compile-time variables, while const is used for runtime variables',
    ],
    answer: 1,
    difficulty: 'hard',
  },
  {
    question: 'What does @workgroup_size(16, 16) mean in a WGSL compute shader?',
    options: [
      'It specifies the global dispatch size for the GPU.',
      'It limits the number of threads a GPU can execute.',
      'It initializes a 16x16 matrix.',
      'It specifies the size of the local workgroup as 16x16 threads.',
    ],
    answer: 3,
    difficulty: 'hard',
  },
  {
    question: 'Which of the following is a valid use case for a WGSL fragment shader?',
    options: [
      'Transforming the vertices of a 3D model',
      'Performing parallel computations on the GPU',
      'Calculating the lighting of a 3D scene',
      'Handling user input events',
    ],
    answer: 2,
    difficulty: 'hard',
  },
  {
    question: 'How can runtime-sized arrays be used in WGSL?',
    options: [
      'Only in vertex shaders by declaring them inside function scope',
      'Only in fragment shaders by declaring them inside function scope',
      'Only with storage buffer resources',
      'They are not available in WGSL',
    ],
    answer: 2,
    difficulty: 'hard',
  },
  {
    question: 'What is the purpose of Atmic types in WGSL?',
    options: [
      'Do bitwise operations on integers in shaders without synchronization',
      'synchronize between different invocations executing a shader',
      'To do 64-bit floating-point operations',
      'To perform matrix transformations in shaders',
    ],
    answer: 1,
    difficulty: 'hard',
  },
];
