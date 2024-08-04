import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((auth, req) => {
    if (isPublicRoute(req)) return; // if it's a public route, do nothing

    const { pathname } = new URL(req.url);

    // if the user is not logged in navigate to sign in page
    if (!auth().userId) {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('returnBack', req.url);
        return NextResponse.redirect(signInUrl);
    }

    let path = "/select-org";

    // if the user is logged in and has an organization selected navigate that page
    if (auth().orgId) {
        path = `/organization/${auth().orgId}`;
    }

    // if the user is logged in but has no org selected navigate to /select-org page
    if (pathname !== path) {
        const orgSelection = new URL(path, req.url);
        return NextResponse.redirect(orgSelection);
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};

