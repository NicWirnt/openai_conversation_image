"use server";

import OpenAI from "openai";
import { OpenAIStream, experimental_StreamingReactResponse, Message } from "ai";

// export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler({ messages }: { messages: Message[] }) {
  const lastMessage = messages[messages.length - 1];
  const hasGenerate = lastMessage.content.toLowerCase().includes("generate");

  if (hasGenerate) {
    let content = "";
    messages.map((m) => {
      if (m.role === "user") {
        content = m.content;
      }
    });

    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: content,
      n: 4,
    });

    return { content: response.data };
  } else {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.role === "user" ? m.content : "",
      })),
    });
    const stream = OpenAIStream(response);

    return new experimental_StreamingReactResponse(stream, {
      ui: async (params) => {
        return (
          <div className="max-w-[320px] overflow-auto">
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
              {params.content}
            </pre>
          </div>
        );
      },
    });
  }
}
