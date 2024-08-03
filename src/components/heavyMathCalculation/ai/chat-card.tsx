"use client";

import React from "react";
import { MemoizedReactMarkdown } from "./markdown";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface ChatCardProps {
  abortController: AbortController;
  message?: string;
  loading?: boolean;
}

export const ChatCard: React.FC<ChatCardProps> = ({ message, loading, abortController }) => {
  if (loading && !message) {
    return (
      <div className="space-y-2 w-full">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }
  if (!message) return null;
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardDescription>ChatBot:</CardDescription>
        <CardDescription className="!m-0">
          {loading && (
            <button onClick={() => abortController.abort()} title="stop generating" className="flex items-center gap-1 text-blue-500">
              {/* cancel or stop icon */}
              <svg fill="currentColor" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" />
              </svg>
            </button>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MemoizedReactMarkdown
          className="break-words text-sm"
          components={{
            p({ children }: any) {
              return <p className="mb-2 last:mb-0">{children}</p>;
            },
          }}
        >
          {message}
        </MemoizedReactMarkdown>
      </CardContent>
    </Card>
  );
};
