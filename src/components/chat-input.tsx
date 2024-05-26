"use client";
import { cn } from "@/lib/utils";
import { AutosizeTextarea } from "@/components/ui/autoresize-textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { useChat } from "@/components/chat-provider";

export const ChatInput = ({ className }: { className?: string }) => {
  const [text, setText] = useState("");
  const { addChat } = useChat();
  return (
    <div className={cn("p-4 flex space-x-2 items-center", className)}>
      <AutosizeTextarea
        onChange={(e) => {
          setText(e.target.value);
        }}
        onSubmit={(e) => {
          e.preventDefault();
          addChat({ message: text });
          setText("");
        }}
      />
      <Button
        variant={"outline"}
        size={"icon"}
        className={""}
        onClick={() => {
          addChat({ message: text });
          setText("");
        }}
      >
        <ArrowUp
          className={"w-6 h-6"}
          color={text.length > 0 ? "black" : "grey"}
        />
      </Button>
    </div>
  );
};
