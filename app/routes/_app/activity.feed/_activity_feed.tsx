import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ACTIVITY_TYPES, ActivityTypeKey } from "@/lib/activityTypes"
import { db } from "@/lib/db.server"
import { formatFullDate } from "@/utils"
import { AppArgs, app } from "@/utils/app.server"
import { typedjson, useTypedLoaderData } from "remix-typedjson"

export const loader = (args: AppArgs) =>
  app(args).build(async (ctx) => {
    const activities = await db.activity.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
      take: 20,
    })

    return typedjson({
      activities,
    })
  })

// Source: https://dribbble.com/shots/23111025-Zwift-Activity-Cards
export default function ActivityFeed() {
  const data = useTypedLoaderData<typeof loader>()

  console.log("data", data)

  return (
    <main className="">
      <ul className="space-y-6">
        {data.activities.map((activity) => {
          return (
            <li key={activity.id}>
              <Card>
                <CardHeader className="flex flex-row items-center space-x-4">
                  {/* <img src={activity.user.photoUrl} className="h-12 w-12 rounded-full" /> */}
                  <div>
                    <CardTitle>{activity.user.name}</CardTitle>
                    <CardDescription className="mt-2">
                      <time
                        dateTime={activity.createdAt.toISOString()}
                        className="text-slate-500 dark:text-slate-300"
                      >
                        {formatFullDate(activity.createdAt)}
                      </time>
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-x-2">
                    <span className="capitalize">
                      {ACTIVITY_TYPES[activity.type as ActivityTypeKey].verb}
                    </span>
                    <span>{activity.name}</span>
                  </div>
                  {activity.photoUrl ? (
                    <img src={activity.photoUrl} className="h-40 w-full rounded" />
                  ) : (
                    <div className="h-40 w-full rounded bg-slate-300 dark:bg-slate-500" />
                  )}
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
