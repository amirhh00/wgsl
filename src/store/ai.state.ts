import { create } from "zustand";
import { toast } from "sonner";
import { checkForChromeModel, checkForOllamaModel } from "@/lib/utils/ai.utils";

export const models = ["phi", "chrome"] as const;

export type AiModelName = (typeof models)[number];

interface AiChatState {
  activeModel?: AiModelName;
  setActiveModel: (model: AiModelName) => void;
}

export const useAiChatStore = create<AiChatState>((set) => ({
  activeModel: undefined,
  setActiveModel: (model) => {
    // do some checks before setting the model
    if (model === "phi") {
      checkForOllamaModel()
        .then(() => {
          set({ activeModel: model });
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else if (model === "chrome") {
      checkForChromeModel()
        .then(() => {
          set({ activeModel: model });
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  },
}));

export default useAiChatStore;
