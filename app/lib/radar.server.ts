import { ENV } from "@/utils/env.server"
import { singleton } from "@/utils/singleton.server"

class Radar {
  async search({ query, limit = 10 }: { query: string; limit?: number }): Promise<SearchResponse> {
    const response = await fetch(
      // Source: https://radar.com/documentation/api#autocomplete
      `https://api.radar.io/v1/search/autocomplete&query=${query}&limit=${limit}`,
      {
        headers: {
          // Source: https://radar.com/documentation/api#authentication
          Authorization: ENV.RADAR_PUBLISHABLE_KEY,
        },
      },
    )

    return response.json()
  }
}

type SearchResponse = {
  meta: {
    code: number
  }
  addresses: Array<{
    latitude: number
    longitude: number
  }>
}

export const radar = singleton("radar", () => new Radar())
