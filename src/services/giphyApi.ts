// Giphy API service for fetching GIFs
// API Documentation: https://developers.giphy.com/docs/api

import { GiphyFetch } from "@giphy/js-fetch-api";

// Initialize Giphy client with API key from environment
const giphyApiKey = import.meta.env.VITE_GIPHY_API_KEY || "";

export const giphyFetch = giphyApiKey ? new GiphyFetch(giphyApiKey) : null;

export interface GifData {
  id: string;
  url: string;
  title: string;
  width: number;
  height: number;
}

/**
 * Search for GIFs with kid-friendly content filter
 */
export async function searchGifs(
  query: string,
  limit: number = 12,
): Promise<GifData[]> {
  if (!giphyFetch) {
    console.warn("Giphy API key not configured");
    return [];
  }

  try {
    const { data } = await giphyFetch.search(query, {
      limit,
      rating: "g", // G-rated content only (kid-friendly)
      lang: "en",
    });

    return data.map((gif) => ({
      id: String(gif.id),
      url: gif.images.fixed_height.url,
      title: gif.title,
      width: parseInt(String(gif.images.fixed_height.width), 10),
      height: parseInt(String(gif.images.fixed_height.height), 10),
    }));
  } catch (error) {
    console.error("Error searching Giphy:", error);
    return [];
  }
}

/**
 * Get trending GIFs (kid-friendly)
 */
export async function getTrendingGifs(limit: number = 12): Promise<GifData[]> {
  if (!giphyFetch) {
    console.warn("Giphy API key not configured");
    return [];
  }

  try {
    const { data } = await giphyFetch.trending({
      limit,
      rating: "g", // G-rated content only
    });

    return data.map((gif) => ({
      id: String(gif.id),
      url: gif.images.fixed_height.url,
      title: gif.title,
      width: parseInt(String(gif.images.fixed_height.width), 10),
      height: parseInt(String(gif.images.fixed_height.height), 10),
    }));
  } catch (error) {
    console.error("Error fetching trending GIFs:", error);
    return [];
  }
}

/**
 * Check if Giphy is configured
 */
export function isGiphyConfigured(): boolean {
  return !!giphyFetch;
}
