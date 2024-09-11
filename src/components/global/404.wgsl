// WebGPU Shader Language (WGSL) 404 example

@binding(0) @group(0) var<uniform> frame : u32;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vtx_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  // return the whole screen as two triangles
  var pos = array<vec2<f32>,6 >(
    // triangle bottom
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(1.0, -1.0),
    vec2<f32>(1.0, 1.0),
    // triangle top
    vec2<f32>(1.0, 1.0),
    vec2<f32>(-1.0, 1.0),
    vec2<f32>(-1.0, -1.0)
  );
  let position = vec4f(pos[vertexIndex], 0.0, 1.0);
  let uv = vec2<f32>(position.x * 1.0, position.y * -1.0);
  return VertexOutput(
    position,
    uv
  );
}

@group(1) @binding(0)
var texSampler: sampler;

@group(1) @binding(1)
var tex: texture_2d<f32>;

@fragment
fn frag_main(fsInput: VertexOutput) -> @location(0) vec4f {
  var col: vec3<f32> = vec3<f32>(1.0);
  // the dvd moving logo example but with a basic circle instead moving around the screen and bouncing off the edges
  let xsize = 0.15;
  let ysize = 0.15;

  let xtime = 9.;
  let ytime = 16.;
  let globaltime = 0.00004;
  var uv = fsInput.uv;
  let t = f32(frame);
  
  uv.x += (-1. + xsize * 2.) + (abs(fract(t * xtime * globaltime) * 2. - 1.) - 0.) * (1. - (-1. + xsize * 2.)) / (1. - 0.);
  uv.y += (-1. + ysize * 2.) + (abs(fract(t * ytime * globaltime) * 2. - 1.) - 0.) * (1. - (-1. + ysize * 2.)) / (1. - 0.);
    
  let textureColor = textureSample(tex, texSampler, uv * vec2f(3.3));


  let x1: f32 = step(abs(uv.x+-0.15),0.15);
  let y1: f32 = step(abs(uv.y+-0.15),0.15);

  let xy1 = x1 * y1;
  let xy2 = xy1 * col;

  return textureColor * vec4<f32>(xy2, 1.0);
}