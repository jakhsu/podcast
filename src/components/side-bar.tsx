"use client"
import { cn, fetchPodcastData, getArrayFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PodcastMetaData } from "@/pages/api/podcast";
import { usePodcastMetaData } from "./podcast-provider";
import { useRouter } from "next/navigation";
import { Card } from "./ui/card";
import { Home, Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const SideBar = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { setMetaDataState } = usePodcastMetaData()
  const { data: podcasts, isFetching } = useQuery({
    queryKey: ["podcasts"],
    queryFn: async () => {
      const savedUrls = getArrayFromLocalStorage<string>("podcasts") || [];
      const podcastDataPromises = savedUrls.map(fetchPodcastData);
      const podcastDataArray = await Promise.all(podcastDataPromises);

      const validPodcasts = podcastDataArray.filter(
        (data) => data !== null,
      ) as PodcastMetaData[];
      return validPodcasts
    }
  })

  return (
    <aside
      className={cn(
        `space-y-4 p-4 flex flex-col bg-background text-foreground w-72`,
        className,
      )}
    >
      <Card className="p-2">
        <Button variant={"ghost"} className="w-full">
          <Link href={"/"} >
            <div className="flex space-x-2 items-center">
              <Home />
              <p>
                Home
              </p>
            </div>
          </Link>
        </Button>
      </Card>
      <Card className="p-2">
        {
          isFetching ? <Loader className="animate-spin" /> :
            podcasts?.map((podcast, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-500" onClick={() => {
                setMetaDataState(podcast)
                const encodedUrl = podcast.url && encodeURIComponent(podcast.url)
                router.push(`/podcast/${encodedUrl}`);
              }}>
                {
                  podcast.image && (
                    <Image
                      width={"75"}
                      height={"75"}
                      src={podcast?.image}
                      alt={"podcast image"}
                    />
                  )
                }
                <p className="truncate">
                  {podcast.title}
                </p>
              </div>
            ))
        }
      </Card>
    </aside>
  );
};
