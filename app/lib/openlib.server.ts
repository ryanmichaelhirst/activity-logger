import { singleton } from "@/utils/singleton.server"

export function getBookCoverImageUrl(olid: string) {
  // Source: https://openlibrary.org/dev/docs/api/covers
  return `https://covers.openlibrary.org/b/olid/${olid}-S.jpg`
}

type SearchResponse = {
  numFound: number
  start: number
  numFoundExact: boolean
  docs: Array<{
    author_key: Array<string>
    author_name: Array<string>
    first_publish_year: number
    publish_year: Array<number>
    publisher: Array<string>
    title: string
    subject: Array<string>
    key: string
    isbn: Array<string>
    edition_key: Array<string>
    cover_edition_key: string
    cover_i: number
  }>
  q: string
  num_found: number
  offset: number | null
}
class OpenLibrary {
  public userAgent: string

  constructor() {
    // Source: https://gist.github.com/mekarpeles/0d308bfd8e75858d2266b8aa983cac07
    this.userAgent = "ActivityLogger/1.0 (ryanmichaelhirst@gmail)"
  }

  async search({ query, limit = 10 }: { query: string; limit?: number }): Promise<SearchResponse> {
    // Source: https://openlibrary.org/dev/docs/api/search
    const url = `https://openlibrary.org/search.json?q=${query}&limit=${limit}`
    const response = await fetch(url, {
      headers: {
        "User-Agent": this.userAgent,
      },
    })

    return response.json()
  }
}

export const openLib = singleton("openLib", () => new OpenLibrary())
