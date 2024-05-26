"use client";
import {
  BaseCommandDialog,
  BaseCommandEmpty,
  BaseCommandInput,
  BaseCommandList,
} from "@/components/ui/command/base-command";
import { ComponentProps, Fragment, ReactNode } from "react";

export interface CommandProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  inputPlaceholder?: string;
  elements?: [];
}

export const Command = ({
  open,
  onOpenChange,
  elements,
  inputPlaceholder,
}: CommandProps) => {
  return (
    <BaseCommandDialog open={open} onOpenChange={onOpenChange}>
      <BaseCommandInput placeholder={inputPlaceholder} />
      <BaseCommandList>
        {elements?.map((element, index) => (
          <Fragment key={index}>{element}</Fragment>
        ))}
      </BaseCommandList>
    </BaseCommandDialog>
  );
};
