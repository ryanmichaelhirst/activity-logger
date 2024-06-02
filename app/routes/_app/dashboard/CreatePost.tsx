import { SearchInput } from "@/components/SearchInput"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/utils"
import { useClientIpAddress } from "@/utils/useClientIpAddress"
import { useSearchParams } from "@remix-run/react"
import { AnimatePresence, motion } from "framer-motion"
import { BookIcon, FilmIcon, MapPinIcon, PaletteIcon, TvIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import { useTypedFetcher } from "remix-typedjson"
import { route } from "routes-gen"
import { action } from "./action.server"

// Source: https://dribbble.com/search/new-post-form
// Source: https://dribbble.com/shots/19030492-Daily-UI-081-Status-Update/attachments/14196295?mode=media
export function CreatePost() {
  const fetcher = useTypedFetcher<typeof action>()

  const [searchParams, setSearchParams] = useSearchParams()
  const searchType = searchParams.get("searchType")
  const selectedActivity = searchParams.get("activity")

  const [ipAddress] = useClientIpAddress()

  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        inputRef?.current?.focus()
        fetcher.submit(
          {
            // @ts-expect-error - TS doesn't know about e.target?
            query: e.target.value,
            searchType,
            ...(ipAddress && {
              ipAddress,
            }),
          },
          {
            method: "POST",
            action: route("/dashboard"),
          },
        )
      }
    }

    window.document.addEventListener("keydown", down)

    return () => {
      window.document.removeEventListener("keydown", down)
    }
  }, [])
  const searchResults = fetcher.data?.searchResults

  return (
    <div className={cn("mx-auto pb-60")}>
      <ul className="mb-8 flex list-none justify-around space-x-4">
        {SEARCH_TYPES.map((item) => {
          const isSelected = searchType === item.value

          return (
            <li
              key={item.label}
              className="flex cursor-pointer flex-col items-center"
              onClick={() => {
                if (isSelected) {
                  searchParams.delete("searchType")
                } else {
                  searchParams.set("searchType", item.value)
                }

                setSearchParams(searchParams)
              }}
            >
              <div
                className={cn(
                  "w-fit rounded-full border-4 p-4 hover:!border-white",
                  isSelected && "shadow-lg dark:shadow-slate-600",
                )}
                style={{
                  backgroundColor: item.backgroundColor,
                  borderColor: isSelected ? "rgba(255, 255, 255, 0.7)" : item.backgroundColor,
                }}
              >
                <item.icon className="h-4 w-4" />
              </div>
              <span className="mt-3">{item.label}</span>
            </li>
          )
        })}
      </ul>

      <AnimatePresence mode="wait">
        {searchType && !selectedActivity && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SearchInput
              inputProps={{
                className: "absolute",
                placeholder: "Search",
                // @ts-expect-error - ref is not included in inputProps type?
                ref: inputRef,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="invisible h-10" />

      <AnimatePresence>
        {searchResults && !selectedActivity && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ul className="mt-4 list-none space-y-4 rounded-md border border-input bg-background px-3 py-2">
              {searchResults.map((item) => {
                return (
                  <li
                    key={item.id}
                    className="flex items-center space-x-4"
                    onClick={() => {
                      if (item.value) {
                        searchParams.set("activity", item.value)
                        setSearchParams(searchParams)
                      }
                    }}
                  >
                    {item.img ? (
                      <img src={item.img} className="h-16 w-16" />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200" />
                    )}

                    <span className="">{item.label}</span>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedActivity && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardContent className="py-4">
                <span className="font-bold text-sky-500">@ryanmichael_hirst</span>
                <span> watched </span>
                <span className="font-bold text-sky-500">{selectedActivity}</span>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const SEARCH_TYPES = [
  { value: "movie", label: "Movie", icon: FilmIcon, backgroundColor: "#006769" },
  { value: "tv_show", label: "TV Show", icon: TvIcon, backgroundColor: "#40A578" },
  { value: "book", label: "Book", icon: BookIcon, backgroundColor: "#803D3B" },
  { value: "anime", label: "Anime", icon: PaletteIcon, backgroundColor: "#FF5580" },
  { value: "place", label: "Place", icon: MapPinIcon, backgroundColor: "#7469B6" },
]
