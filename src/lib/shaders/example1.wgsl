@binding(0) @group(0) var<uniform> frame : u32;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

fn rotate2D(pos: vec2<f32>, angle: f32) -> vec2<f32> {
  let c = cos(angle);
  let s = sin(angle);
  return vec2<f32>(
    pos.x * c - pos.y * s,
    pos.x * s + pos.y * c
  );
}

@vertex
fn vtx_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  // return the whole screen as a square
  var vertices : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(3.0, -1.0),
    vec2<f32>(-1.0, 3.0)
  );

  let position = vec4<f32>(vertices[u32(vertexIndex)], 0.0, 1.0);
  let uv =  (position.xy + vec2<f32>(1.0, 1.0)) / vec2<f32>(2.0, 2.0);
  return VertexOutput(
    position,
    uv
  );
}

@fragment
fn frag_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
  // No need for adjustment if UVs are defined from 0 to 1
  let adjusted_uv = uv; 
  
  let center = vec2<f32>(0.5, 0.5);
  let radius = 0.4;
  
  let rotation_speed = 0.008;
  let rotation_angle = f32(frame) * rotation_speed;
  let rotated_uv = rotate2D(adjusted_uv - center, rotation_angle) + center;
  
  // Calculate distance from the center of the circle
  let dist = distance(adjusted_uv, center);
  
  // Smooth the edge of the circle using smoothstep function
  let smoothness = 0.02;
  let smooth_dist = smoothstep(radius , radius - smoothness, dist);
  
  // Check if the pixel is inside the circle
  if (dist < radius) {
    // Return a color based on the UV coordinates
    return vec4<f32>(rotated_uv, 1.0, 1.0) * smooth_dist; // Color based on UV coordinates
  }
  
  // Return a default color for debugging purposes
  return vec4<f32>(0.0, 0.0, 0.0, 0.0);
}