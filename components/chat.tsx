"use client";

import * as React from "react";
import { Send, Trash, ImageIcon, Paperclip } from "lucide-react";

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
import { useEffect, useRef, useState } from "react";
import { UIMessage } from "ai";
import SoldProduct from "./sold-product";

export function Chat() {
  const { status, messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages:
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("messages") || "[]")
        : [],
    maxSteps: 2,
  });
  const [isMaxStorage, setIsMaxStorage] = useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("messages", JSON.stringify(messages));
      } catch (error) {
        setIsMaxStorage(true);
      }
    }
  }, [messages]);

  const inputLength = input.trim().length;
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
          {isMaxStorage ? (
            <Button
              onClick={() => {
                localStorage.removeItem("messages");
                window.location.reload();
              }}
            >
              Clear storage
            </Button>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (inputLength === 0) return;
                handleSubmit(event, {
                  experimental_attachments: files,
                });

                setFiles(undefined);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="flex w-full items-center space-x-2"
            >
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  onChange={(event) => {
                    if (event.target.files) {
                      setFiles(event.target.files);
                    }
                  }}
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  id="picture"
                />
                <div className="flex gap-2 items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "h-9 w-9",
                      files && files.length > 0 && "text-primary"
                    )}
                  >
                    <Paperclip className="h-5 w-5" />
                    <span className="sr-only">Attach images</span>
                  </Button>
                  {files && files.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {files.length} {files.length === 1 ? "image" : "images"}
                    </span>
                  )}
                </div>
              </div>
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
          )}
        </CardFooter>
      </Card>
    </>
  );
}

const MessageItem = ({ message }: { message: UIMessage }) => {
  const showProductsTool = message.toolInvocations?.find(
    (item) => item.toolName === "products" && "result" in item
  );
  const closeDealTool = message.toolInvocations?.find(
    (item) => item.toolName === "closeDeal" && "result" in item
  );

  return (
    <>
      {closeDealTool && "result" in closeDealTool && (
        <SoldProduct
          price={(closeDealTool.result as any).price}
          product={(closeDealTool.result as any).product as Product}
        />
      )}

      {showProductsTool && "result" in showProductsTool && (
        <div className="flex flex-row gap-2">
          {(showProductsTool.result as Product[])?.map((product: Product) => {
            return (
              <div key={product.id} className="w-2/5">
                <ProductCard isSmall product={product} />
              </div>
            );
          })}
        </div>
      )}
      <div
        className={cn(
          "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
          message.role === "user"
            ? "ml-auto bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        {message.content}
        <div>
          {message.experimental_attachments
            ?.filter((attachment) =>
              attachment.contentType?.startsWith("image/")
            )
            .map((attachment, index) => (
              <img
                key={`${message.id}-${index}`}
                src={attachment.url}
                alt={attachment.name}
              />
            ))}
        </div>
      </div>
    </>
  );
};
