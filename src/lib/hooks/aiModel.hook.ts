import { useAiChatStore } from "@/store/ai.state";
import { getModel, getAvailableModel } from "@/lib/utils/ai.utils";
import { useEffect, useMemo, useState } from "react";
import type { LanguageModel } from "ai";

// a hook to get the model
export function useAiModel() {
  const [model, setModel] = useState<LanguageModel | undefined>();
  const [isModelReady, setIsModelReady] = useState(false);
  const abortController = useMemo(() => new AbortController(), []);
  const { activeModel, setActiveModel } = useAiChatStore();

  useEffect(() => {
    getAvailableModel().then((model) => {
      setActiveModel(model);
    });
  }, []);

  useEffect(() => {
    if (!activeModel) return;
    getModel(activeModel).then((model) => {
      setModel(model);
      setIsModelReady(true);
    });
  }, [activeModel]);

  return { model, isLoading: !isModelReady, abortController };
}
