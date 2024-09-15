// WebGPU Shader Language (WGSL) example

/* frame is a uniform variable that is passed from the JavaScript side */
@binding(0) @group(0) var<uniform> frame : u32;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vtx_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  // return the whole screen as two triangles from -1.0 to 1.0
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
  // uv should be in the range of 0.0 to 1.0
  let uv = vec2<f32>(position.x * 0.5 + 0.5, position.y * -0.5 + 0.5);
  return VertexOutput(
    position,
    uv
  );
}

@fragment
fn frag_main(fsInput: VertexOutput) -> @location(0) vec4<f32> {
  let speed = 0.01;
  let s = f32(frame) * speed;

  let alpha: f32 = 0.01;

  let uv = fsInput.uv;

  // a wave effect
  let wave = sin(uv.x * 10.0 + s) * 0.1;
  let wave2 = sin(uv.y * 10.0 + s) * 0.1;
  let wave3 = sin(uv.x * 10.0 + uv.y * 10.0 + s) * 0.1;
  let wave4 = sin(uv.x * 10.0 - uv.y * 10.0 + s) * 0.1;

  let rgb = wave + wave2 + wave3 + wave4;
  
  if rgb > 0.01 {
    return vec4<f32>(0.02, 0.04, 0.06, alpha);
  }
  
  return vec4<f32>(0.0, 0.0, 0.0, 0.0);
}