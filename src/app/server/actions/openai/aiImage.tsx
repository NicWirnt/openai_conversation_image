"use server";

import OpenAI from "openai";
import { OpenAIStream, experimental_StreamingReactResponse, Message } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// export async function handler({ messages }: { messages: Message[] }) {
//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     stream: true,
//     messages: messages.map((m) => ({
//       role: m.role as "user" | "assistant",
//       content: m.role === "user" ? m.content : m.content,
//     })),
//   });
//   const stream = OpenAIStream(response);

//   return new experimental_StreamingReactResponse(stream, {
//     ui: async (params) => {
//       return (
//         <div className="max-w-[320px] overflow-auto">
//           <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
//             {params.content}
//           </pre>
//         </div>
//       );
//     },
//   });
// }

export async function imageHandler({ message }: { message: string }) {
  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: message,
    n: 4,
  });
  console.log(response);
  if (!response) {
    return <div>Loading ... </div>;
  }
  {
    return response.data;
  }
}
