"use client";

import { useChat } from "ai/react";
import AIContentArea from "./aiContentArea";
import AIHeader from "./aiHeader";
import AIInputArea from "./aiInputArea";

import { handler } from "@/app/server/actions/openai/chat";
import { useState } from "react";

//Hello Corey

const AIContainer = () => {
  const [generatedImages, setGeneratedImages] = useState([]);

  const {
    setMessages,
    messages,
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
    handleSubmit,
    handleInputChange,
  } = useChat({
    initialMessages: [],
    api: handler,

    // body: {
    //   id,
    //   previewToken
    // },
    onResponse(response) {},
    onFinish(message) {
      //   if (!path.includes('chat')) {
      //     window.history.pushState({}, '', `/chat/${id}`)
      //   }
    },
  });

  // const messages = [
  //   {
  //     role: "user",
  //     content: "Hi",
  //   },
  //   {
  //     role: "assistant",
  //     ui: "Hello! How can I assist you today?",
  //   },
  //   {
  //     role: "user",
  //     content: "I'm looking for information about a new article.",
  //   },
  //   {
  //     role: "assistant",
  //     ui: "Sure! Could you provide me with more details about the article you're interested in?",
  //   },
  //   {
  //     role: "user",
  //     content: "It's about recent developments in AI technology.",
  //   },
  //   {
  //     role: "assistant",
  //     ui: "Great! I'll search for relevant articles on AI technology and provide you with the latest updates.",
  //   },
  //   {
  //     role: "user",
  //     content: "Thank you!",
  //   },
  //   {
  //     role: "assistant",
  //     ui: "You're welcome! If you have any more questions, feel free to ask.",
  //   },
  // ];
  return (
    <div className="flex flex-grow flex-col overflow-auto border-y">
      <AIHeader messages={messages} />
      <AIContentArea
        messages={messages}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
      />
      <AIInputArea
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default AIContainer;
