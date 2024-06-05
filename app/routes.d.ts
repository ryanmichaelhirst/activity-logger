declare module "routes-gen" {
  export type RouteParams = {
    "/": Record<string, never>;
    "/activity/create": Record<string, never>;
    "/activity/feed": Record<string, never>;
    "/activity/search": Record<string, never>;
    "/auth/login": Record<string, never>;
    "/auth/logout": Record<string, never>;
    "/auth/redirect": Record<string, never>;
    "/checkout": Record<string, never>;
    "/checkout/complete": Record<string, never>;
    "/health-check": Record<string, never>;
    "/preferences/theme": Record<string, never>;
    "/privacy": Record<string, never>;
    "/profile": Record<string, never>;
    "/stripe/event": Record<string, never>;
    "/terms": Record<string, never>;
  };

  export function route<
    T extends
      | ["/"]
      | ["/activity/create"]
      | ["/activity/feed"]
      | ["/activity/search"]
      | ["/auth/login"]
      | ["/auth/logout"]
      | ["/auth/redirect"]
      | ["/checkout"]
      | ["/checkout/complete"]
      | ["/health-check"]
      | ["/preferences/theme"]
      | ["/privacy"]
      | ["/profile"]
      | ["/stripe/event"]
      | ["/terms"]
  >(...args: T): typeof args[0];
}
