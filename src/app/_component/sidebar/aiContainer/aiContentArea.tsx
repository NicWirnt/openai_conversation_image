"use client";

import type { Message } from "ai";

import ChatCard from "./components/ChatCard";
import type { UseChatHelpers } from "ai/react";

const AIContentArea = ({
  messages,
  isLoading,
  handleSubmit,
}: {
  messages: Message[];
  isLoading: boolean;
  handleSubmit: UseChatHelpers["handleSubmit"];
}) => {
  return (
    <div className="mt-2 flex flex-grow flex-col overflow-x-auto">
      {messages.map((m, i) => (
        <ChatCard
          message={m}
          key={i}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
        />
      ))}
    </div>
  );
};
export default AIContentArea;
