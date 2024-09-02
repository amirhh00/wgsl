// WebGPU Shader Language (WGSL) example

@binding(0) @group(0) var<uniform> frame : u32;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vtx_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  // return the whole screen as a square
  var pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, 3.0),
    vec2<f32>(3.0, -1.0),
    vec2<f32>(-1.0, -1.0)
  );

  let position = vec4f(pos[vertexIndex], 0.0, 1.0);
  let uv = position.xy * 2.;
  return VertexOutput(
    position,
    uv
  );
}

const NUM_EXPLOSION: i32 = 15;
const NUM_PARTICLES: i32 = 100;

fn hash(seed: f32) -> f32 {
  return fract(cos(seed * 3623.123) * 9454.863);
}

fn hash2(seed: f32) -> vec2<f32> {
  let x = fract(sin(seed * 421.5123) * 1232.123);
  let y = fract(cos(seed * x * 3623.123) * 35274.863);
  return vec2<f32>(x, y);
}

fn hash2_polar(seed: f32) -> vec2<f32> {
  let angle = fract(sin(seed * 6871.3123) * 192.583) * 6.28;
  return vec2<f32>(cos(angle), sin(angle));
}

fn explosion(uv: vec2<f32>, t: f32) -> f32 {
  var result: f32 = 0.0;
  for (var i: i32 = 0; i < NUM_PARTICLES; i = i + 1) {
    let fi = f32(i);
    let tt = hash(fi + 4.0);
    let dir = hash2_polar(fi + 1.0) * tt + vec2<f32>(0.0, -0.35);
    let d = length(uv - dir * t);

    let alpha = smoothstep(0.001, 0.01, t);
    var brightness = mix(0.0005, 0.001, alpha);

    brightness *= sin(t * 20.0 * fi) * 0.25 + 0.55;
    brightness *= smoothstep(0.75, 1.0, t);
    result += brightness / d;
  }
  return result;
}

@fragment
fn frag_main(fsInput: VertexOutput) -> @location(0) vec4f {
  var col: vec3<f32> = vec3<f32>(0.0);
  let T = f32(frame) / 1000.0;
  var tail_scaler: f32 = 0.0;
  for (var i: i32 = 0; i < NUM_EXPLOSION; i = i + 1) {
      let time_offset = hash(f32(i) + 1.0);
      let t = fract(T + time_offset);
      let id = floor(T + time_offset);
      let offset = hash2(f32(i) * id) - vec2<f32>(0.5, 0.5);
      var color = vec3<f32>(0.31 * f32(i), 0.69 * f32(i + 10), 0.45) * 100.0 * f32(i);
      color = sin(color) * 0.5 + 0.5;
      col += explosion(fsInput.uv - offset * 2.0, t) * color;
  }
  return vec4<f32>(col, 0.5);
}