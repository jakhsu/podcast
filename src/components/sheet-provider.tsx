"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { Sheet, SheetProps } from "@/components/ui/sheet/Sheet";

interface SheetContextValue {
  openSheet: (props: SheetProps) => void;
  closeSheet: () => void;
}

const SheetContext = createContext<SheetContextValue>({
  openSheet: () => { },
  closeSheet: () => { },
});

export const SheetProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState<SheetProps>();

  const openSheet = (props: SheetProps) => {
    setProps(props);
    setOpen(true);
  };

  const closeSheet = () => {
    setOpen(false);
  };

  return (
    <SheetContext.Provider value={{ openSheet, closeSheet }}>
      {children}
      <Sheet open={open} onOpenChange={setOpen} {...props}>
        {props?.children}
      </Sheet>
    </SheetContext.Provider>
  );
};

export const useSheet = () => {
  return useContext(SheetContext);
};
