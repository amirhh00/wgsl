import { CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    maxTokens: 300,
    temperature: 0.5,
    system: 'You are to provide feedback on the quiz results.',
    messages,
  });

  return result.toDataStreamResponse();
}
