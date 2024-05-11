// MyCanvasComponent.tsx
import React, { useState } from "react";
// import { WGSL_debug } from "wgsl-debug";
// import { WGSL_debug_table } from "wgsl-debug-table";
import computeShaderCode from "@/app/showcases/heavyMathCalculation/wgsl/computeShader.wgsl";
import { ResultResponse } from "@/@types/etc";
import Spinner from "./global/Spinner";

interface WebGPUCanvasProps {
  vector1: Float32Array;
  vector2: Float32Array;
}

type WGSLResultResponse = ResultResponse & { duration2: number };

const WebGPUCanvas: React.FC<WebGPUCanvasProps> = ({ vector1, vector2 }) => {
  const [res, setRes] = useState<WGSLResultResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function initWebGPU() {
    // Initialize GPU, context, device, etc.
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("WebGPU not supported");
    setIsLoading(true);
    const device = await adapter.requestDevice();

    // Create GPU buffers for the arrays
    const array1Buffer = device.createBuffer({
      label: "Array 1 Buffer",
      size: vector1.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(array1Buffer, 0, vector1.buffer);
    array1Buffer.unmap();

    const array2Buffer = device.createBuffer({
      label: "Array 2 Buffer",
      size: vector2.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(array2Buffer, 0, vector2.buffer);
    array2Buffer.unmap();

    const resultBuffer = device.createBuffer({
      label: "Result Buffer",
      size: vector1.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    });

    const readBuffer = device.createBuffer({
      size: vector1.byteLength,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    // create shader module
    const computeShaderModule = device.createShaderModule({
      label: "Compute Shader Module",
      code: computeShaderCode,
    });
    // Create pipeline, bind groups, etc., using the shader module and buffers
    const bindGroupLayout = device.createBindGroupLayout({
      label: "Compute Bind Group Layout",
      entries: [
        { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" as any } },
        { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" as any } },
        { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" as any } },
      ],
    });

    const pipelineLayout = device.createPipelineLayout({
      label: "Cell Pipeline Layout",
      bindGroupLayouts: [bindGroupLayout],
    });

    const computePipeline = device.createComputePipeline({
      label: "Compute Pipeline",
      layout: pipelineLayout,
      compute: { module: computeShaderModule, entryPoint: "main" },
    });

    const bindGroup = device.createBindGroup({
      label: "Compute Bind Group 1",
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: array1Buffer } },
        { binding: 1, resource: { buffer: array2Buffer } },
        { binding: 2, resource: { buffer: resultBuffer } },
      ],
    });

    const encoder = device.createCommandEncoder();
    const computePass = encoder.beginComputePass();
    computePass.setPipeline(computePipeline), computePass.setBindGroup(0, bindGroup);
    const workgroupSize = 64; // This should match your @workgroup_size in WGSL
    const numItems = vector1.length;
    const workgroupsX = Math.min(65535, Math.max(numItems, Math.ceil(numItems / workgroupSize)));
    const workgroupsY = Math.ceil(numItems / (workgroupSize * workgroupsX));

    // Dispatch the compute operation
    computePass.dispatchWorkgroups(workgroupsX, workgroupsY);
    computePass.end();

    // Copy the data from the resultBuffer to the readBuffer
    encoder.copyBufferToBuffer(resultBuffer, 0, readBuffer, 0, vector1.byteLength);
    const startTime = performance.now();
    // Submit the commands to the GPU
    device.queue.submit([encoder.finish()]);

    // Wait for the GPU to finish executing the commands
    await device.queue.onSubmittedWorkDone();
    const endTime = performance.now();
    const duration = endTime - startTime;
    // Map the result buffer for reading
    await readBuffer.mapAsync(GPUMapMode.READ);
    const arrayBufferData = new Float32Array(readBuffer.getMappedRange());
    const endTime2 = performance.now();
    const duration2 = endTime2 - startTime;

    // Now you can access the data from the result buffer
    // console.log(arrayBufferData);
    setRes({ result: arrayBufferData, duration, duration2 });
    setIsLoading(false);
    // readBuffer.unmap();
  }

  // async function initWebgpu2() {
  //   //global variables
  //   const GRID_SIZE = 64;
  //   const UPDATE_INTERVAL = 50;
  //   const WORKGROUP_SIZE = 8;
  //   let chance = 0.5;

  //   //get the canvas element
  //   const canvas = canvasRef.current!;

  //   // WebGPU device initialization
  //   if (!navigator.gpu) {
  //     //set the DOM with the id MESSAGE to the error message
  //     document.getElementById("MESSAGE")!.innerHTML = "WebGPU not supported on this browser.";
  //     throw new Error("WebGPU not supported on this browser.");
  //   }

  //   const adapter = await navigator.gpu.requestAdapter();
  //   if (!adapter) {
  //     throw new Error("No appropriate GPUAdapter found.");
  //   }

  //   const device = await adapter.requestDevice();

  //   // Canvas configuration
  //   const context = canvas.getContext("webgpu")!;
  //   const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
  //   context.configure({
  //     device: device,
  //     format: canvasFormat,
  //   });

  //   // Create a buffer that will hold the vertices of the grid.
  //   //the vertices from -1 to 1
  //   const vertices = new Float32Array([
  //     //first triangle coordinates
  //     -1, -1, 1, -1, 1, 1,
  //     //second triangle coordinates
  //     -1, -1, 1, 1, -1, 1,
  //   ]);

  //   // Create a buffer to store the vertices in GPU memory.
  //   const vertexBuffer = device.createBuffer({
  //     label: "Cell vertices",
  //     size: vertices.byteLength,
  //     usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  //   });
  //   //write the vertices to the buffer
  //   device.queue.writeBuffer(vertexBuffer, 0, vertices);

  //   // Create a vertex buffer layout that describes the vertex buffer.
  //   const vertexBufferLayout = {
  //     arrayStride: 8,
  //     attributes: [
  //       {
  //         format: "float32x2" as any,
  //         offset: 0,
  //         shaderLocation: 0, // Position. Matches @location(0) in the @vertex shader.
  //       },
  //     ],
  //   };

  //   // Create the bind group layout and pipeline layout.
  //   const bindGroupLayout = device.createBindGroupLayout({
  //     // @group(0) @binding(0) var<uniform> grid: vec2f;
  //     // @group(0) @binding(1) var<storage> cellStateIn: array<u32>;
  //     // @group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;
  //     // @group(0) @binding(3) var<storage, read_write> cellStateAge: array<u32>;
  //     label: "Cell Bind Group Layout",
  //     entries: [
  //       {
  //         binding: 0,
  //         visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
  //         buffer: {}, // Grid uniform buffer
  //       },
  //       {
  //         binding: 1,
  //         visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
  //         buffer: { type: "read-only-storage" as any }, // Cell state input buffer
  //       },
  //       {
  //         binding: 2,
  //         visibility: GPUShaderStage.COMPUTE,
  //         buffer: { type: "storage" as any }, // Cell state output buffer
  //       },
  //       {
  //         binding: 3,
  //         visibility: GPUShaderStage.COMPUTE,
  //         buffer: { type: "storage" as any }, // Cell state age buffer
  //       },
  //     ],
  //   });

  //   const pipelineLayout = device.createPipelineLayout({
  //     label: "Cell Pipeline Layout",
  //     bindGroupLayouts: [bindGroupLayout],
  //   });

  //   // Create the shader that will render the cells.
  //   const cellShaderModule = device.createShaderModule({
  //     label: "Cell shader",
  //     code: `
  // struct VertexOutput {
  //     @builtin(position) position: vec4f,
  //     @location(0) cell: vec2f,
  //   };

  //   @group(0) @binding(0) var<uniform> grid: vec2f;
  //   @group(0) @binding(1) var<storage> cellState: array<u32>;

  //   @vertex
  //   fn vertexMain(@location(0) position: vec2f,
  //                 @builtin(instance_index) instance: u32) -> VertexOutput {
  //     var output: VertexOutput;

  //     let i = f32(instance);
  //     let cell = vec2f(i % grid.x, floor(i / grid.x));

  //     let scale = f32(cellState[instance]);
  //     let cellOffset = cell / grid * 2;
  //     let gridPos = (position*scale+1) / grid - 1 + cellOffset;

  //     output.position = vec4f(gridPos, 0, 1);
  //     output.cell = cell / grid;
  //     return output;
  //   }

  //   @fragment
  //   fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  //     return vec4f(input.cell, 1.0 - input.cell.x, 1);
  //   }
  // `,
  //   });

  //   // Create a pipeline that renders the cell.
  //   const cellPipeline = device.createRenderPipeline({
  //     label: "Cell pipeline",
  //     layout: pipelineLayout,
  //     vertex: {
  //       module: cellShaderModule,
  //       entryPoint: "vertexMain",
  //       buffers: [vertexBufferLayout],
  //     },
  //     fragment: {
  //       module: cellShaderModule,
  //       entryPoint: "fragmentMain",
  //       targets: [
  //         {
  //           format: canvasFormat,
  //         },
  //       ],
  //     },
  //   });

  //   // Create the compute shader that will process the game of life simulation.
  //   const simulationShaderModule = device.createShaderModule({
  //     label: "Life simulation shader",
  //     code: `
  //   @group(0) @binding(0) var<uniform> grid: vec2f;

  //   @group(0) @binding(1) var<storage> cellStateIn: array<u32>;
  //   @group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;
  //   @group(0) @binding(3) var<storage, read_write> cellStateAge: array<u32>;

  //   fn cellIndex(cell: vec2u) -> u32 {
  //     return (cell.y % u32(grid.y)) * u32(grid.x) +
  //            (cell.x % u32(grid.x));
  //   }

  //   fn cellActive(x: u32, y: u32) -> u32 {
  //     return cellStateIn[cellIndex(vec2(x, y))];
  //   }

  //   @compute @workgroup_size(${WORKGROUP_SIZE}, ${WORKGROUP_SIZE})
  //   fn computeMain(@builtin(global_invocation_id) cell: vec3u) {
  //     // Determine how many active neighbors this cell has.
  //     let activeNeighbors = cellActive(cell.x+1, cell.y+1) +
  //                           cellActive(cell.x+1, cell.y) +
  //                           cellActive(cell.x+1, cell.y-1) +
  //                           cellActive(cell.x, cell.y-1) +
  //                           cellActive(cell.x-1, cell.y-1) +
  //                           cellActive(cell.x-1, cell.y) +
  //                           cellActive(cell.x-1, cell.y+1) +
  //                           cellActive(cell.x, cell.y+1);

  //     let i = cellIndex(cell.xy);

  //     // Conway's game of life rules:
  //     switch activeNeighbors {
  //       case 2: { // Active cells with 2 neighbors stay active.
  //         cellStateOut[i] = cellStateIn[i];
  //         cellStateAge[i] += 1;
  //       }
  //       case 3: { // Cells with 3 neighbors become or stay active.
  //         cellStateOut[i] = 1;
  //         cellStateAge[i] += 1;
  //       }
  //       default: { // Cells with < 2 or > 3 neighbors become inactive.
  //         cellStateOut[i] = 0;
  //         cellStateAge[i] = 0;
  //       }
  //     }
  //   }
  // `,
  //   });

  //   // Create a compute pipeline that updates the game state.
  //   const simulationPipeline = device.createComputePipeline({
  //     label: "Simulation pipeline",
  //     layout: pipelineLayout,
  //     compute: {
  //       module: simulationShaderModule,
  //       entryPoint: "computeMain",
  //     },
  //   });

  //   // Create a uniform buffer that describes the grid.
  //   const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]);
  //   const uniformBuffer = device.createBuffer({
  //     label: "Grid Uniforms",
  //     size: uniformArray.byteLength,
  //     usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  //   });
  //   device.queue.writeBuffer(uniformBuffer, 0, uniformArray);

  //   // Create an array representing the active state of each cell.
  //   const cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE);
  //   const cellStateAgeArray = new Uint32Array(GRID_SIZE * GRID_SIZE);

  //   // Create two storage buffers to hold the cell state.
  //   const cellStateStorage = [
  //     device.createBuffer({
  //       label: "Cell State A",
  //       size: cellStateArray.byteLength,
  //       usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  //     }),
  //     device.createBuffer({
  //       label: "Cell State B",
  //       size: cellStateArray.byteLength,
  //       usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  //     }),
  //     device.createBuffer({
  //       label: "Cell State Age A",
  //       size: cellStateArray.byteLength,
  //       usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  //     }),
  //   ];

  //   let step = 0;
  //   function initialiseGrid() {
  //     // Set each cell to a random state, then copy the JavaScript array into
  //     // the storage buffer.
  //     for (let i = 0; i < cellStateArray.length; ++i) {
  //       cellStateArray[i] = Math.random() > chance ? 1 : 0;
  //     }
  //     device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray);
  //     step = 0;
  //   }
  //   initialiseGrid();

  //   // Create a bind group to pass the grid uniforms into the pipeline
  //   const bindGroups = [
  //     device.createBindGroup({
  //       label: "Cell renderer bind group A",
  //       layout: bindGroupLayout,
  //       entries: [
  //         {
  //           binding: 0,
  //           resource: { buffer: uniformBuffer },
  //         },
  //         {
  //           binding: 1,
  //           resource: { buffer: cellStateStorage[0] },
  //         },
  //         {
  //           binding: 2,
  //           resource: { buffer: cellStateStorage[1] },
  //         },
  //         //age of cells in group A
  //         {
  //           binding: 3,
  //           resource: { buffer: cellStateStorage[2] },
  //         },
  //       ],
  //     }),
  //     device.createBindGroup({
  //       label: "Cell renderer bind group B",
  //       layout: bindGroupLayout,
  //       entries: [
  //         {
  //           binding: 0,
  //           resource: { buffer: uniformBuffer },
  //         },
  //         {
  //           binding: 1,
  //           resource: { buffer: cellStateStorage[1] },
  //         },
  //         {
  //           binding: 2,
  //           resource: { buffer: cellStateStorage[0] },
  //         },
  //         //age of cells in group B
  //         {
  //           binding: 3,
  //           resource: { buffer: cellStateStorage[2] },
  //         },
  //       ],
  //     }),
  //   ];

  //   function updateGrid() {
  //     const encoder = device.createCommandEncoder();

  //     // Start a compute pass
  //     const computePass = encoder.beginComputePass();

  //     computePass.setPipeline(simulationPipeline), computePass.setBindGroup(0, bindGroups[step % 2]);
  //     const workgroupCount = Math.ceil(GRID_SIZE / WORKGROUP_SIZE);
  //     computePass.dispatchWorkgroups(workgroupCount, workgroupCount);
  //     computePass.end();

  //     step++; // Increment the step count
  //     document.getElementById("generations")!.innerHTML = "Generations: " + (step - 1);

  //     // Start a render pass
  //     const pass = encoder.beginRenderPass({
  //       colorAttachments: [
  //         {
  //           view: context.getCurrentTexture().createView(),
  //           loadOp: "clear" as any,
  //           clearValue: { r: 0, g: 0, b: 0.4, a: 1.0 },
  //           storeOp: "store" as any,
  //         },
  //       ],
  //     });

  //     // Draw the grid.
  //     pass.setPipeline(cellPipeline);
  //     pass.setBindGroup(0, bindGroups[step % 2]);
  //     pass.setVertexBuffer(0, vertexBuffer);
  //     pass.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE);

  //     // End the render pass and submit the command buffer
  //     pass.end();
  //     device.queue.submit([encoder.finish()]);
  //   }

  //   var intervalID: any = 0;

  //   //create function to start the game
  //   function startGame() {
  //     if (intervalID == 0) {
  //       intervalID = setInterval(updateGrid, UPDATE_INTERVAL);
  //     }
  //   }

  //   //create function to start the game
  //   function nextIteration() {
  //     updateGrid();
  //   }

  //   //create function to pause the game
  //   function pauseGame() {
  //     clearInterval(intervalID);
  //     intervalID = 0;
  //   }

  //   function resetGame() {
  //     initialiseGrid();
  //     step = 0;
  //     updateGrid();
  //     pauseGame();
  //   }

  //   //step once to initiate the game
  //   updateGrid();

  //   //start the game when the start button is clicked
  //   document.getElementById("start")!.addEventListener("click", startGame);

  //   //pause the game when the pause button is clicked
  //   document.getElementById("pause")!.addEventListener("click", pauseGame);

  //   //go to the next step when the step button is clicked
  //   document.getElementById("next")!.addEventListener("click", nextIteration);

  //   //reset the game when the reset button is clicked
  //   document.getElementById("reset")!.addEventListener("click", resetGame);
  // }

  //   useEffect(() => {
  //     if (!vector1 || !vector2) return;
  //     initWebgpu2();
  //   }, [vector1, vector2]);
  if (!navigator.gpu) {
    return <div className="text-center text-red-600 outline outline-red-600 py-3 rounded-md">WebGPU not supported on this browser!</div>;
  }
  return (
    <>
      {vector1 && vector2 && (
        <button className="btn" onClick={initWebGPU}>
          Run in webGpu <Spinner isLoading={isLoading} />
        </button>
      )}
      {res && (
        <pre>
          Result:{" "}
          {Array.from(res.result.slice(0, 10))
            .map((v) => v.toFixed(2))
            .join(", ")}
          {res.result.length > 10 ? "..." : ""} <br />
          Duration: <b>{res.duration}</b>ms <br />
          Duration after copying data from gpu to cpu: <b>{res.duration2}</b>ms
        </pre>
      )}
    </>
  );
};

export default WebGPUCanvas;
