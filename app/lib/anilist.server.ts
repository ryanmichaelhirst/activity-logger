import { singleton } from "@/utils/singleton.server"

class AniList {
  public headers: Record<string, string>

  constructor() {
    // Source: https://anilist.gitbook.io/anilist-apiv2-docs/overview/graphql/getting-started
    this.headers = { "Content-Type": "application/json", Accept: "application/json" }
  }

  async fetch({ query, variables }: { query: string; variables: Record<string, any> }) {
    // Source: https://anilist.gitbook.io/anilist-apiv2-docs/overview/graphql/getting-started
    const url = `https://graphql.anilist.co`
    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    return response.json()
  }

  async search(search: string): Promise<SearchResponse> {
    // Source: https://anilist.github.io/ApiV2-GraphQL-Docs/
    const graphql = `
      query($search: String) {
        Page {
          media(search: $search) {
            id
            title {
              romaji
              english
              native
              userPreferred
            }
            status
            episodes
            coverImage {
              medium
            }
            bannerImage
          }
        }
      }
    `

    return await this.fetch({ query: graphql, variables: { search } })
  }
}

export const aniList = singleton("aniList", () => new AniList())

type SearchResponse = {
  data: {
    Page: {
      media: Array<{
        id: number
        title: {
          romaji: string
          english: string
          native: string
          userPreferred: string
        }
        status: string
        episodes: number
        coverImage: {
          medium: string
        }
        bannerImage: string | null
      }>
    }
  }
}
