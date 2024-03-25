"use client";

import type { Message } from "ai";

const AIHeader = ({ messages }: { messages: Message[] }) => {
  const title = messages[0]?.content?.substring(0, 100);
  return (
    <div className="flex-shrink border-b bg-white p-3 pt-4">
      <div className="text-sm font-bold">AI Chatbox</div>
    </div>
  );
};

export default AIHeader;
