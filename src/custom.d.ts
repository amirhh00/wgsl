export type ChromeAISessionAvailable = "no" | "readily";

export interface ChromeAISessionOptions {
  temperature?: number;
  topK?: number;
}

export interface ChromeAISession {
  destroy: () => Promise<void>;
  prompt: (prompt: string) => Promise<string>;
  promptStreaming: (prompt: string) => ReadableStream<string>;
  execute: (prompt: string) => Promise<string>;
  executeStreaming: (prompt: string) => ReadableStream<string>;
}

export interface ChromePromptAPI {
  canCreateGenericSession: () => Promise<ChromeAISessionAvailable>;
  canCreateTextSession: () => Promise<ChromeAISessionAvailable>;
  defaultGenericSessionOptions: () => Promise<ChromeAISessionOptions>;
  defaultTextSessionOptions: () => Promise<ChromeAISessionOptions>;
  createGenericSession: (options?: ChromeAISessionOptions) => Promise<ChromeAISession>;
  createTextSession: (options?: ChromeAISessionOptions) => Promise<ChromeAISession>;
}

declare global {
  var ai: ChromePromptAPI;
  var model = ai;
}

type mongoDBUser = import("mongodb").WithId<import("mongodb").Document> | null;
declare module "next-auth" {
  // change User interface to mongoDBUser type

  // interface User extends mongoDBUser {}

  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      // address: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & import("next-auth").DefaultSession["user"];
  }
}
