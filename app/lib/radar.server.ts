import { ENV } from "@/utils/env.server"
import { singleton } from "@/utils/singleton.server"

class Radar {
  async search({
    query,
    limit = 10,
    near,
  }: {
    query: string
    limit?: number
    near?: string
  }): Promise<SearchResponse> {
    // Source: https://radar.com/documentation/api#autocomplete
    const url = near
      ? `https://api.radar.io/v1/search/autocomplete?query=${query}&limit=${limit}&near=${near}`
      : `https://api.radar.io/v1/search/autocomplete?query=${query}&limit=${limit}`

    const response = await fetch(url, {
      headers: {
        // Source: https://radar.com/documentation/api#authentication
        Authorization: ENV.RADAR_PUBLISHABLE_KEY,
      },
    })

    return await response.json()
  }
}

type SearchResponse = {
  meta: {
    code: number
  }
  addresses: Array<{
    latitude: number
    longitude: number
    country: string
    countryCode: string
    countryFlag: string
    county: string
    distance: number
    borough: string
    city: string
    number: string
    neighborhood: string
    postalCode: string
    stateCode: string
    state: string
    street: string
    layer: string
    formattedAddress: string
    // placeLabel: string
    addressLabel: string
  }>
}

export const radar = singleton("radar", () => new Radar())
