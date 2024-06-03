"use client";

import { useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import useShaderStore, { defaultCode, preWrittenCode } from "@/store/shader.state";
import MonacoEditor, { Monaco } from "@monaco-editor/react";
import type { editor as Editor } from "monaco-editor";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Wgsllogo from "@/components/global/wgsl.logo";
import ScrollContainer from "react-indiana-drag-scroll";

const WGSLMonacoEditor = () => {
  const { changeCode, selectedCodeName, savedCustomCodes, setActiveModel, removeModel } = useShaderStore();
  // const [models, setModels] = useState<monaco.editor.ITextModel[]>([]);
  // const [activeModel, setActiveModel] = useState<string | undefined>(undefined);
  const editorRef = useRef<Editor.IStandaloneCodeEditor | null>(null);
  const models = [...preWrittenCode, ...Object.entries(savedCustomCodes).map(([key, value]) => ({ name: key, code: value }))];

  function handleEditorDidMount(editor: Editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    // monaco.languages.registerCompletionItemProvider("wgsl", {
    //   provideCompletionItems: function (model, position) {
    //     // compute context-aware suggestions here
    //     return {
    //       suggestions: [
    //         {
    //           label: "textureSample",
    //           kind: monaco.languages.CompletionItemKind.Function,
    //           insertText: "textureSample(${1:sampler}, ${2:coords})",
    //           insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    //           documentation: "Sample a texture.",
    //           range: {
    //             startLineNumber: position.lineNumber,
    //             startColumn: position.column,
    //             endLineNumber: position.lineNumber,
    //             endColumn: position.column,
    //           },
    //         },
    //         // ... more completion items
    //       ],
    //     };
    //   },
    // });
  }

  const editorWillMount = (monaco: Monaco) => {
    models.map((model) => {
      // if there is a model with the same name, don't add it
      if (monaco.editor.getModel(monaco.Uri.parse(`file:///${model.name}.wgsl`))) return;
      monaco.editor.createModel(model.code, "wgsl", monaco.Uri.parse(`file:///${model.name}.wgsl`));
    });
    setActiveModel(models[0].name);
  };

  const handleOpenNewModel = () => {
    let newModelName = `custom${Object.keys(savedCustomCodes).length + 1}`;
    if (savedCustomCodes[newModelName]) {
      let max = 0;
      for (const customCodeName in savedCustomCodes) {
        if (customCodeName.startsWith("custom")) {
          const num = parseInt(customCodeName.replace("custom", ""));
          if (num > max) max = num;
        }
      }
      newModelName = `custom${max + 1}`;
    }
    changeCode(defaultCode, newModelName);
    setActiveModel(newModelName);
  };

  const handleRemoveModel = (name: string) => {
    removeModel(name);
  };

  return (
    <>
      <Select defaultValue="apple">
        <SelectTrigger className="w-[280px] mb-4 !ring-0">
          <SelectValue placeholder="Select a sample code" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="tabs-container flex items-center bg-[#1e1e1e] [&_*]:!outline-none">
        <ul className="flex tabs overflow-x-auto">
          {models.map((model) => (
            <li key={model.name} draggable className={`tab px-2 flex justify-around items-center relative ${selectedCodeName === model.name ? "active" : ""}`}>
              <Wgsllogo className="w-5 h-5" />
              <button
                className={`monacoMenuBtn whitespace-nowrap`}
                onClick={(e) => setActiveModel(model.name)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (e.button === 1) {
                    removeModel(model.name);
                  }
                }}
              >
                {`${model.name}.wgsl`}
              </button>
              <button onClick={() => handleRemoveModel(model.name)} className="closeBtn">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </li>
          ))}
        </ul>
        <div className="tab !bg-transparent !border-l-2 mr-2 !border-l-white/40 !px-3 !ml-2 h-[65%] relative">
          <button onClick={handleOpenNewModel} className="closeBtn !p-0 h-full absolute bottom-[0px] left-1 px-1 text-2xl font-extralight leading-[0]">
            <p className="p-1 pb-[7px]">+</p>
          </button>
        </div>
      </div>

      {/* <Skeleton className="w-full h-full max-h-[512px] rounded-none relative" /> */}
      <div className="w-full h-full relative">
        <MonacoEditor
          className="absolute top-0 left-0 w-full h-full rounded-none z-10"
          onMount={handleEditorDidMount}
          loading={<Skeleton className="w-full h-full rounded-none absolute z-50" />}
          beforeMount={editorWillMount}
          language="wgsl"
          value={models.find((m) => m.name === selectedCodeName)?.code ?? ""}
          theme="vs-dark"
          path={selectedCodeName}
          line={2}
          options={{
            minimap: { enabled: false },
            wordWrap: "on",
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            autoIndent: "full",
            tabCompletion: "on",
            suggest: { showWords: true, showSnippets: true, showVariables: true, showColors: true },
            scrollBeyondLastLine: false,
          }}
          onChange={(value) => changeCode(value ?? "", selectedCodeName)}
        />
      </div>
    </>
  );
};

export default WGSLMonacoEditor;
