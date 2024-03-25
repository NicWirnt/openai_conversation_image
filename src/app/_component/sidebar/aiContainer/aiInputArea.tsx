"use client";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import type { UseChatHelpers } from "ai/react";
import { FormEvent, ReactHTML, useRef } from "react";

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  isLoading: boolean;
  handleSubmit: UseChatHelpers["handleSubmit"];
  handleInputChange: UseChatHelpers["handleInputChange"];
}

const AIInputArea = ({
  input,
  setInput,
  isLoading,
  handleSubmit,
  handleInputChange,
}: PromptProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { formRef, onKeyDown } = useEnterSubmit();

  return (
    <form
      className="flex flex-grow items-center border-t bg-white p-3 pt-4  "
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <textarea
        ref={inputRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        rows={2}
        value={input}
        onChange={handleInputChange}
        // onChange={handleInputChange}
        placeholder="send a message or type generate for images"
        spellCheck={false}
        className=" w- min-h-[60px] resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
      />
      {isLoading ? (
        <div className="animate-pulse p-1">loading</div>
      ) : (
        <button
          type="submit"
          className="bg-zinc-300 border-blue-300 rounded-md p-1"
        >
          Send
        </button>
      )}
    </form>
  );
};

export default AIInputArea;
