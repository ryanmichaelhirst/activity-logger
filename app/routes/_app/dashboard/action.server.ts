import { getBookCoverImageUrl, openLib } from "@/lib/openlib.server"
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
      const searchResults = await match(form.searchType)
        .with("movie", async () => {
          const resp = await tmdb.searchMulti({ query: form.query })

          return resp.results?.map((result) => {
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
        })
        .with("book", async () => {
          const resp = await openLib.search({ query: form.query })
          return resp.docs.map((doc) => {
            return {
              id: doc.cover_i,
              value: doc.title,
              label: doc.title,
              img: getBookCoverImageUrl(doc.cover_edition_key),
            }
          })
        })
        .otherwise(() => {
          return []
        })

      const uniqSearchResults = uniqBy(searchResults, "value")

      return typedjson({ searchResults: uniqSearchResults })
    })
