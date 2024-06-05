import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ACTIVITY_TYPES, ACTIVITY_TYPES_ARRAY, ActivityTypeKey } from "@/lib/activityTypes"
import { db } from "@/lib/db.server"
import { formatFullDate } from "@/utils"
import { app } from "@/utils/app.server"
import { LoaderFunctionArgs } from "@remix-run/node"
import { useSearchParams } from "@remix-run/react"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import invariant from "tiny-invariant"
import { z } from "zod"

export const loader = (args: LoaderFunctionArgs) =>
  app(args)
    .withUser()
    .parseQuery(
      z.object({
        activityType: z.string().optional(),
      }),
    )
    .build(async ({ user, query }) => {
      invariant(user, "User is required to view profile")

      const userActivities = await db.activity.findMany({
        where: {
          userId: user?.id,
          ...(query.activityType && {
            type: query.activityType,
          }),
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return typedjson({
        user,
        userActivities,
      })
    })

// Source: https://dribbble.com/shots/23227942-Blog-Post-List-Design
// Source: https://dribbble.com/shots/20478375-User-profile-dark
export default function Page() {
  const data = useTypedLoaderData<typeof loader>()

  return (
    <div className="mx-auto min-h-screen w-2/3">
      <p className="text-2xl font-medium">{data.user.name}</p>
      <p className="mb-5 mt-2 text-lg text-slate-500 dark:text-slate-300">
        What I've been up to recently
      </p>
      <TagList />
      <ul className="mt-12 grid list-none grid-flow-row grid-cols-3 gap-6">
        {data.userActivities.map((activity) => {
          return (
            <li key={activity.id}>
              <Card>
                {activity.photoUrl && (
                  <img src={activity.photoUrl} className="h-40 w-full rounded-t-lg" />
                )}
                <CardContent>
                  <p className="mt-6 text-xl font-medium">{activity.name}</p>
                  <Badge
                    className="mt-4"
                    style={{
                      backgroundColor:
                        ACTIVITY_TYPES[activity.type as ActivityTypeKey].backgroundColor,
                    }}
                  >
                    {activity.type}
                  </Badge>
                  <div className="mt-4">
                    <time
                      dateTime={activity.createdAt.toISOString()}
                      className="text-slate-500 dark:text-slate-300"
                    >
                      {formatFullDate(activity.createdAt)}
                    </time>
                  </div>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function TagList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedActivityType = searchParams.get("activityType")

  return (
    <div className="flex space-x-2">
      {ACTIVITY_TYPES_ARRAY.map((item) => {
        const isSelected = item.value === selectedActivityType

        return (
          <Button
            key={item.value}
            value={item.value}
            onClick={(e) => {
              const value = e.currentTarget.value
              if (selectedActivityType === value) {
                searchParams.delete("activityType")
              } else {
                searchParams.set("activityType", value)
              }

              setSearchParams(searchParams)
            }}
            className="h-[unset] cursor-pointer rounded-full px-4 py-1 text-white"
            size="sm"
            style={{ backgroundColor: isSelected ? item.backgroundColor : item.inactiveBgColor }}
          >
            {item.label}
          </Button>
        )
      })}
    </div>
  )
}
