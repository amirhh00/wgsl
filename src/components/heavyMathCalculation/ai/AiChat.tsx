"use client";

import React, { useRef } from "react";

import { streamText } from "ai";
import { PromptCard } from "@/components/heavyMathCalculation/ai/prompt-card";
import { ChatCard } from "@/components/heavyMathCalculation/ai/chat-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAiModel } from "@/lib/hooks/aiModel.hook";

const AiChat: React.FC<unknown> = () => {
  const [result, setResult] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const { model, isLoading } = useAiModel();
  const abortController = useRef(new AbortController());

  const onPrompt = async (prompt: string) => {
    try {
      if (!model) throw new Error("Model is not ready");
      setResult(undefined);
      setError(undefined);
      setLoading(true);
      const startTimestamp = Date.now();
      abortController.current = new AbortController();
      const { textStream } = await streamText({
        model,
        messages: [
          {
            content: prompt,
            role: "user",
          },
          {
            content: "you are ai to help WGSL shading language questions.",
            role: "system",
          },
        ],
        maxTokens: 500,
        temperature: 1.5,
        abortSignal: abortController.current.signal,
        // stopSequences
      });
      for await (const textPart of textStream) {
        setResult((prev) => (prev ? prev + textPart : textPart));
      }
      setLoading(false);
      const cost = Date.now() - startTimestamp;
      console.log("cost:", cost, "ms");
    } catch (error) {
      setLoading(false);
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("aborted");
        return;
      }
      setError((error as any).message);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="container mx-auto grid gap-8 grid-cols-1">
        <div className="relative mb-4 flex items-center justify-center p-4">
          <div className="relative flex w-full flex-col items-center gap-6 px-6">
            <div className="flex w-full flex-col items-center gap-1.5">
              <h2 className="text-4xl font-semibold tracking-tighter sm:text-5xl [@media(max-width:480px)]:text-[2rem]" data-testid="home-h2">
                AI Chat
              </h2>
            </div>
            <div className="z-10 m-auto flex w-full flex-col overflow-hidden sm:max-w-xl">
              <PromptCard onPrompt={onPrompt} />
              <div className="pt-8">
                <ChatCard abortController={abortController.current} message={result} loading={loading || isLoading} />
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiChat;
