import { create } from 'zustand';
import dvd404 from '@/components/global/404.wgsl';
import fireworksShader from '@/app/quiz/score/fireWorks.wgsl';
import waveShader from '@/app/step/introduction/coolEffect.wgsl';
import { persist } from 'zustand/middleware';
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
  return vec4(1, 0, 0, 1); // rgb
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
    code: dvd404,
  },
  {
    name: 'fireworks',
    code: fireworksShader,
  },
  {
    name: 'wave_effect',
    code: waveShader,
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
  // persist(
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
  })
  // ),
  // {
  //   name: 'shaderStore',
  //   version: parseFloat(packageJson.version),
  // }
);

export default useShaderStore;
