import {
  BaseSheet,
  BaseSheetClose,
  BaseSheetContent,
  BaseSheetDescription,
  BaseSheetFooter,
  BaseSheetHeader,
  BaseSheetTitle,
} from "@/components/ui/sheet/base-sheet";
import { ComponentProps, ReactNode } from "react";

export interface SheetProps {
  open?: boolean;
  children: ReactNode;
  title?: string;
  description?: string;
  onOpenChange?: (open: boolean) => void;
  side?: ComponentProps<typeof BaseSheetContent>["side"];
  footer?: ReactNode;
}
export const Sheet = ({
  open,
  side = "right",
  title,
  description,
  onOpenChange,
  footer,
  children,
}: SheetProps) => {
  return (
    <BaseSheet open={open} onOpenChange={onOpenChange}>
      <BaseSheetContent side={side}>
        <BaseSheetHeader>
          <BaseSheetTitle>{title}</BaseSheetTitle>
          <BaseSheetDescription>{description}</BaseSheetDescription>
        </BaseSheetHeader>
        {children}
        {/* <BaseSheetFooter>{footer}</BaseSheetFooter> */}
      </BaseSheetContent>
    </BaseSheet>
  );
};
