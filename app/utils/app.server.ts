import { ActionFunctionArgs, LoaderFunctionArgs, type TypedResponse } from "@remix-run/node"

import type { TypedJsonResponse } from "remix-typedjson"

import type { z, ZodSchema } from "zod"
import { zx } from "zodix"

import { getUser, requireUser } from "@/lib/auth.server"
import { getSession, sessionStorage } from "@/lib/session.server"
import { jsonString } from "@/utils"

// This is an "experiment" with a fluent API for defining loaders and actions
// It offers a few benefits:
// - It's more concise
// - It's more readable
// - It's more composable
// - It's more type-safe
// - It's more flexible
// - It's more testable
// - It's more functional!
// - It's more fun!
//
// (comment generated by chatgpt)

// Example loader using app
// const loader = async (args: DataFunctionArgs) =>
//   app(args)
//     .parseParams(z.object({ id: z.string() }))
//     .parseQuery(z.object({ example: z.string() }))
//     .parseForm(z.object({ name: z.string() }))
//     // .parseBody(z.object({ testing: z.string() }))
//     .build(async (ctx) => {
//       return json({
//         id: ctx.params.id,
//         example: ctx.query.example,
//         name: ctx.form.name,
//         // testing: ctx.body.testing,
//       });
//     });

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type AppArgs = LoaderFunctionArgs | ActionFunctionArgs

export function app<T extends AppArgs>(args: T) {
  return new App<T>(args).default()
}

type Session = Awaited<ReturnType<typeof getSession>>

type WithParams<T> = T & { params: AppArgs["params"] }
type WithRequest<T> = T & { request: AppArgs["request"] }
type WithUrl<T> = T & { url: URL }
type WithSession<T> = T & { session: Session }
type MaybeWithUser<T> = T & { user?: Awaited<ReturnType<typeof getUser>> }

class App<T extends {}> {
  private readonly args: T
  readonly pipeline: Array<(args: T) => Promise<any>>

  constructor(args: T) {
    this.args = args
    this.pipeline = []
  }

  with<X>(fn: (args: Prettify<T>) => Promise<X>): App<Omit<T, keyof X> & X> {
    this.pipeline.push(fn)
    return this as unknown as App<Omit<T, keyof X> & X>
  }

  default<X extends App<WithRequest<T>>>(this: X) {
    return this.with(async (args) => {
      const url = new URL(this.args.request.url)
      const session = await getSession(this.args.request)

      return { url, session }
    })
  }

  parseParams<X extends App<WithParams<T>>, Schema extends ZodSchema>(this: X, schema: Schema) {
    return this.with(async (args) => {
      const parsedParams = await zx.parseParamsSafe(args.params, schema)
      if (!parsedParams.success) {
        throw new Error("Error in parseParams()")
      }
      return { params: parsedParams.data } as { params: z.infer<Schema> }
    })
  }

  parseQuery<X extends App<WithRequest<T>>, Schema extends ZodSchema>(this: X, schema: Schema) {
    return this.with(async (args) => {
      const parsedQuery = await zx.parseQuerySafe(args.request, schema)
      if (!parsedQuery.success) {
        throw new Error("Error in parseQuery()")
      }

      return { query: parsedQuery.data } as { query: z.infer<Schema> }
    })
  }

  parseForm<X extends App<WithRequest<T>>, Schema extends ZodSchema>(this: X, schema: Schema) {
    return this.with(async (args) => {
      const parsedForm = await zx.parseFormSafe(args.request, schema)
      if (!parsedForm.success) {
        throw new Error("Error in parseForm()")
      }

      return { form: parsedForm.data } as { form: z.infer<Schema> }
    })
  }

  parseBody<X extends App<WithRequest<T>>, Schema extends ZodSchema>(this: X, schema: Schema) {
    return this.with(async (args) => {
      const body = jsonString().safeParse(await args.request.text())
      if (!body.success) {
        throw new Error("Error in parseBody() - 1")
      }

      const parsedBody = schema.safeParse(body.data)
      if (!parsedBody.success) {
        throw new Error("Error in parseBody() - 2")
      }

      return { body: parsedBody.data } as { body: z.infer<Schema> }
    })
  }

  withUser<X extends App<WithRequest<T>>>(this: X) {
    return this.with(async (args) => {
      const user = await requireUser(args.request)

      return { user }
    })
  }
  async build<
    X extends App<WithUrl<WithRequest<WithSession<MaybeWithUser<T>>>>>,
    Resp extends Response | TypedResponse | TypedJsonResponse,
  >(this: X, fn: (args: Prettify<T>) => Promise<Resp>) {
    const args = this.args

    for (let pipelineFn of this.pipeline) {
      const newArgs = await pipelineFn(args)
      Object.assign(args, newArgs)
    }

    const response = await fn(args)

    // TODO: Is this needed?
    if (
      args.request.method !== "GET" &&
      Object.keys(args.session.data).length > 0 &&
      !response.headers.has("Set-Cookie")
    ) {
      response.headers.set("Set-Cookie", await sessionStorage.commitSession(args.session))
    }

    return response
  }
}
