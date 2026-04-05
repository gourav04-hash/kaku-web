import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        // Basic role-based redirection logic
        if (path.startsWith("/doctor") && token?.role !== "DOCTOR") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }
        if (path.startsWith("/pharmacist") && token?.role !== "PHARMACIST") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }
        if (path.startsWith("/admin") && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }
        if (path.startsWith("/patient") && token?.role !== "PATIENT") {
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",
        "/doctor",
        "/doctor/:path*",
        "/pharmacist",
        "/pharmacist/:path*",
        "/patient",
        "/patient/:path*",
        "/admin",
        "/admin/:path*",
    ],
}
