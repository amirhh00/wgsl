"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface PromptCardProps {
  onPrompt?: (message: string, template?: string) => void | Promise<void>;
}

export const PromptCard = React.forwardRef<HTMLDivElement, PromptCardProps>(({ onPrompt }, ref) => {
  const [prompt, setPrompt] = React.useState("");

  return (
    <div className="grid w-full gap-2" ref={ref}>
      <Textarea
        className="resize-none w-full"
        placeholder="Type your message here."
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            onPrompt?.(prompt);
          }
        }}
      />
      <div className="flex w-full gap-2 grid-cols-12">
        {/* <Select>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="ChatBot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chatbot">ChatBot</SelectItem>
          </SelectContent>
        </Select> */}
        <Button
          className="flex-1"
          onClick={() => {
            onPrompt?.(prompt);
          }}
        >
          Send message
        </Button>
      </div>
    </div>
  );
});
PromptCard.displayName = "PromptCard";
