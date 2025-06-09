import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === "ADMIN"

  // Public routes that don't require authentication
  const isPublicRoute = [
    "/",
    "/blog",
    "/auth/signin",
    "/auth/signup",
    "/api/auth"
  ].some(route => nextUrl.pathname.startsWith(route))

  // Admin-only routes
  const isAdminRoute = nextUrl.pathname.startsWith("/dashboard")

  // If trying to access admin routes without being logged in or being admin
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/signin", nextUrl))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  // If logged in and trying to access auth pages, redirect to dashboard
  if (isLoggedIn && isAdmin && ["/auth/signin", "/auth/signup"].includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
} 