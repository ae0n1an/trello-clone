import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware((auth, req) => {
    const { pathname } = new URL(req.url);

    // if the user is logged in and on the landing page
    if (auth().userId && isPublicRoute(req)) {
        // get them select an org
        let path = "/select-org";

        // navigate to the selected org
        if (auth().orgId) {
            path = `/organization/${auth().orgId}`;
        }

        const orgSelection = new URL(path, req.url);
        return NextResponse.redirect(orgSelection);
    }

    // If the user is not logged in and not on a public route
    // redirect to sign in page then once logged in redirect to previous url
    if (!auth().userId && !isPublicRoute(req) && req.nextUrl.pathname !== "/sign-in" && req.nextUrl.pathname !== "/sign-up") {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('returnBack', req.url);
        return NextResponse.redirect(signInUrl);
    }

    if (auth().userId && !auth().orgId && req.nextUrl.pathname !== "/select-org" ) {
        const orgSelection = new URL("/select-org", req.url);
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


