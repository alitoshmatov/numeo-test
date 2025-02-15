"use client";

import * as React from "react";
import { Send, Trash } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { Product } from "@/lib/types";
import { ProductCard } from "./products";
import { useEffect } from "react";
import { UIMessage } from "ai";
import SoldProduct from "./sold-product";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: JSON.parse(localStorage.getItem("messages") || "[]"),
    maxSteps: 2,
  });

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const [open, setOpen] = React.useState(false);

  const inputLength = input.trim().length;

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center shrink-0">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/avatars/01.png" alt="Image" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">AI Seller</p>
              <p className="text-sm text-muted-foreground">Antique goods</p>
            </div>
          </div>
          <Button
            size="icon"
            variant="outline"
            className="ml-auto rounded-full"
            onClick={() => {
              localStorage.removeItem("messages");
              window.location.reload();
            }}
          >
            <Trash />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <div className="space-y-2">
            {messages.map((message, index) => {
              return <MessageItem message={message} key={message.id} />;
            })}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="shrink-0">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (inputLength === 0) return;
              handleSubmit(event);
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={handleInputChange}
            />
            <Button type="submit" size="icon" disabled={inputLength === 0}>
              <Send />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}

const MessageItem = ({ message }: { message: UIMessage }) => {
  const showProductsTool = message.toolInvocations?.find(
    (item) => item.toolName === "products"
  );
  const closeDealTool = message.toolInvocations?.find(
    (item) => item.toolName === "closeDeal"
  );

  return (
    <>
      {closeDealTool?.result ? (
        <SoldProduct
          price={closeDealTool.result.price}
          product={closeDealTool.result.product as Product}
        />
      ) : null}

      {showProductsTool ? (
        <div className="flex flex-row gap-2">
          {showProductsTool.result?.map((product: Product) => {
            return (
              <div key={product.id} className="w-2/5">
                <ProductCard isSmall product={product} />
              </div>
            );
          })}
        </div>
      ) : null}
      <div
        className={cn(
          "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
          message.role === "user"
            ? "ml-auto bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        {message.content}
      </div>
    </>
  );
};
