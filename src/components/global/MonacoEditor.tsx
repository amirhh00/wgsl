'use client';

import { useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import useShaderStore, { defaultCode, preWrittenCode } from '@/store/shader.state';
import MonacoEditor, { Monaco, loader } from '@monaco-editor/react';
import type { editor as Editor } from 'monaco-editor';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Wgsllogo from '@/components/global/wgsl.logo';
import { cn } from '@/lib/utils';
import AiExplain from './AiExplain';

interface WGSLMonacoEditorProps {
  hideSelect?: boolean;
  readonly?: boolean;
}

loader.config({
  paths: {
    vs: '/scripts/monaco',
  },
});

const WGSLMonacoEditor: React.FC<WGSLMonacoEditorProps> = (props) => {
  const { changeCode, setActiveModel, savedCustomCodes: models, removeModel } = useShaderStore();
  const [iconButtonPosition, setIconButtonPosition] = useState<{ top: number } | null>(null);
  const [openExplainModal, setOpenExplainModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const editorRef = useRef<Editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(editor: Editor.IStandaloneCodeEditor, monaco: Monaco) {
    editorRef.current = editor;
    // add another button to context menu
    editor.addAction({
      id: 'explain-code',
      label: 'Explain this code using AI',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Period],
      contextMenuGroupId: 'navigation',
      run(editor, ...args) {
        const selection = editor.getSelection();
        if (selection && !selection.isEmpty()) {
          setSelectedCode(editor.getModel()?.getValueInRange(selection));
          dialogRef.current?.show();
          setOpenExplainModal(true);
        }
      },
    });
    editor.onDidChangeCursorSelection((e) => {
      const selection = editor.getSelection();
      if (selection && !selection.isEmpty()) {
        // console.log('selection', selection.toString());
        const startLineNumber = selection.startLineNumber;
        const top = editor.getTopForLineNumber(startLineNumber);
        setIconButtonPosition({ top });
        // selected code
        setSelectedCode(editor.getModel()?.getValueInRange(selection));
      } else {
        setIconButtonPosition(null);
        dialogRef.current?.close();
        setSelectedCode(undefined);
        setOpenExplainModal(false);
      }
    });
  }

  const handleOpenNewModel = () => {
    let newModelName = `custom${Object.keys(models).length + 1}`;
    if (models.find((c) => c.name === newModelName)) {
      let max = 0;
      for (let i = 0; i < models.length; i++) {
        const customCodeName = models[i].name;
        if (customCodeName.startsWith('custom')) {
          const num = parseInt(customCodeName.replace('custom', ''));
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
            <li
              key={model.name}
              className={`tab px-2 flex justify-around items-center ${model.currentActive ? 'active' : ''}`}
            >
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
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </li>
          ))}
        </ul>
        <div className="tab !bg-transparent !border-l-2 mr-2 !border-l-white/40 !px-3 !ml-2 h-[65%] relative min-h-6">
          <button
            onClick={handleOpenNewModel}
            className="closeBtn !p-0 h-full absolute bottom-[0px] left-1 px-1 text-2xl font-extralight leading-[0]"
          >
            <p className="p-1 pb-[7px]">+</p>
          </button>
        </div>
      </div>

      <div className="w-full h-[clamp(400px,50vh,100vh)] relative">
        {iconButtonPosition && (
          <button
            style={{ top: iconButtonPosition.top }}
            title="Explain this code using AI"
            className={cn('icon-button z-10 left-10 absolute rounded-full')}
            onClick={() => {
              dialogRef.current?.show();
              setOpenExplainModal(true);
            }}
          >
            <svg className="w-6 h-6 fill-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
            </svg>
          </button>
        )}
        <MonacoEditor
          className="absolute top-0 left-0 w-full h-full rounded-none bg-[#1e1e1e]"
          onMount={handleEditorDidMount}
          loading={<Skeleton className="w-full h-full rounded-none absolute" />}
          // beforeMount={editorWillMount}
          language="wgsl"
          value={models.find((m) => m.currentActive)?.code ?? ''}
          theme="vs-dark"
          path={models.find((m) => m.currentActive)?.name}
          line={2}
          options={{
            scrollbar: {
              alwaysConsumeMouseWheel: false,
            },
            domReadOnly: props.readonly,
            readOnly: props.readonly,
            minimap: { enabled: false },
            wordWrap: 'off',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            padding: { top: 5, bottom: 5 },
            autoIndent: 'full',
            tabCompletion: 'on',
            suggest: { showWords: true, showSnippets: true, showVariables: true, showColors: true },
            scrollBeyondLastLine: false,
          }}
          onChange={(value) => {
            if (value) changeCode(value, models.find((m) => m.currentActive)!.name, true);
          }}
        />
        <dialog
          ref={dialogRef}
          style={{ top: iconButtonPosition?.top ? `calc(${iconButtonPosition?.top}px + 22px)` : '0' }}
          className="ml-0 left-[65px] p-2 pt-5 px-4 bg-secondary prose dark:prose-invert w-full min-h-10 transition-all z-40"
        >
          {openExplainModal && (
            <AiExplain selectedCode={selectedCode} wholeCode={models.find((m) => m.currentActive)?.code} />
          )}
          <button className="absolute top-2 right-2" onClick={() => dialogRef.current?.close()}>
            <svg className="w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />{' '}
            </svg>
          </button>
        </dialog>
      </div>
    </>
  );
};

export default WGSLMonacoEditor;
