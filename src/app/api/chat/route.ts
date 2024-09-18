import { CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    maxTokens: 300,
    temperature: 0.5,
    system:
      'You are expert assistant for WGSL shading language. Provide short yet easy explanations of WGSL code snippets. Use entire code context.',
    messages,
  });

  return result.toDataStreamResponse();
}
