import { create } from 'zustand';
import {
  //  devtools,
  persist,
} from 'zustand/middleware';
import packageJson from '@/../package.json';

export const defaultCode = `\
@vertex
fn vtx_main(@builtin(vertex_index) vertex_index : u32) -> @builtin(position) vec4f {
  
}

@fragment
fn frag_main() -> @location(0) vec4f {
  
}
` as const;

export const preWrittenCode = [
  {
    name: 'simple-triangle',
    code: `\
@vertex
fn vtx_main(@builtin(vertex_index) vertex_index : u32) -> @builtin(position) vec4f {
  const pos = array(
    vec2( 0.0,  0.5),
    vec2(-0.5, -0.5),
    vec2( 0.5, -0.5)
  );
  return vec4f(pos[vertex_index], 0, 1);
}

@fragment
fn frag_main() -> @location(0) vec4f {
  return vec4(1, 1, 1, 1); // rgb
}
`,
  },
  {
    name: 'colorful-triangle',
    code: `\
struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) Color : vec4<f32>
};

@vertex
fn vtx_main(@builtin(vertex_index) v_id: u32) -> VertexOutput {

    //pre-bake positions and colors, for now.
    var positions = array<vec2<f32>, 3> (
        vec2<f32>( 0.0,  0.5),
        vec2<f32>(-0.5, -0.5),
        vec2<f32>( 0.5, -0.5)
    );

    var colors = array<vec3<f32>, 3> (
        vec3<f32>(1.0, 0.0, 0.0),
        vec3<f32>(0.0, 1.0, 0.0),
        vec3<f32>(0.0, 0.0, 1.0)
    );

    var output : VertexOutput;
    output.Position = vec4<f32>(positions[v_id], 0.0, 1.0);
    output.Color = vec4<f32>(colors[v_id], 1.0);

    return output;
}

@fragment
fn frag_main(@location(0) Color: vec4<f32>) -> @location(0) vec4<f32> {
    return Color;
}

`,
  },
  {
    name: 'dynamic-triangle',
    code: `\
@binding(0) @group(0) var<uniform> frame : u32;
@vertex
fn vtx_main(@builtin(vertex_index) vertex_index : u32) -> @builtin(position) vec4f {
  const pos = array(
    vec2( 0.0,  0.5),
    vec2(-0.5, -0.5),
    vec2( 0.5, -0.5)
  );

  return vec4f(pos[vertex_index], 0, 1);
}

@fragment
fn frag_main() -> @location(0) vec4f {
  return vec4(1, sin(f32(frame) / 128), 0, 1);
}
`,
  },
  {
    name: '404 dvd-logo',
    code: `\
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
`,
  },
  {
    name: 'fireworks',
    code: `\
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
`,
  },
  {
    name: 'wave_effect',
    code: `\
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
`,
  },
] as const;

interface ShaderState {
  /** one of the preWrittenCode's name or a custom one */
  // selectedCodeName: (typeof preWrittenCode)[number]["name"] | `custom${number}` | string | null;
  /** all the saved codes on user's local storage */
  savedCustomCodes: {
    name: string;
    code: string;
    currentActive: boolean;
  }[];
  /** change the selected code
   * @param code the new code
   * @param key the key to save the code in savedCustomCodes. Default is "custom1" but can be any string if user wants to save multiple custom codes
   */
  // stackHistory: string[];
  changeCode: (code: string, key?: string, setActive?: boolean) => void;
  setActiveModel: (name: string) => void;
  removeModel: (name: string) => void;
}

const useShaderStore = create<ShaderState>()(
  // devtools(
  persist(
    (set, get) => ({
      // selectedCodeName: preWrittenCode[0].name,
      savedCustomCodes: [...preWrittenCode].map((c, i) => ({ name: c.name, code: c.code, currentActive: i === 0 })),
      // stackHistory: [],
      changeCode: (code, name, setActive = false) => {
        // change the code of the model with the name or create a new one
        set({
          // @ts-expect-error
          savedCustomCodes: [
            ...get().savedCustomCodes.map((c) => ({
              ...c,
              code: c.name === name ? code : c.code,
              currentActive: setActive ? c.name === name : c.currentActive,
            })),
            ...(get().savedCustomCodes.find((c) => c.name === name) ? [] : [{ name, code, currentActive: setActive }]),
          ],
        });
      },
      setActiveModel: (name) => {
        set({ savedCustomCodes: get().savedCustomCodes.map((c) => ({ ...c, currentActive: c.name === name })) });
      },
      removeModel: (name) => {
        // filter out the code with the name
        set({ savedCustomCodes: get().savedCustomCodes.filter((c) => c.name !== name) });
      },
    }),
    {
      // blacklist the stackHistory from being saved
      // partialize: (state) => {
      //   const { stackHistory, ...rest } = state;
      //   return rest;
      // },
      name: 'shaderStore',
      // merge: (persisted: any, currentState) => {
      //   return _.merge(currentState, persisted);
      // },

      version: parseFloat(packageJson.version),
    }
  )
  //   {
  //     enabled: process.env.NODE_ENV === "development",
  //   }
  // )
);

export default useShaderStore;
