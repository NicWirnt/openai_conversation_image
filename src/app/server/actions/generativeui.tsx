import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

// An example of a spinner component. You can also import your own components,
// or 3rd party component libraries.
function Spinner() {
  return <div>Loading...</div>;
}

async function submitUserMessage(userInput: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  // Update the AI state with the new user message.
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: userInput,
    },
  ]);

  // The `render()` creates a generated, streamable UI.
  const ui = render({
    model: "gpt-4-0125-preview",
    provider: openai,
    messages: [
      {
        role: "system",
        content: "You are an assistant to help user with their prompt",
      },
      ...aiState.get(),
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call).
    // Its content is streamed from the LLM, so this function will be called
    // multiple times with `content` being incremental.
    text: ({ content, done }) => {
      // When it's the final content, mark the state as done and ready for the client to access.
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
          },
        ]);
      }

      return (
        <div className="max-w-[330px] overflow-auto">
          <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{content}</pre>
        </div>
      );
    },
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI: any = createAI({
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState,
});
