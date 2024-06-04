import { BookIcon, FilmIcon, MapPinIcon, PaletteIcon } from "lucide-react"

export const ACTIVITY_TYPES = {
  movie: {
    label: "Movie / TV",
    icon: FilmIcon,
    backgroundColor: "rgba(64, 165, 120, 1)",
    inactiveBgColor: "rgba(64, 165, 120, 0.5)",
    verb: "watched",
  },
  book: {
    label: "Book",
    icon: BookIcon,
    backgroundColor: "rgba(255, 170, 128, 1)",
    inactiveBgColor: "rgba(255, 170, 128, 0.5)",
    verb: "read",
  },
  anime: {
    label: "Anime",
    icon: PaletteIcon,
    backgroundColor: "rgba(255, 85, 128, 1)",
    inactiveBgColor: "rgba(255, 85, 128, 0.5)",
    verb: "watched",
  },
  place: {
    label: "Place",
    icon: MapPinIcon,
    backgroundColor: "rgba(116, 105, 182, 1)",
    inactiveBgColor: "rgba(116, 105, 182, 0.5)",
    verb: "visited",
  },
}

export type ActivityTypeKey = keyof typeof ACTIVITY_TYPES

export const ACTIVITY_TYPES_ARRAY = Object.entries(ACTIVITY_TYPES).map(([key, value]) => ({
  value: key,
  ...value,
}))
