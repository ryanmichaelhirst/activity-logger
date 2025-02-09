import { ButtonLink } from "@/components/ButtonLink"
import { Logo } from "@/components/Logo"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getThemeFromSession } from "@/routes/_app/preferences.theme/_preferences_theme"
import { app } from "@/utils/app.server"
import { LoaderFunctionArgs } from "@remix-run/node"
import { Outlet, useNavigate, useSubmit } from "@remix-run/react"
import {
  AlignJustifyIcon,
  BadgeCheckIcon,
  CirclePlusIcon,
  CircleUserRoundIcon,
  CreditCardIcon,
  ListIcon,
  LogOutIcon,
} from "lucide-react"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { route } from "routes-gen"
import { z } from "zod"
import { Footer } from "./Footer"

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

type LayoutLoaderData = ReturnType<typeof useTypedLoaderData<typeof loader>>

// Remix layout docs: https://remix.run/docs/en/main/file-conventions/routes#nested-layouts-without-nested-urls
export default function Page() {
  const data = useTypedLoaderData<typeof loader>()

  return (
    <>
      {/* Header / menu bar */}
      <Menubar user={data.user} theme={data.theme} />
      {/* Main content */}
      <Outlet />
      {/* Footer */}
      <Footer />
    </>
  )
}

export function Menubar(props: LayoutLoaderData) {
  const submit = useSubmit()
  const navigate = useNavigate()

  return (
    <header className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Logo />
            <div className="hidden md:flex md:gap-x-6">
              <ButtonLink to={route("/") + "#features"} variant="ghost">
                Features
              </ButtonLink>
              <ButtonLink to={route("/") + "#pricing"} variant="ghost">
                Pricing
              </ButtonLink>
              <ButtonLink to={route("/") + "#faq"} variant="ghost">
                FAQ
              </ButtonLink>
            </div>
          </div>

          <div className="flex items-center gap-x-5 md:gap-x-8">
            <ThemeToggle theme={props.theme} />
            {/* User profile dropdown */}
            {props.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  {/* props.user.photoUrl does not work here? */}
                  <CircleUserRoundIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="px-4">
                  <DropdownMenuLabel>{props.user.name}</DropdownMenuLabel>
                  <DropdownMenuLabel className="font-normal">{props.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(route("/activity/create"))
                    }}
                    className="space-x-4"
                  >
                    <CirclePlusIcon />
                    <span>Create activity</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(route("/activity/feed"))
                    }}
                    className="space-x-4"
                  >
                    <AlignJustifyIcon />
                    <span>Feed</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigate(route("/profile"))
                    }}
                    className="space-x-4"
                  >
                    <ListIcon />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      submit(
                        {},
                        {
                          action: route("/auth/logout"),
                          method: "POST",
                        },
                      )
                    }}
                    className="space-x-4"
                  >
                    <LogOutIcon />
                    <span>Logout</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {props.user.payment.length === 0 ? (
                    <>
                      <Button
                        className="my-2 space-x-2"
                        onClick={() => {
                          navigate(route("/checkout"))
                        }}
                      >
                        <CreditCardIcon />
                        <span>Upgrade to Premium</span>
                      </Button>
                    </>
                  ) : (
                    <DropdownMenuLabel className="flex items-center space-x-4">
                      <BadgeCheckIcon />
                      <span>Premium</span>
                    </DropdownMenuLabel>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <ButtonLink
                to={route("/auth/login")}
                size="lg"
                variant="default"
                className="rounded-full !px-6 font-semibold"
              >
                Login
              </ButtonLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
