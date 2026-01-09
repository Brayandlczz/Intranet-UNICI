import { createServerSupabase } from "./utils/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const supabase = createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  const publicRoutes = ["/login", "/signup", "/", "/favicon.ico"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isStaticFile = pathname.includes(".");

  if (!session && !isPublicRoute && !isStaticFile) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
