import { LanguageModel } from "ai";
import { chromeai } from "chrome-ai";
import { createOllama } from "ollama-ai-provider";
import type { AiModelName } from "@/store/ai.state";

export async function getAvailableModel() {
  try {
    await checkForOllamaModel();
    return "phi";
  } catch (error) {
    try {
      await checkForChromeModel();
      return "chrome";
    } catch (error) {
      throw error;
    }
  }
}

export async function getModel(modelName: AiModelName) {
  // if (typeof window === "undefined") return undefined;
  // return new Promise<LanguageModel>(async (resolve, reject) => {
  //   try {
  //     await checkForOllamaModel();
  //     const ollama = createOllama({
  //       baseURL: process.env.NEXT_PUBLIC_API_HOST,
  //     });
  //     return resolve(ollama("phi"));
  //   } catch (error) {
  //     try {
  //       await checkForChromeModel();
  //       const model = chromeai("text");
  //       return resolve(model);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   }
  // });
  if (modelName === "phi") {
    const ollama = createOllama({
      baseURL: process.env.NEXT_PUBLIC_API_HOST,
    });
    return ollama("phi");
  } else if (modelName === "chrome") {
    return chromeai("text");
  }
}

export async function checkForOllamaModel() {
  if (!navigator.onLine) {
    throw new Error("You are offline, please check your internet connection.");
  }
  let apiHost = process.env.NEXT_PUBLIC_API_HOST;
  if (!apiHost) {
    throw new Error("API host is not set.");
  }
  if ((await fetch(apiHost.replace("/api", ""))).status !== 200) {
    throw new Error("API host is not reachable, please check your configuration.");
  }
}

export async function checkForChromeModel() {
  const version = getChromeVersion();
  if (version < 127) {
    throw new Error("Your browser is not supported. Please update to 127 version or greater.");
  }
  if (!window.ai) {
    throw new Error("Prompt API is not available, check your configuration in chrome://flags/#prompt-api-for-gemini-nano");
  }
  const state = await window.ai?.canCreateTextSession();
  if (state !== "readily") {
    throw new Error("Built-in AI is not ready, check your configuration in chrome://flags/#optimization-guide-on-device-model");
  }
}

function getChromeVersion() {
  var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  return raw ? parseInt(raw[2], 10) : 0;
}
