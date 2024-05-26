"use client";
import { Button } from "@/components/ui/button";
import { Divide, Menu, Moon, Settings, Sun } from "lucide-react";
import { SideBar } from "@/components/side-bar";
import { useTheme } from "next-themes";
import { useSheet } from "@/components/sheet-provider";
import { SearchWidget } from "@/components/search-widget";
import { cn } from "@/lib/utils";
import { useDialog } from "@/components/dialog-provider";
import { SettingsWidget } from "./settings-widget";

export const TopBar = ({ className }: { className?: string }) => {
  const { openSheet } = useSheet();
  const { openDialog } = useDialog();
  const { setTheme, theme } = useTheme();
  return (
    <header
      className={cn(
        "sticky top-0 flex space-x-4 items-center md:justify-end justify-between z-10 bg-background h-14 p-2 font-semibold",
        className,
      )}
    >
      <Button
        variant={"outline"}
        size={"icon"}
        className={"md:hidden"}
        onClick={() => {
          openSheet({
            children: <div className={"-mx-6"}>
              <SideBar className={"w-full"} /></div>,
            side: "left",
          });
        }}
      >
        <Menu className={"h-4 w-4"} />
      </Button>
      <div className={"grow"}>
        <SearchWidget />
      </div>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => {
          theme === "dark" ? setTheme("light") : setTheme("dark");
        }}
      >
        {/*  TODO: figure out how to conditionally use different icon without hydration error*/}
        <Sun />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => {
          openDialog({
            title: "settings",
            contentClassName: "max-w-xl h-full bg-background",
            children: <SettingsWidget />,
          });
        }}
      >
        <Settings />
      </Button>
    </header>
  );
};
