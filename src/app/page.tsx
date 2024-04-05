"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "../app/server/actions/generativeui";
import AIContainer from "./_component/sidebar/aiContainer";

import "./embla.css";
import Weather from "./_component/weather";
// import "./base.css";
export default function Home() {
  const [sidebar, setSidebar] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  return (
    //this is from generativeUI
    // <main className="flex min-h-screen flex-col items-center justify-between p-20">
    //   {/* generative ui */}
    //   <div className="flex flex-col w-[400px] ">
    //     <form
    //       onSubmit={async (e) => {
    //         e.preventDefault();

    //         // Add user message to UI state
    //         setMessages((currentMessages) => [
    //           ...currentMessages,
    //           {
    //             id: Date.now(),
    //             display: <div>{inputValue}</div>,
    //           },
    //         ]);

    //         // Submit and get response message
    //         const responseMessage = await submitUserMessage(inputValue);
    //         setMessages((currentMessages) => [
    //           ...currentMessages,
    //           responseMessage,
    //         ]);

    //         setInputValue("");
    //       }}
    //     >
    //       <input
    //         placeholder="Send a message..."
    //         value={inputValue}
    //         onChange={(event) => {
    //           setInputValue(event.target.value);
    //         }}
    //       />
    //     </form>
    //     <div>
    //       {
    //         // View messages in UI state
    //         messages.map((message) => (
    //           <div key={message.id} className="border-b py-4">
    //             {message.display}
    //           </div>
    //         ))
    //       }
    //     </div>
    //   </div>
    // </main>
    // This is sidebar OPENAI
    <main className="flex min-h-screen flex-col items-center justify-between p-20">
      {/* <div className="relative z-50 flex">
        <div className="flex flex-col gap-2 p-2 items-center ">
          <button className="border" onClick={() => setSidebar("chat")}>
            Chat
          </button>
          <button className="border" onClick={() => setSidebar("weather")}>
            Weather
          </button>
        </div>

        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex h-full">
          <div
            className={`flex overflow-auto bg-neutral-50 h-full ${
              sidebar === "chat" ? "min-w-[340px]" : ""
            }`}
            style={{
              width: sidebar === "chat" ? "340px" : "0px",
            }}
            id="sidebar-content"
          >
            <AIContainer />
          </div>
        </div> */}
      {/* <div className="w-full">{sidebar === "weather" ? <Weather /> : ""}</div>
      </div> */}
      <button className="border" onClick={() => setSidebar("weather")}>
        Weather
      </button>
      <div className="w-full">{sidebar === "weather" ? <Weather /> : ""}</div>
    </main>
  );
}
