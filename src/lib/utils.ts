import { PodcastMetaData } from "@/pages/api/podcast";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getArrayFromLocalStorage<T>(key: string): T[] | undefined {
  const jsonString = localStorage.getItem(key);
  if (jsonString) {
    try {
      return JSON.parse(jsonString) as T[];
    } catch (error) {
      console.error("Error parsing JSON from localStorage", error);
      return undefined;
    }
  }
  return undefined;
}

export const saveArrayToLocalStorage = <T>(key: string, array: T[]): void => {
  const jsonString = JSON.stringify(array);
  localStorage.setItem(key, jsonString);
};

export const addPodcastByUrl = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const podcasts = getArrayFromLocalStorage<string>("podcasts") || [];

      if (!podcasts.includes(url)) {
        const updatedPodcasts = [...podcasts, url];
        saveArrayToLocalStorage("podcasts", updatedPodcasts);
        console.log("Podcast URL added successfully.");
        resolve();
      } else {
        console.log("Podcast URL already exists.");
        resolve(); // Or you can reject with a specific message if you prefer
      }
    } catch (error) {
      console.error("Failed to add podcast by URL", error);
      reject(error);
    }
  });
};

export const fetchPodcastData = async (
  url?: string,
): Promise<PodcastMetaData | null> => {
  if (!url) {
    console.error("No URL provided to fetch podcast data");
    return null;
  }
  try {
    const response = await fetch("/api/podcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feedUrl: url }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch podcast data");
    }

    const data: PodcastMetaData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching podcast data:", error);
    return null;
  }
};
