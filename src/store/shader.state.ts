import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import packageJson from "@/../package.json";

export const defaultCode = `\
@binding(0) @group(0) var<uniform> frame : u32;
@vertex
fn vtx_main(@builtin(vertex_index) vertex_index : u32) -> @builtin(position) vec4f {
  
}

@fragment
fn frag_main() -> @location(0) vec4f {
  
}
` as const;

export const preWrittenCode = [
  {
    name: "simple-triangle",
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
  // ... more pre-written codes
] as const;

interface ShaderState {
  /** one of the preWrittenCode's name or a custom one */
  selectedCodeName: (typeof preWrittenCode)[number]["name"] | `custom${number}` | string;
  /** all the saved codes on user's local storage */
  savedCustomCodes: Record<string, string>;
  /** change the selected code
   * @param code the new code
   * @param key the key to save the code in savedCustomCodes. Default is "custom1" but can be any string if user wants to save multiple custom codes
   */
  stackHistory: string[];
  changeCode: (code: string, key?: string) => void;
  setActiveModel: (name: string) => void;
  removeModel: (name: string) => void;
}

const useShaderStore = create<ShaderState>()(
  devtools(
    persist(
      (set, get) => ({
        selectedCodeName: preWrittenCode[0].name,
        savedCustomCodes: {},
        stackHistory: [],
        changeCode: (code, key) => {
          // if key is one of the pre-written codes, create a new key with the name "custom + savedCustomCodes.length" and save the code there instead and set the selectedCodeName to the new key
          if (preWrittenCode.find((c) => c.name === key)) {
            key = `custom${Object.keys(get().savedCustomCodes).length + 1}`;
            if (get().savedCustomCodes[key]) {
              let max = 0;
              for (const customCodeName in get().savedCustomCodes) {
                if (customCodeName.startsWith("custom")) {
                  const num = parseInt(customCodeName.replace("custom", ""));
                  if (num > max) max = num;
                }
              }
              key = `custom${max + 1}`;
            }
          }

          set({ savedCustomCodes: { ...get().savedCustomCodes, [key!]: code }, selectedCodeName: key });
        },
        setActiveModel: (name) => {
          set({ selectedCodeName: name, stackHistory: [...get().stackHistory, name] });
        },
        removeModel: (name) => {
          // if (Object.keys(get().savedCustomCodes).length === 1) return;
          const newCustomCodes = { ...get().savedCustomCodes };
          delete newCustomCodes[name];
          let lastKey = get().stackHistory[get().stackHistory.length - 2] || preWrittenCode[0].name;
          // if name does not exist in savedCustomCodes, select preWrittenCode[0].name
          if (!newCustomCodes[name]) lastKey = preWrittenCode[0].name;
          get().stackHistory.filter((key) => key !== name);
          // get the last key from stackHistory and set it as the selectedCodeName and remove the last key from stackHistory
          set({ savedCustomCodes: newCustomCodes, selectedCodeName: lastKey, stackHistory: get().stackHistory.slice(0, -1) });
        },
      }),
      {
        // blacklist the stackHistory from being saved
        partialize: (state) => {
          const { stackHistory, ...rest } = state;
          return rest;
        },
        name: "shaderStore",
        version: parseFloat(packageJson.version),
      }
    ),
    {
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

export default useShaderStore;
