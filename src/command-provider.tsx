"use client";
import { createContext, ReactNode, useState } from "react";
import { CommandDialogProps } from "@/components/ui/command/base-command";

interface CommandContextValue {
  openCommand: (props: CommandDialogProps) => void;
  closeCommand: () => void;
}

const CommandContext = createContext({
  openCommand: () => {},
  closeCommand: () => {},
});

export const CommandProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState<CommandDialogProps>();

  const openCommand = () => {
    setProps(props);
    setOpen(true);
  };

  const closeCommand = () => {
    setOpen(false);
  };

  return (
    <CommandContext.Provider value={{ openCommand, closeCommand }}>
      {children}
    </CommandContext.Provider>
  );
};

export const useCommand = () => {
  return createContext(CommandContext);
};
