import { MetaFunction } from "@remix-run/node"
import { useEffect } from "react"
import { useTypedLoaderData } from "remix-typedjson"

import { loader } from "./loader.server"

export { loader }

export const meta: MetaFunction = () => [{ title: "Remix Railway | Create activity" }]

export default function Page() {
  const data = useTypedLoaderData<typeof loader>()

  useEffect(() => {
    if (!data.stripeSession) return
    if (data.stripeSession.status === "open") {
      console.log("Stripe session is open")
    } else if (data.stripeSession.status === "complete") {
      console.log("Stripe session is complete")
    }
  }, [data.stripeSession])

  return (
    <main className="mx-auto mb-40 flex flex-col space-y-6 px-16 pt-6 lg:px-24">
      <h1 className="text-center text-5xl">Payment complete</h1>
      <div className="space-x-2 text-center text-2xl">
        Thank you for your purchase! Your payment has been processed successfully.
      </div>
    </main>
  )
}
