import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((auth, req) => {
    const { pathname } = new URL(req.url);

    // If the route is public and the user is not authenticated, do nothing (allow access)
    if (isPublicRoute(req) && !auth().userId) return;

    // If the user is not logged in, redirect to the sign-in page
    if (!auth().userId) {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('returnBack', req.url);
        return NextResponse.redirect(signInUrl);
    }

    // User is logged in
    const selectedOrgId = auth().orgId;

    // Determine where to redirect based on the selected organization
    let redirectPath = null;

    if (selectedOrgId) {
        // Redirect to the organization's homepage if an organization is selected
        redirectPath = `/organization/${selectedOrgId}`;
    } else {
        // Redirect to the organization selection page if no organization is selected
        redirectPath = '/select-org';
    }

    // Redirect logged-in users away from public routes
    if (isPublicRoute(req) && auth().userId) {
        return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    // Redirect to the correct path if the current pathname is not the desired one
    if (pathname !== redirectPath) {
        return NextResponse.redirect(new URL(redirectPath, req.url));
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


