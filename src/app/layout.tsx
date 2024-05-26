import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { SideBar } from "@/components/side-bar";
import { cn } from "@/lib/utils";
import { TopBar } from "@/components/top-bar";
import { SheetProvider } from "@/components/sheet-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatProvider } from "@/components/chat-provider";
import { Toaster } from "@/components/ui/toaster";
import { AudioPlayerProvider } from "@/components/audio-player-provider";
import { PodcastMetaDataProvider } from "@/components/podcast-provider";
import { DialogProvider } from "@/components/dialog-provider";
import { TanstackQueryProvider } from "@/components/tanstack-query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podcast",
  description: "Podcast Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <ThemeProvider
          attribute={"data-theme"}
          defaultTheme={"dark"}
          enableColorScheme
          disableTransitionOnChange
        >
          <TanstackQueryProvider>
            <ChatProvider>
              <PodcastMetaDataProvider>
                <SheetProvider>
                  <DialogProvider>
                    <AudioPlayerProvider>
                      <div className="fixed inset-x-0 inset-y-0 flex">
                        <SideBar className={"hidden md:flex"} />
                        <main className="flex flex-grow flex-col overflow-auto">
                          <TopBar />
                          <div className={"min-h-screen"}>{children}</div>
                        </main>
                      </div>
                      <Toaster />
                    </AudioPlayerProvider>
                  </DialogProvider>
                </SheetProvider>
              </PodcastMetaDataProvider>
            </ChatProvider>
          </TanstackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
