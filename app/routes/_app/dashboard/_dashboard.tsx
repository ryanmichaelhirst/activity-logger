import { ButtonLink } from "@/components/ButtonLink"
import { SearchCmd } from "@/components/SearchCmd"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/utils"
import { useClientIpAddress } from "@/utils/useClientIpAddress"
import { MetaFunction } from "@remix-run/node"
import { useSearchParams } from "@remix-run/react"
import { ShieldAlertIcon } from "lucide-react"
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

function SearchInput() {
  const fetcher = useTypedFetcher<typeof action>()
  const [searchParams, setSearchParams] = useSearchParams()

  const [ipAddress] = useClientIpAddress()

  const onSearch = (query: string) => {
    fetcher.submit(
      {
        query,
        searchType: searchParams.get("searchType"),
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
      <Select
        onValueChange={(value) => {
          searchParams.set("searchType", value)
          setSearchParams(searchParams)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="movie">Movie / TV Show</SelectItem>
          <SelectItem value="book">Book</SelectItem>
          <SelectItem value="anime">Anime</SelectItem>
          <SelectItem value="place">Place</SelectItem>
        </SelectContent>
      </Select>
      <SearchCmd onSearch={onSearch} isLoading={isLoading} searchResults={searchResults} />
    </div>
  )
}
