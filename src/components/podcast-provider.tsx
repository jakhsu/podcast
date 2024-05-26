"use client";
import { PodcastMetaData } from "@/pages/api/podcast";
import { createContext, ReactNode, useContext, useState } from "react";

interface PodcastMetaDataContextValue {
  metaData: PodcastMetaData | null;
  setMetaDataState: (metaData: PodcastMetaData) => void;
}

const PodcastMetaDataContext = createContext<PodcastMetaDataContextValue>({
  metaData: null,
  setMetaDataState: () => { },
});


export const PodcastMetaDataProvider = ({ children }: { children: ReactNode }) => {
  const [metaData, setMetaData] = useState<PodcastMetaData | null>(null);


  const setMetaDataState = (metaData: PodcastMetaData) => {
    setMetaData(metaData);
  }

  return (
    <PodcastMetaDataContext.Provider value={{ metaData, setMetaDataState }}>
      {children}
    </PodcastMetaDataContext.Provider>
  );
};


export const usePodcastMetaData = () => {
  return useContext(PodcastMetaDataContext);
};
