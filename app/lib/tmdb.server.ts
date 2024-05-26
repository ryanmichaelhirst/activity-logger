import { ENV } from "@/utils/env.server"
import { MovieDb } from "moviedb-promise"

// Source: https://developer.themoviedb.org/docs/image-basics
export function getImageUrl(imagePath: string) {
  return `https://image.tmdb.org/t/p/original${imagePath}`
}

// Source: https://github.com/grantholle/moviedb-promise
export const tmdb = new MovieDb(ENV.TMDB_API_KEY)
