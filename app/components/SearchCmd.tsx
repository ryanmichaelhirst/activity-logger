import { KeyboardShortcut } from "@/components/KeyboardShortcut"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"
import { getOperatingSystem } from "@/utils/platform"
import { CommandIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ClientOnly } from "remix-utils/client-only"

export function SearchCmd(props: {
  onSearch: (query: string) => void
  disabled?: boolean
  isLoading?: boolean
  searchResults?: Array<any>
}) {
  // get client ip address
  const [ipAddress, setIpAddress] = useState<string | null>(null)
  useEffect(() => {
    async function getIpAddress() {
      if (!ipAddress) {
        const _ipAddress = await (await fetch("https://api.ipify.org")).text()

        if (_ipAddress) {
          setIpAddress(_ipAddress)
        }
      }
    }

    getIpAddress()
  }, [])

  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        inputRef?.current?.focus()
      }
    }

    window.document.addEventListener("keydown", down)

    return () => {
      window.document.removeEventListener("keydown", down)
    }
  }, [])

  const [search, setSearch] = useState("")

  return (
    <div className="w-60 transform sm:w-[650px]">
      {/* Command search bar */}
      <ClientOnly fallback={null}>
        {() => (
          <>
            <Command
              loop
              className="relative top-0 rounded-lg border-2 shadow-xl shadow-slate-300 dark:shadow-gray-900/30"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.altKey) {
                  return
                }

                if (e.key === "Enter" || e.key === "Tab") {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("Command.onKeyDown", { search })

                  // only search when value is not empty
                  if (search !== "") {
                    props.onSearch(search)
                  }
                }
              }}
              autoFocus={false}
              shouldFilter={false}
              {...(props.disabled && { tabIndex: -1 })}
            >
              <CommandInput
                placeholder="Search..."
                value={search}
                onValueChange={setSearch}
                ref={inputRef}
                autoFocus={false}
                {...(props.disabled && { tabIndex: -1 })}
              />
              <CommandList className="min-h-[300px]" {...(props.disabled && { tabIndex: -1 })}>
                {/* Empty state */}
                {!props.isLoading && props.searchResults?.length === 0 && (
                  <div className="flex items-center justify-center py-5 dark:text-white">
                    No results found.
                  </div>
                )}

                {/* Loading state */}
                {props.isLoading && (
                  <CommandGroup heading="Loading..." {...(props.disabled && { tabIndex: -1 })}>
                    {Array.from(Array(3).keys()).map((key) => {
                      return (
                        <CommandItem
                          key={key}
                          value={`${key}-loading`}
                          className="space-x-4"
                          {...(props.disabled && { tabIndex: -1 })}
                        >
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-4 w-full rounded-full" />
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                )}
                {/* Search results returned from API */}
                {props.searchResults && (
                  <CommandGroup heading="Search results">
                    {props.searchResults.map((searchResult, idx) => {
                      return (
                        <CommandItem
                          key={searchResult.id}
                          value={searchResult.value}
                          onSelect={() => {
                            console.log("CommandItem.onSelect", { searchResult })
                          }}
                          {...(props.disabled && { tabIndex: -1 })}
                        >
                          <span>{searchResult.label}</span>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                )}
              </CommandList>
              {/* Footer keyboard shortcuts */}
              <div className="hidden justify-end space-x-4 md:flex">
                <CommandItem
                  className="cursor-help space-x-2 hover:bg-transparent"
                  disabled
                  title={`Press ⌘ + Enter or CTRL + Enter to focus search`}
                  {...(props.disabled && { tabIndex: -1 })}
                >
                  <span>Focus</span>
                  <KeyboardShortcut className="h-[29px] content-center">
                    {getOperatingSystem() === "Windows" ? (
                      <kbd className="h-4 w-4">CTRL</kbd>
                    ) : (
                      <CommandIcon className="h-4 w-4" />
                    )}
                  </KeyboardShortcut>
                  <KeyboardShortcut>
                    <kbd className="h-4 w-4">↵</kbd>
                  </KeyboardShortcut>
                </CommandItem>
                <CommandItem
                  className="cursor-help space-x-2 hover:bg-transparent"
                  disabled
                  title="Press Enter to search"
                >
                  <span>Search</span>
                  <KeyboardShortcut>
                    <kbd className="h-4 w-4">↵</kbd>
                  </KeyboardShortcut>
                </CommandItem>
                <CommandItem
                  className="cursor-help space-x-2 hover:bg-transparent"
                  disabled
                  title="Press ↑ or ↓ to navigate up or down"
                >
                  <span>Navigate up / down</span>
                  <KeyboardShortcut>
                    <kbd className="h-4 w-4">↑</kbd>
                  </KeyboardShortcut>
                  <KeyboardShortcut>
                    <kbd className="h-4 w-4">↓</kbd>
                  </KeyboardShortcut>
                </CommandItem>
                <CommandItem
                  className="cursor-help space-x-2 hover:bg-transparent"
                  disabled
                  title="Press ALT + Enter to search"
                >
                  <span>Select</span>
                  <KeyboardShortcut>
                    <kbd className="h-4 w-4">ALT</kbd>
                  </KeyboardShortcut>
                  <KeyboardShortcut>
                    <kbd className="h-4 w-4">↵</kbd>
                  </KeyboardShortcut>
                </CommandItem>
              </div>
            </Command>
          </>
        )}
      </ClientOnly>
    </div>
  )
}
