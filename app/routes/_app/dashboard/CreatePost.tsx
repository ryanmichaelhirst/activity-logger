import { SearchInput } from "@/components/SearchInput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ACTIVITY_TYPES, ACTIVITY_TYPES_ARRAY, ActivityTypeKey } from "@/lib/activityTypes"
import { cn } from "@/utils"
import { useClientIpAddress } from "@/utils/useClientIpAddress"
import { Form, useSearchParams } from "@remix-run/react"
import { useEffect, useRef } from "react"
import { useTypedFetcher } from "remix-typedjson"
import { route } from "routes-gen"
import { action } from "./action.server"

// Source: https://dribbble.com/search/new-post-form
// Source: https://dribbble.com/shots/19030492-Daily-UI-081-Status-Update/attachments/14196295?mode=media
// Source: https://dribbble.com/shots/20750880-Project-Dashboard-element
export function CreatePost() {
  const fetcher = useTypedFetcher<typeof action>()

  const [searchParams, setSearchParams] = useSearchParams()
  const searchType = searchParams.get("searchType")
  const selectedActivity = searchParams.get("activity")
  const objectId = searchParams.get("objectId")
  const photoUrl = searchParams.get("photoUrl")

  const [ipAddress] = useClientIpAddress()

  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        // inputRef?.current?.focus()
        console.log("event", e)

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
    <div className={cn("mx-auto w-2/3 pb-60")}>
      <Card>
        <CardHeader>
          <CardTitle>Create activity</CardTitle>
          <CardDescription>
            Log what activity you did today. Search results are dependent on the activity type you
            select
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Activity type</Label>
            <ul className="flex list-none justify-around space-x-4">
              {ACTIVITY_TYPES_ARRAY.map((item) => {
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
                        "w-fit rounded-full border-4 p-2 hover:!border-white",
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
          </div>

          <div className="space-y-4">
            <Label>Search</Label>
            <SearchInput
              inputProps={{
                placeholder: `i.e. Planet of the Apes`,
                // @ts-expect-error - ref is not included in inputProps type?
                ref: inputRef,
                disabled: !searchType,
              }}
            />
          </div>

          <div className="space-y-4">
            <Label>Select activity</Label>
            <ScrollArea className="h-40 rounded-md border border-input pr-2">
              <ul className="list-none">
                {searchResults?.map((item) => {
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        "flex items-center space-x-4 p-4 hover:bg-accent",
                        selectedActivity === item.value && "bg-accent",
                      )}
                      onClick={() => {
                        if (item.value) {
                          searchParams.set("activity", item.value)

                          if (item.id) {
                            searchParams.set("objectId", item.id)
                          }

                          if (item.img) {
                            searchParams.set("photoUrl", item.img)
                          }

                          setSearchParams(searchParams)
                        }
                      }}
                    >
                      {item.img ? (
                        <img src={item.img} className="h-8 w-8" />
                      ) : (
                        <div className="h-8 w-8 bg-gray-200" />
                      )}

                      <span className="">{item.label}</span>
                    </li>
                  )
                })}
              </ul>
            </ScrollArea>
          </div>

          {searchType && selectedActivity && (
            <div className="space-y-4">
              <Label className="italic">Preview</Label>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex space-x-2">
                    <span className="font-bold text-sky-500">@ryanmichael_hirst</span>
                    <span>{ACTIVITY_TYPES[searchType as ActivityTypeKey].verb}</span>
                    <span className="font-bold text-sky-500">{selectedActivity}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {searchType && selectedActivity && (
            <div className="flex justify-between">
              <Button variant="outline" size="sm">
                Cancel
              </Button>
              <Form method="POST" action={route("/activity/create")}>
                <input type="hidden" name="type" value={searchType} />
                <input type="hidden" name="name" value={selectedActivity} />
                {objectId && <input type="hidden" name="objectId" value={objectId} />}
                {photoUrl && <input type="hidden" name="photoUrl" value={photoUrl} />}
                <Button variant="default" size="sm">
                  Create activity
                </Button>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
