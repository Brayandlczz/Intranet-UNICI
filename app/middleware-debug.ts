import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const debugHeaders = new Headers(res.headers)
  debugHeaders.set("x-middleware-cache", "no-cache")
  debugHeaders.set("x-middleware-invoked", "true")
  debugHeaders.set("x-auth-status", session ? "authenticated" : "unauthenticated")

  if (session) {
    debugHeaders.set("x-auth-user-id", session.user.id)
    debugHeaders.set("x-auth-user-email", session.user.email || "no-email")

    const expiresAt = session.expires_at ? new Date(session.expires_at * 1000).toISOString() : "unknown"
    debugHeaders.set("x-auth-expires", expiresAt)
  }

  if (
    !session &&
    !req.nextUrl.pathname.startsWith("/_next") &&
    !req.nextUrl.pathname.startsWith("/api") &&
    req.nextUrl.pathname !== "/" &&
    !req.nextUrl.pathname.includes(".") &&
    !req.nextUrl.pathname.startsWith("/diagnostico") &&
    !req.nextUrl.pathname.startsWith("/diagnostico-sesion")
  ) {
    debugHeaders.set("x-redirect-reason", "unauthenticated-protected-route")
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/"
    return NextResponse.redirect(redirectUrl)
  }

  if (session && req.nextUrl.pathname === "/") {
    debugHeaders.set("x-redirect-reason", "authenticated-login-page")
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/dashboard"
    return NextResponse.redirect(redirectUrl)
  }

  const debugResponse = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  debugHeaders.forEach((value, key) => {
    debugResponse.headers.set(key, value)
  })

  return debugResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

