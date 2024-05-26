"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { Dialog, DialogProps } from "./ui/dialog/dialog";

interface DialogContextValue {
    openDialog: (props: DialogProps) => void;
    closeDialog: () => void;
}

const DialogContext = createContext<DialogContextValue>({
    openDialog: () => { },
    closeDialog: () => { },
});

export const DialogProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [props, setProps] = useState<DialogProps>();

    const openDialog = (props: DialogProps) => {
        setProps(props);
        setOpen(true);
    };
    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            {children}
            <Dialog open={open} onOpenChange={setOpen} {...props}>{props?.children}</Dialog>
        </DialogContext.Provider>
    );
};

export const useDialog = () => {
    return useContext(DialogContext)
}
