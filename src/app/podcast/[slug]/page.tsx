"use client";
import { usePodcastMetaData } from "@/components/podcast-provider";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addPodcastByUrl } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { PodcastMetaData } from "@/pages/api/podcast";
import { PodcastEpisodeCard } from "@/components/podcast-episode-card";
import { useParams } from "next/navigation";

export default function Page() {
  const { metaData } = usePodcastMetaData();
  const params = useParams()
  const { toast } = useToast();
  const [podcast, setPodcast] = useState<PodcastMetaData>();
  const podcastUrl = decodeURIComponent(params?.slug as string);

  useEffect(() => {
    const fetchPodcastData = async (
      url: string,
    ): Promise<PodcastMetaData | null> => {
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

    const loadPodcasts = async () => {
      const podcastDataPromises = fetchPodcastData(podcastUrl)
      const podcastData = await podcastDataPromises;
      podcastData && setPodcast(podcastData);
    };

    loadPodcasts();
  }, []);

  return (
    <div className={"w-full p-4"}>
      <Card>
        <CardHeader className="flex flex-row space-x-4 p-4">
          {metaData?.image && (
            <Image
              className={"rounded-lg"}
              height={"300"}
              width={"300"}
              src={metaData?.image}
              alt={"podcast artwork"}
            />
          )}
          <div className="flex overflow-x-hidden flex-col max-w-full self-end space-y-2">
            <p className="text-sm">Podcast</p>
            <p className="text-lg font-bold">{metaData?.title}</p>
            <p className="text font-semibold truncate">{metaData?.description}</p>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Button
            onClick={() => {
              metaData?.url &&
                addPodcastByUrl(metaData?.url).then(() => {
                  toast({ title: "Subscribed to podcast" });
                });
            }}
          >
            Subscribe
          </Button>
          <div className="p-4">
          </div>
        </CardContent>
      </Card>
      <p className="p-2 text-lg font-semibold">
        All Episodes
      </p>
      <div className={"p-4 space-y-4"}>
        {podcast?.episodes.map((episode, index) => (
          <PodcastEpisodeCard key={index} episode={episode} />
        ))}
      </div>
    </div>
  );
}
