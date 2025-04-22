import axios from "axios"
import * as cheerio from "cheerio"
import type { NextApiRequest, NextApiResponse } from "next"

interface ApiResponse {
  sheepPrice?: string
  goatPrice?: string
  horsePrice?: string
  cattlePrice?: string
  camelPrice?: string
  yakPrice?: string
  error?: string
}

function cleanNumberString(str: string): string {
  return str.replace(/(\d):(\d)/g, "$1.$2")
}

function parsePrice(raw: string): number {
  raw = cleanNumberString(raw.trim())
  let value = parseFloat(raw.replace(",", ".").replace(/[^\d.]/g, ""))
  if (raw.includes("сая")) {
    value *= 1_000_000
  }
  return Math.round(value)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    const url = "https://montsame.mn/mn/read/356593"
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const content = $("body").text()

    const sheepPriceMatch = content.match(/Хонь\s*([\d,.]+)\s*[-–]\s*([\d,.]+)\s*төгрөг/i)
    const goatPriceMatch = content.match(/Ямаа\s*([\d,.]+)\s*[-–]\s*([\d,.]+)\s*төгрөг/i)
    const horsePriceMatch = content.match(/Адуу\s*([\d,:.]+(?:\s*сая)?)\s*[-–]\s*([\d,:.]+(?:\s*сая)?)\s*төгрөг/i)
    const cattlePriceMatch = content.match(/Үхэр\s*([\d,:.]+(?:\s*сая)?)\s*[-–]\s*([\d,:.]+(?:\s*сая)?)\s*төгрөг/i)
    const yakPriceMatch = content.match(/Сарлаг\s*([\d,:.]+(?:\s*сая)?)\s*[-–]\s*([\d,:.]+(?:\s*сая)?)\s*төгрөг/i)
    const camelPriceMatch = content.match(/Тэмээ\s*([\d,:.]+(?:\s*сая)?)\s*[-–]\s*([\d,:.]+(?:\s*сая)?)\s*төгрөг/i)

    if (
      !sheepPriceMatch ||
      !goatPriceMatch ||
      !horsePriceMatch ||
      !cattlePriceMatch ||
      !yakPriceMatch ||
      !camelPriceMatch
    ) {
      return res.status(404).json({ error: "Үнэ олдсонгүй" })
    }

    const sheepPrice = `${sheepPriceMatch[1]} - ${sheepPriceMatch[2]} төгрөг`
    const goatPrice = `${goatPriceMatch[1]} - ${goatPriceMatch[2]} төгрөг`

    const horseLow = (horsePriceMatch[1])
    const horseHigh = parsePrice(horsePriceMatch[2])
    const horsePrice = `${horseLow.toLocaleString()} - ${horseHigh.toLocaleString()} төгрөг`

    const cattleLow = parsePrice(cattlePriceMatch[1])
    const cattleHigh = parsePrice(cattlePriceMatch[2])
    const cattlePrice = `${cattleLow.toLocaleString()} - ${cattleHigh.toLocaleString()} төгрөг`

    const yakLow = (yakPriceMatch[1])
    const yakHigh = parsePrice(yakPriceMatch[2])
    const yakPrice = `${yakLow.toLocaleString()} - ${yakHigh.toLocaleString()} төгрөг`

    const camelLow = parsePrice(camelPriceMatch[1])
    const camelHigh = parsePrice(camelPriceMatch[2])
    const camelPrice = `${camelLow.toLocaleString()} - ${camelHigh.toLocaleString()} төгрөг`

    res.status(200).json({ sheepPrice, goatPrice, horsePrice, cattlePrice, yakPrice, camelPrice })
  } catch (error) {
    console.error("Error in get-price API:", error)
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    })
  }
}
