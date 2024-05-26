import { Card, CardContent } from "@/components/ui/card";
import { PodcastEpisode } from "@/pages/api/podcast";
import Image from "next/image";
import { useAudioPlayer } from "@/components/audio-player-provider";

export const PodcastEpisodeCard = ({
  episode,
}: {
  episode: PodcastEpisode;
}) => {
  const { openPlayer } = useAudioPlayer();
  return (
    <Card
      className={"p-4 hover:bg-slate-400"}
      onClick={() => {
        openPlayer(episode.audioUrl);
      }}
    >
      <CardContent className={"flex  p-0 flex-row space-x-4 items-center"}>
        {episode.metaData?.podcastImage && (
          <Image
            width={"150"}
            height={"150"}
            src={episode.metaData?.podcastImage}
            alt={"podcast image"}
            className="rounded-lg"
          />
        )}
        <div className={"flex flex-col"}>
          <h3>{episode.title}</h3>
          <p>{episode.pubDate}</p>
        </div>
      </CardContent>
    </Card>
  );
};
