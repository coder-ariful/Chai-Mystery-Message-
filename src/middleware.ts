import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request })
    const url = request.nextUrl

    if (token && (
        url.pathname.startsWith('/sign-in') || 
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify')  ||
        url.pathname.startsWith('/')  
    )) {
         return NextResponse.redirect(new URL('/dash-broad', request.url))
    }


    // return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/",
        '/sign-in',
        '/sign-up',
        '/dash-broad/:path*',
        '/verify/:path*'
    ],
}