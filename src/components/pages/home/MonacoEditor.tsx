"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { language, conf } from "@/lib/utils/wgsl.lang";

import type * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

const MonacoEditor = dynamic(() => import("react-monaco-editor"), { ssr: false });

const WGSLMonacoEditor = ({ value, onChange }: any) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      if (loading) setLoading(false);
    }, 5000);
  }, []);

  const editorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => {
    monaco.languages.register({ id: "wgsl" });
    monaco.languages.setMonarchTokensProvider("wgsl", language);
    monaco.languages.setLanguageConfiguration("wgsl", conf);
    monaco.languages.registerCompletionItemProvider("wgsl", {
      provideCompletionItems: function (model, position) {
        // compute context-aware suggestions here
        return {
          suggestions: [
            {
              label: "textureSample",
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: "textureSample(${1:sampler}, ${2:coords})",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Sample a texture.",
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
              },
            },
            // ... more completion items
          ],
        };
      },
    });
    // editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, function () {
    //   // editor.trigger("anyString", "editor.action.triggerSuggest", {}); // TODO: Fix this
    //   console.log("triggerSuggest");
    // });
    editor.focus();
    setLoading(false);
  };

  return (
    <>
      {loading && <Skeleton className="h-[600px] w-[800px]" />}
      <MonacoEditor
        className="p-0"
        width="800"
        height="600"
        language="wgsl"
        options={{
          minimap: { enabled: false },
          wordWrap: "on",
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          autoIndent: "full",
          tabCompletion: "on",
          suggest: { showWords: true, showSnippets: true, showVariables: true, showColors: true },
        }}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        editorDidMount={editorDidMount}
      />
    </>
  );
};

export default WGSLMonacoEditor;
