import {
  BaseDialog,
  BaseDialogContent,
  BaseDialogDescription,
  BaseDialogHeader,
  BaseDialogTitle,
  BaseDialogTrigger,
} from "@/components/ui/dialog/base-dialog";
import { ReactNode } from "react";

export interface DialogProps {
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  contentClassName?: string;
}
export const Dialog = ({
  title,
  description,
  contentClassName,
  children,
  open,
  onOpenChange,
}: DialogProps) => {
  return (
    <BaseDialog open={open} onOpenChange={onOpenChange}>
      <BaseDialogContent className={contentClassName}>
        <BaseDialogHeader>
          <BaseDialogTitle>{title}</BaseDialogTitle>
          <BaseDialogDescription>{description}</BaseDialogDescription>
        </BaseDialogHeader>
        {children}
      </BaseDialogContent>
    </BaseDialog>
  );
};
