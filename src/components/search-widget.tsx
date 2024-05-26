"use client";
import { useEffect, useState } from "react";
import {
  BaseCommandDialog,
  BaseCommandEmpty,
  BaseCommandGroup,
  BaseCommandInput,
  BaseCommandItem,
  BaseCommandList,
} from "./ui/command/base-command";
import { useDebounce } from "@/lib/useDebounce";
import { useRouter } from "next/navigation";
import { usePodcastMetaData } from "@/components/podcast-provider";
import { PlaceholdersAndVanishInput } from "./ui/placeholder-and-vanish-input";
import { PodcastMetaData } from "@/pages/api/podcast";
import { fetchPodcastData } from "@/lib/utils";

export interface Podcast {
  name: string; // Name of the podcast
  artistName: string; // Name of the artist/creator
  artworkUrl30?: string; // URL for the 30x30 image
  artworkUrl60?: string; // URL for the 60x60 image
  artworkUrl100?: string; // URL for the 100x100 image
  artworkUrl600?: string; // URL for the 600x600 image
  collectionCensoredName?: string; // Censored name of the collection
  collectionExplicitness?: string; // Explicitness level of the collection
  collectionHdPrice?: number; // HD price, if applicable
  collectionId?: number; // Collection identifier
  collectionName: string; // Name of the podcast collection
  collectionPrice?: number; // Price of the collection
  collectionViewUrl?: string; // URL to view the podcast collection
  contentAdvisoryRating?: string; // Content advisory rating (e.g., "Explicit")
  country?: string; // Country of origin
  currency?: string; // Currency for the pricing
  feedUrl?: string; // RSS feed URL for the podcast
  genreIds?: string[]; // Genre IDs associated with the podcast
  genres?: string[]; // Genre names associated with the podcast
  kind?: string; // Type of content ("podcast")
  primaryGenreName?: string; // Primary genre name
  releaseDate?: string; // Release date of the latest episode or podcast
  trackCensoredName?: string; // Censored name of the track
  trackCount?: number; // Number of tracks (episodes) in the podcast
  trackExplicitness?: string; // Explicitness level of the track
  trackId?: number; // Unique identifier for the track
  trackName: string; // Name of the podcast track
  trackPrice?: number; // Price of the individual track
  trackTimeMillis?: number; // Duration of the track in milliseconds
  trackViewUrl?: string; // URL to view the individual track
  wrapperType?: string; // Wrapper type ("track")
}

export const SearchWidget = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Podcast[]>([]);
  const [topPodcasts, setTopPodcasts] = useState<Podcast[]>([]); // [TODO
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { setMetaDataState } = usePodcastMetaData();
  const router = useRouter();

  const getTopPodcasts = async () => {
    try {
      const response = await fetch("/api/top-podcasts");
      const data = await response.json();
      setTopPodcasts(data.feed.results)
    } catch (error) {
      console.error("Error fetching top podcasts:", error);
      setTopPodcasts([])
    }
  }


  const handleSearch = async (term: string) => {
    setIsSearching(true);
    if (!term) {
      setIsSearching(false);
      return
    };
    try {
      // Fetch data from the iTunes API via the server
      const response = await fetch(
        `/api/search-podcasts?term=${encodeURIComponent(term)}`,
      );
      const data = await response.json();
      setResults(data.results || undefined);
      setIsSearching(false);
    } catch (error) {
      setIsSearching(false);
      console.error("Error fetching podcast results:", error);
      setResults([]);
    }
  };

  useEffect(() => {
    handleSearch(debouncedSearchTerm).then();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    getTopPodcasts()
  }, [])

  return (
    <>
      <PlaceholdersAndVanishInput placeholders={topPodcasts ? topPodcasts.map(p => p.name) : [""]} onChange={(e) => setSearchTerm(e.target.value)} onSubmit={() => { setOpen(true) }} />
      <BaseCommandDialog open={open} onOpenChange={setOpen}>
        <BaseCommandInput placeholder="Filter the search results..." />
        <BaseCommandList>
          <BaseCommandGroup heading="Podcasts">
            <BaseCommandEmpty>No results found.</BaseCommandEmpty>
            {results.map((podcast, index) => (
              <BaseCommandItem
                key={index}
                onSelect={() => {
                  fetchPodcastData(podcast.feedUrl).then((metaData: PodcastMetaData | null) => {
                    if (metaData) {
                      setMetaDataState(metaData)
                      const encodedUrl = metaData.url && encodeURIComponent(metaData.url)
                      router.push(`/podcast/${encodedUrl}`);
                      setOpen(false);
                    }
                  })
                }}
              >
                <span className={"text-gray-900 font-semibold"}>
                  {podcast.collectionName}
                </span>
              </BaseCommandItem>
            ))}
          </BaseCommandGroup>
        </BaseCommandList>
      </BaseCommandDialog>
    </>
  );
};
