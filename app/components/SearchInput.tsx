import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/utils"
import { SearchIcon } from "lucide-react"

export function SearchInput(props: { inputProps?: InputProps }) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        {...props.inputProps}
        className={cn("pl-8", props.inputProps?.className)}
      />
    </div>
  )
}
