import { useEffect, useState } from "react"

// TODO: This isn't always resolving immediately?
// Possibly getting rate limited or throttled by api?
export function useClientIpAddress() {
  const [ipAddress, setIpAddress] = useState<string>()

  useEffect(() => {
    async function getIpAddress() {
      const resp = await fetch("https://api.ipify.org")
      const result = await resp.text()

      if (result) {
        setIpAddress(result)
      }
    }

    getIpAddress()
  }, [])

  return [ipAddress, setIpAddress] as const
}
