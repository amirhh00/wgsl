"use client";

import Image from "next/image";
import React from "react";

import { streamText } from "ai";
import { chromeai } from "chrome-ai";
import { PromptCard } from "@/components/heavyMathCalculation/ai/prompt-card";
import { ChatCard } from "@/components/heavyMathCalculation/ai/chat-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { checkEnv } from "@/lib/utils/ai.utils";

const model = chromeai();

const HomePage: React.FC<unknown> = () => {
  const [result, setResult] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const onPrompt = async (prompt: string) => {
    try {
      await checkEnv();
      setResult(undefined);
      setError(undefined);
      setLoading(true);
      const startTimestamp = Date.now();
      const { textStream } = await streamText({
        model,
        prompt,
        // temperature: 0.8,
      });
      for await (const textPart of textStream) {
        setResult(textPart);
      }
      setLoading(false);
      const cost = Date.now() - startTimestamp;
      console.log("cost:", cost, "ms");
    } catch (error) {
      setLoading(false);
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
                Chrome AI
              </h2>
            </div>
            <div className="z-10 m-auto flex w-full flex-col overflow-hidden sm:max-w-xl">
              <PromptCard onPrompt={onPrompt} />
              <div className="pt-8">
                <ChatCard message={result} loading={loading} />
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

export default HomePage;
