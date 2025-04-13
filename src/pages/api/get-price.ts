import axios from "axios";
import * as cheerio from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";

interface ApiResponse {
  sheepPrice?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const url = "https://montsame.mn/mn/read/356593"; // Replace with your target URL
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Find the section containing livestock prices
    const content = $("body").text(); // Get all text content
    
    // Improved regex pattern to match Mongolian price formats
    const sheepPriceMatch = content.match(/Хонь\s*([\d,\.]+)\s*[-–]\s*([\d,\.]+)\s*төгрөг/i);
    
    if (!sheepPriceMatch) {
      return res.status(404).json({ error: "Sheep price not found on page" });
    }

    // Format the price range (e.g., "140,000-220,000 төгрөг")
    const sheepPrice = `${sheepPriceMatch[1]}-${sheepPriceMatch[2]} төгрөг`;
    
    res.status(200).json({ sheepPrice });
  } catch (error) {
    console.error("Error in get-price API:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Internal server error" 
    });
  }
}