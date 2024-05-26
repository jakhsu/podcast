"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface Chat {
  message: string;
}
interface ChatContextValue {
  chats: Chat[];
  addChat: (chat: Chat) => void;
}

const ChatContext = createContext<ChatContextValue>({
  chats: [],
  addChat: () => {},
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const addChat = (chat: Chat) => {
    setChats((prevChats) => [...prevChats, chat]);
  };

  return (
    <ChatContext.Provider value={{ chats, addChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
