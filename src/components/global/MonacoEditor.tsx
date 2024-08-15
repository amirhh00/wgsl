"use client";

import { useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import useShaderStore, { defaultCode, preWrittenCode } from "@/store/shader.state";
import MonacoEditor, { Monaco } from "@monaco-editor/react";
import type { editor as Editor } from "monaco-editor";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Wgsllogo from "@/components/global/wgsl.logo";

interface WGSLMonacoEditorProps {
  hideSelect?: boolean;
}

const WGSLMonacoEditor: React.FC<WGSLMonacoEditorProps> = (props) => {
  const { changeCode, setActiveModel, savedCustomCodes: models, removeModel } = useShaderStore();
  const editorRef = useRef<Editor.IStandaloneCodeEditor | null>(null);
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

  const handleOpenNewModel = () => {
    let newModelName = `custom${Object.keys(models).length + 1}`;
    if (models.find((c) => c.name === newModelName)) {
      let max = 0;
      for (let i = 0; i < models.length; i++) {
        const customCodeName = models[i].name;
        if (customCodeName.startsWith("custom")) {
          const num = parseInt(customCodeName.replace("custom", ""));
          if (num > max) max = num;
        }
      }
      newModelName = `custom${max + 1}`;
    }
    changeCode(defaultCode, newModelName, true);
    // setActiveModel(newModelName);
  };

  const handleRemoveModel = (name: string) => {
    removeModel(name);
  };

  const handleSelectChange = (value: string) => {
    const foundPreWrittenCode = preWrittenCode.find((c) => c.name === value);
    if (foundPreWrittenCode) {
      // change code of the active model
      changeCode(foundPreWrittenCode.code, models.find((m) => m.currentActive)!.name, true);
    }
  };

  return (
    <>
      {!props.hideSelect && models.length > 0 && (
        <Select onValueChange={handleSelectChange} defaultValue="">
          <SelectTrigger className="w-[280px] mb-4 !ring-0">
            <SelectValue placeholder="Select a sample code" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {preWrittenCode.map((code) => (
                <SelectItem key={code.name} value={code.name}>
                  {code.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}

      <div className="tabs-container flex items-center w-full bg-[#2d2d2d] [&_*]:!outline-none min-h-9">
        <ul className="flex tabs overflow-x-auto max-w-[calc(100%_-_26px)]">
          {models.map((model) => (
            <li key={model.name} className={`tab px-2 flex justify-around items-center ${model.currentActive ? "active" : ""}`}>
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
        <div className="tab !bg-transparent !border-l-2 mr-2 !border-l-white/40 !px-3 !ml-2 h-[65%] relative min-h-6">
          <button onClick={handleOpenNewModel} className="closeBtn !p-0 h-full absolute bottom-[0px] left-1 px-1 text-2xl font-extralight leading-[0]">
            <p className="p-1 pb-[7px]">+</p>
          </button>
        </div>
      </div>

      <div className="w-full h-[clamp(400px,50vh,100vh)] relative">
        <MonacoEditor
          className="absolute top-0 left-0 w-full h-full rounded-none bg-[#1e1e1e]"
          onMount={handleEditorDidMount}
          loading={<Skeleton className="w-full h-full rounded-none absolute" />}
          // beforeMount={editorWillMount}
          language="wgsl"
          value={models.find((m) => m.currentActive)?.code ?? ""}
          theme="vs-dark"
          path={models.find((m) => m.currentActive)?.name}
          line={2}
          options={{
            scrollbar: {
              alwaysConsumeMouseWheel: false,
            },
            minimap: { enabled: false },
            wordWrap: "off",
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            padding: { top: 5, bottom: 5 },
            autoIndent: "full",
            tabCompletion: "on",
            suggest: { showWords: true, showSnippets: true, showVariables: true, showColors: true },
            scrollBeyondLastLine: false,
          }}
          onChange={(value) => {
            if (value) changeCode(value, models.find((m) => m.currentActive)!.name, true);
          }}
        />
      </div>
    </>
  );
};

export default WGSLMonacoEditor;
