import { ENV } from "@/utils/env.server"
import { MovieDb } from "moviedb-promise"

export const tmdb = new MovieDb(ENV.TMDB_API_KEY)

// Source: https://developer.themoviedb.org/docs/image-basics
export function getImageUrl(imagePath: string) {
  return `https://image.tmdb.org/t/p/original${imagePath}`
}
