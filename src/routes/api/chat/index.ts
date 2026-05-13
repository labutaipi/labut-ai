import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { ollamaText } from "@tanstack/ai-ollama";

export async function POST(request: Request) {
  const { messages } = (await request.json()) as {
    messages: any[];
  };
  const stream = chat({
    adapter: ollamaText("llama3"),
    messages: [...messages],
  });

  return toServerSentEventsResponse(stream);
}
