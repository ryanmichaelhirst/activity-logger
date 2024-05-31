const { flatRoutes } = require("remix-flat-routes")

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverModuleFormat: "cjs",
  serverPlatform: "node",
  tailwind: true,
  future: {},
  // ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
  ignoredRouteFiles: ["**/*"],
  cacheDirectory: "./node_modules/.cache/remix",
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes, {
      ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
    })
  },
  // Source: https://github.com/sergiodxa/remix-utils?tab=readme-ov-file#usage-with-cjs
  serverDependenciesToBundle: [
    /^remix-utils.*/,
    // If you installed is-ip optional dependency you will need these too
    "is-ip",
    "ip-regex",
    "super-regex",
    "clone-regexp",
    "function-timeout",
    "time-span",
    "convert-hrtime",
    "is-regexp",
  ],
}
