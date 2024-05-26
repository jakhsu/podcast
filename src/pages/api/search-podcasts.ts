// pages/api/search-podcasts.ts
import type { NextApiRequest, NextApiResponse } from "next";

const ITUNES_API_URL = "https://itunes.apple.com/search";

function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { term } = req.query;

    if (!term || typeof term !== "string") {
      return res.status(400).json({ error: "Search term is required" });
    }

    // Encode the search term and build the full API URL
    const searchTerm = encodeURIComponent(term);
    const url = `${ITUNES_API_URL}?term=${searchTerm}&media=podcast`;

    try {
      // Fetch data from iTunes API
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`iTunes API Error: ${response.status}`);
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
