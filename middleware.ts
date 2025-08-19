import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const publicRoutes = ["/", "/login", "/api", "/_next", "/favicon.ico", "/diagnostico", "/diagnostico-sesion"]


  const isPublicRoute = publicRoutes.some(
    (route) => req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route),
  )

  const isStaticFile = req.nextUrl.pathname.includes(".")

  console.log(`[Middleware] Ruta: ${req.nextUrl.pathname}, Autenticado: ${!!session}`)

  if (!session && !isPublicRoute && !isStaticFile) {
    console.log(`[Middleware] Redirigiendo a login desde: ${req.nextUrl.pathname}`)
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/"
    return NextResponse.redirect(redirectUrl)
  }

  if (session && req.nextUrl.pathname === "/") {
    console.log("[Middleware] Usuario autenticado redirigiendo a dashboard")
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/dashboard"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

