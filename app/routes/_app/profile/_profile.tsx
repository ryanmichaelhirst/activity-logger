import { db } from "@/lib/db.server"
import { app } from "@/utils/app.server"
import { LoaderFunctionArgs } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import invariant from "tiny-invariant"

export const loader = (args: LoaderFunctionArgs) =>
  app(args)
    .withUser()
    .build(async ({ user }) => {
      invariant(user, "User is required to view profile")

      const userActivities = await db.activity.findMany({
        where: {
          userId: user?.id,
        },
      })

      return typedjson({
        userActivities,
      })
    })

export default function Page() {
  const data = useTypedLoaderData<typeof loader>()

  return (
    <div className="mx-auto min-h-screen w-2/3">
      <p className="text-2xl font-medium">User activities</p>
      <ul className="mt-5 space-y-6">
        {data.userActivities.map((activity) => {
          return (
            <li key={activity.id}>
              <div className="flex items-center space-x-4">
                {activity.photoUrl ? (
                  <img src={activity.photoUrl} className="h-24 w-24" />
                ) : (
                  <div className="h-24 w-24 bg-gray-200" />
                )}
                <span>{activity.name}</span>
                <span>{activity.type}</span>
                <span>{activity.objectId}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
