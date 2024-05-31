import { aniList } from "@/lib/anilist.server"
import { getBookCoverImageUrl, openLib } from "@/lib/openlib.server"
import { radar } from "@/lib/radar.server"
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
        ipAddress: z.string().optional(),
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
        .with("anime", async () => {
          const resp = await aniList.search(form.query)

          return resp.data.Page.media
            .map((media) => {
              return {
                id: media.id,
                value: media.title.english,
                label: media.title.english,
                img: media.coverImage?.medium,
              }
            })
            .filter((media) => !!media.value) // title can be null when it's not available in English, this will crash the cmdk package
        })
        .with("place", async () => {
          // Get latitude and longitude from client ip address, needed for Radar places api
          // https://ip-api.com/docs/api:json
          let near: string | undefined
          if (form.ipAddress) {
            const resp = await fetch(`http://ip-api.com/json/${form.ipAddress}?fields=192`)
            const json: { lat: number; lon: number } = await resp.json()
            near = `${json.lat},${json.lon}`
          }

          const resp = await radar.search({ query: form.query, near })

          return resp.addresses.map((address, idx) => {
            return {
              id: idx,
              value: address.addressLabel,
              label: address.addressLabel,
              img: null,
            }
          })
        })
        .exhaustive()

      const uniqSearchResults = uniqBy(searchResults, "value")

      return typedjson({ searchResults: uniqSearchResults })
    })
