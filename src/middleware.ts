import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const path = req.nextUrl.pathname

        // Admin Only
        if (path.startsWith("/admin") && token?.role !== "SYS") {
            return NextResponse.redirect(new URL("/home", req.url))
        }

        // Manager Only (Approvals)
        if (path.startsWith("/approvals") && !["TL", "DM", "DDM", "SYS"].includes(token?.role as string)) {
            return NextResponse.redirect(new URL("/home", req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
)

export const config = { matcher: ["/home", "/admin/:path*", "/plan", "/report", "/kpi", "/approvals", "/profile"] }
