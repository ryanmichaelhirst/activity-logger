import { db } from "@/lib/db.server"
import { app } from "@/utils/app.server"
import { ActionFunctionArgs } from "@remix-run/node"
import { redirect } from "remix-typedjson"
import { route } from "routes-gen"
import invariant from "tiny-invariant"

import { z } from "zod"

export const action = (args: ActionFunctionArgs) =>
  app(args)
    .withUser()
    .parseForm(
      z.object({
        type: z.enum(["movie", "book", "anime", "place"]),
        name: z.string().min(1),
        objectId: z.string().optional(),
        photoUrl: z.string().optional(),
      }),
    )
    .build(async ({ form, user }) => {
      invariant(user, "User is required to create an activity")

      await db.activity.create({
        data: {
          type: form.type,
          name: form.name,
          userId: user?.id,
          objectId: form.objectId,
          photoUrl: form.photoUrl,
        },
      })

      return redirect(route("/profile"))
    })
