// app/PodcastCard.tsx
"use client";
import { useState } from "react";
import { PodcastMetaData, PodcastEpisode } from "@/pages/api/podcast";
import { Card } from "@/components/ui/card";

interface PodcastCardProps {
  podcast: PodcastMetaData;
}

export const PodcastsCard = ({ podcast }: PodcastCardProps) => {
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(
    null,
  );

  const playEpisode = (episode: PodcastEpisode) => {
    setCurrentEpisode(episode);
  };

  return (
    <Card>
      <h3>{podcast.title}</h3>
      <ul>
        {podcast.episodes.map((episode, index) => (
          <li key={index}>
            <strong>{episode.title}</strong> - {episode.pubDate}
            <button onClick={() => playEpisode(episode)}>Play</button>
          </li>
        ))}
      </ul>

      {/* Audio player */}
      {currentEpisode && (
        <div>
          <audio controls autoPlay>
            <source src={currentEpisode.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <div>{currentEpisode.audioUrl}</div>
        </div>
      )}
    </Card>
  );
};
