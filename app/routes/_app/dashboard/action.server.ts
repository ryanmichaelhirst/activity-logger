import { getImageUrl, tmdb } from "@/lib/tmdb.server"
import { app } from "@/utils/app.server"
import { ActionFunctionArgs } from "@remix-run/node"
import { uniqBy } from "lodash"
import { typedjson } from "remix-typedjson"
import { match } from "ts-pattern"
import { z } from "zod"

export const action = (args: ActionFunctionArgs) =>
  app(args)
    .parseForm(
      z.object({
        query: z.string().min(1),
        searchType: z.enum(["movie", "book", "anime", "place"]),
      }),
    )
    .build(async ({ form }) => {
      if (form.searchType === "movie") {
        const resp = await tmdb.searchMulti({ query: form.query })
        const searchResults = resp.results?.map((result) => {
          return match(result)
            .with({ media_type: "movie" }, (data) => {
              return {
                id: data.id,
                value: data.title,
                label: data.title,
                img: data?.poster_path ? getImageUrl(data?.poster_path) : null,
              }
            })
            .with({ media_type: "tv" }, (data) => {
              return {
                id: data.id,
                value: data.name,
                label: data.name,
                img: data?.poster_path ? getImageUrl(data?.poster_path) : null,
              }
            })
            .with({ media_type: "person" }, (data) => {
              return {
                id: data.id,
                value: data.name,
                label: data.name,
                img: data.profile_path ? getImageUrl(data.profile_path) : null,
              }
            })
            .exhaustive()
        })

        return typedjson({ searchResults: uniqBy(searchResults, "value") })
      }

      return typedjson({ searchResults: [] })
    })
