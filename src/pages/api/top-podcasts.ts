import type { NextApiRequest, NextApiResponse } from "next";

const APPLE_TOP_PODCASTS_URL =
  "https://rss.applemarketingtools.com/api/v2/us/podcasts/top/10/podcasts.json";

function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      // Fetch data from Apple's RSS feed
      const response = await fetch(APPLE_TOP_PODCASTS_URL);
      if (!response.ok) {
        throw new Error(`Apple RSS API Error: ${response.status}`);
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      const errorMessage = isError(error) ? error.message : "Unknown error";
      res.status(500).json({ error: errorMessage });
    }
  } else {
    res.status(405).json({ error: "Only GET method is allowed" });
  }
}
