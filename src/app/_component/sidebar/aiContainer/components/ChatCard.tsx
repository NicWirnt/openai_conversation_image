import type { Message } from "ai";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { UseChatHelpers } from "ai/react";
import { handler } from "@/app/server/actions/openai/chat";

import EmblaCarousel from "./EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";

const OPTIONS: EmblaOptionsType = {};

const ChatCard = ({
  message,
  isLoading,
  handleSubmit,
}: {
  message: Message;
  isLoading: boolean;
  handleSubmit: UseChatHelpers["handleSubmit"];
}) => {
  const copyToClipboard = (text: string) => {
    console.log(text);
    let textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");

    textField.remove();
  };

  //   const generateImage = async (images: string[]) => {
  //     console.log(images);
  //     const response = await imageVariationHandler(images);
  //     // if (response) {
  //     //   setImageUrl([...response]);
  //     // }
  //   };

  return (
    <div>
      <div className="mb-2 flex max-w-[340px] flex-wrap items-start">
        <div className="mx-2 ml-1 flex flex-wrap items-center pt-2 text-sm">
          <Card
            className={`w-[320px] shadow-sm rounded-sm
          ${message.role === "user" ? "ml-4" : "mr-4"}
          `}
          >
            <CardHeader
              className={`p-[0.5rem] ${
                message.role === "assistant" && "border-b"
              }`}
            >
              {message.role === "assistant" && (
                <div
                  className="flex items-center justify-between
         gap-2"
                >
                  <div className="shadow m-1 flex size-8 shrink-0 items-center justify-center ">
                    AI
                  </div>

                  {/* <div>Chat Title</div> */}
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      className="border-none bg-zinc-100 hover:bg-zinc-300"
                    >
                      Append
                    </Button>
                    <Button
                      variant="outline"
                      className="border-none bg-zinc-100 hover:bg-zinc-300"
                      onClick={() => copyToClipboard(message.content)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-2">
              <div className="w-full items-center gap-4">
                <div className={`flex flex-col space-y-1.5`}>
                  {Array.isArray(message.content) ? (
                    <>
                      {/* GRID LAYOUT */}
                      {/* <div className="grid grid-cols-2 gap-1 p-1 pt-2">
                        {message.content.map((item, index) => (
                          <div className="bg-white rounded-lg shadow-md p-1 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 ">
                            <Image
                              key={index}
                              src={item.url}
                              height={200}
                              width={150}
                              alt="aiImage"
                              className="rounded-sm border border-zinc-100 object-cover"
                            />
                          </div>
                        ))}
                      </div> */}

                      <EmblaCarousel
                        options={OPTIONS}
                        slides={message.content}
                      />
                    </>
                  ) : (
                    <Label
                      htmlFor="name"
                      className={`flex w-100 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role === "user" ? message.content : message.ui}
                    </Label>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between"></CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
