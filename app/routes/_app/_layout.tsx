import { ButtonLink } from "@/components/ButtonLink"
import { Logo } from "@/components/Logo"
import { SearchInput } from "@/components/SearchInput"
import { Button } from "@/components/ui/button"
import { getThemeFromSession } from "@/routes/_app/preferences.theme/_preferences_theme"
import { cn } from "@/utils"
import { app } from "@/utils/app.server"
import { LoaderFunctionArgs } from "@remix-run/node"
import { Outlet, useLocation, useSubmit } from "@remix-run/react"
import {
  AlignJustifyIcon,
  BadgeCheckIcon,
  CirclePlusIcon,
  CreditCardIcon,
  LogOutIcon,
  UserCircleIcon,
} from "lucide-react"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { route } from "routes-gen"
import { z } from "zod"

export const loader = async (args: LoaderFunctionArgs) =>
  app(args)
    .parseQuery(
      z.object({
        session_id: z.string().optional(),
      }),
    )
    .withUser()
    .build(async ({ user, session }) => {
      const theme = getThemeFromSession(session)

      return typedjson({
        user,
        theme,
      })
    })

export default function Page() {
  const data = useTypedLoaderData<typeof loader>()

  return (
    <div className="flex">
      {/* Header / menu bar */}
      <Sidebar user={data.user} />
      {/* Main content */}
      <div className="flex h-screen grow basis-4/5 flex-col lg:border-l">
        <TopBar />
        <div className="grow overflow-auto px-4 py-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function TopBar() {
  return (
    <div className="w-full px-4 py-6 lg:border-b lg:px-8">
      <SearchInput inputProps={{ placeholder: "Search" }} />
    </div>
  )
}

// How to have multiple layouts in remix: https://github.com/remix-run/remix/discussions/7296
// Source: https://ui.shadcn.com/examples/music
function Sidebar(props: { user: any }) {
  const location = useLocation()
  const currentRoute = location.pathname
  const submit = useSubmit()

  return (
    <div>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Logo />
          <div className="mt-8 space-y-1">
            <ButtonLink
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start space-x-2",
                currentRoute === route("/activity/feed") && "bg-accent",
              )}
              to={route("/activity/feed")}
            >
              <AlignJustifyIcon className="h-4 w-4" />
              <span>Feed</span>
            </ButtonLink>
            <ButtonLink
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start space-x-2",
                currentRoute === route("/activity/create") && "bg-accent",
              )}
              to={route("/activity/create")}
            >
              <CirclePlusIcon />
              <span>Create activity</span>
            </ButtonLink>
            <ButtonLink
              variant="ghost"
              className={cn(
                "flex w-full items-center justify-start space-x-2",
                currentRoute === route("/profile") && "bg-accent",
              )}
              to={route("/profile")}
            >
              <UserCircleIcon />
              <span>Profile</span>
            </ButtonLink>
            <Button
              variant="ghost"
              className="flex w-full items-center justify-start space-x-2"
              onClick={() => {
                submit(
                  {},
                  {
                    action: route("/auth/logout"),
                    method: "POST",
                  },
                )
              }}
            >
              <LogOutIcon />
              <span>Logout</span>
            </Button>
            {props.user.payment.length === 0 ? (
              <>
                <ButtonLink
                  variant="ghost"
                  className="flex w-full items-center justify-start space-x-2"
                  to={route("/checkout")}
                >
                  <CreditCardIcon />
                  <span>Upgrade to Premium</span>
                </ButtonLink>
              </>
            ) : (
              <Button variant="ghost" className="flex w-full items-center justify-start space-x-2">
                <BadgeCheckIcon />
                <span>Premium</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
