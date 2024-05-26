"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { AudioPlayer } from "@/components/audio-player";

interface AudioPlayerContextValue {
  openPlayer: (audioUrl: string) => void;
  saveTranscript: (transcript: string) => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue>({
  openPlayer: () => { },
  saveTranscript: () => { },
  closePlayer: () => { },
});

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [transcript, setTranscript] = useState<string>();
  const [audioUrl, setAudioUrl] = useState<string>();

  const openPlayer = (audioUrl: string) => {
    setAudioUrl(audioUrl);
    setOpen(true);
  };

  const closePlayer = () => {
    setTranscript(undefined);
    setOpen(false);
  };

  const saveTranscript = (transcript: string) => {
    setTranscript(transcript);
  }

  return (
    <AudioPlayerContext.Provider value={{ openPlayer, closePlayer, saveTranscript }}>
      {children}
      {audioUrl && open && (
        <div className={"absolute inset-x-0 bottom-0 p-4"}>
          <AudioPlayer audioUrl={audioUrl} play={true} transcript={transcript} />
        </div>
      )}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  return useContext(AudioPlayerContext);
};
