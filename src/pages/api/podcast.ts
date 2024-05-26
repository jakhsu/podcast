// pages/api/podcast.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";

export interface PodcastEpisode {
  title: string;
  pubDate: string;
  link: string;
  audioUrl: string; // New property to hold direct audio URL
  metaData?: {
    podcastTitle?: string;
    podcastImage?: string;
    description?: string;
  };
}

export interface PodcastMetaData {
  url?: string;
  title?: string;
  image?: string;
  description?: string;
  episodes: PodcastEpisode[];
}

const parser = new Parser();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { feedUrl } = req.body as { feedUrl: string };

    try {
      const feed = await parser.parseURL(feedUrl);

      const podcastTitle = feed.title ?? "Unknown Title";
      const podcastImage = feed.image?.url ?? "";
      const podcastDescription = feed.description ?? "No description available";

      // Structure the response data
      const podcastData: PodcastMetaData = {
        url: feedUrl,
        title: feed.title,
        description: feed.description,
        image: feed.image?.url,
        episodes: feed.items.map((item) => ({
          title: item.title ?? "",
          pubDate: item.pubDate ?? "",
          link: item.link ?? "",
          audioUrl: item.enclosure?.url ?? "",
          metaData: {
            podcastTitle,
            podcastImage,
            description: podcastDescription,
          },
        })),
      };

      res.status(200).json(podcastData);
    } catch (error) {
      console.error("Error parsing RSS feed:", error);
      res.status(400).json({ error: "Invalid RSS feed URL" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
