import { ButtonLink } from "@/components/ButtonLink"
import { SearchCmd } from "@/components/SearchCmd"
import { cn } from "@/utils"
import { useClientIpAddress } from "@/utils/useClientIpAddress"
import { MetaFunction } from "@remix-run/node"
import { useSearchParams } from "@remix-run/react"
import { BookIcon, FilmIcon, MapPinIcon, PaletteIcon, ShieldAlertIcon, TvIcon } from "lucide-react"
import { useEffect } from "react"
import { useTypedFetcher, useTypedLoaderData } from "remix-typedjson"
import { route } from "routes-gen"
import { action } from "./action.server"
import { loader } from "./loader.server"

export { action, loader }

export const meta: MetaFunction = () => [{ title: "Remix Railway | Dashboard" }]

export default function Page() {
  const data = useTypedLoaderData<typeof loader>()

  useEffect(() => {
    if (!data.stripeSession) return
    if (data.stripeSession.status === "open") {
      console.log("Stripe session is open")
    } else if (data.stripeSession.status === "complete") {
      console.log("Stripe session is complete")
    }
  }, [data.stripeSession])

  return (
    <main className="mx-auto flex flex-col space-y-6 px-16 pt-6 lg:px-24">
      <h1 className="text-center text-5xl">Lorem ipsum dolor sit amet</h1>
      <div className="space-x-2 text-center text-2xl">Lorem ipsum dolor sit amet</div>
      {data.freeTrialExpired && (
        <div className="mx-auto mb-4 w-1/2 space-y-8 text-center">
          <ShieldAlertIcon className="mx-auto h-16 w-16 text-red-500" />
          <p className="text-3xl font-semibold">Free trial is expired</p>
          <p className="text-lg">
            Your free trial period is over. To continue using Lyrically please make a one time
            payment for a premium account.
          </p>
          <ButtonLink to={route("/checkout")} variant="default">
            Upgrade to Premium
          </ButtonLink>
        </div>
      )}
      <div
        className={cn(
          "mx-auto pb-40",
          data.freeTrialExpired && "cursor-disabled pointer-events-none opacity-50",
        )}
        {...(data.freeTrialExpired && { tabIndex: -1 })}
      >
        <SearchInput />
      </div>
    </main>
  )
}

// Source: https://dribbble.com/search/new-post-form
function SearchInput() {
  const fetcher = useTypedFetcher<typeof action>()
  const [searchParams, setSearchParams] = useSearchParams()

  const [ipAddress] = useClientIpAddress()

  const searchType = searchParams.get("searchType")

  const onSearch = (query: string) => {
    fetcher.submit(
      {
        query,
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

  const isLoading = fetcher.state === "loading" || fetcher.state === "submitting"
  const searchResults = fetcher.data?.searchResults

  return (
    <div>
      <ul className="mb-8 flex list-none justify-around space-x-4">
        {SEARCH_TYPES.map((item) => {
          return (
            <li
              key={item.label}
              className="flex cursor-pointer flex-col items-center"
              onClick={() => {
                searchParams.set("searchType", item.value)
                setSearchParams(searchParams)
              }}
            >
              <div
                className={cn("w-fit rounded-full border-4 p-4 hover:!border-blue-500")}
                style={{
                  backgroundColor: item.backgroundColor,
                  borderColor: searchType === item.value ? "#3b82f6" : item.backgroundColor,
                }}
              >
                <item.icon className="h-4 w-4" />
              </div>
              <span className="mt-3">{item.label}</span>
            </li>
          )
        })}
      </ul>
      <SearchCmd onSearch={onSearch} isLoading={isLoading} searchResults={searchResults} />
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
