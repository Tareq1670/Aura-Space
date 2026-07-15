import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
    "/",
    "/listings",
    "/about",
    "/contact",
    "/faq",
    "/how-it-works",
    "/privacy",
    "/terms",
    "/support",
    "/community",
    "/unauthorized",
];

const authRoutes = [
    "/login",
    "/register",
];

const protectedRoutes = [
    "/dashboard",
    "/checkout",
    "/payment",
];

function matchesRoute(pathname: string, routes: string[]) {
    return routes.some((route) =>
        route === "/"
            ? pathname === "/"
            : pathname === route || pathname.startsWith(`${route}/`)
    );
}

function getSafeRedirectPath(path: string | null) {
    if (!path) return null;

    let decodedPath = path;

    try {
        decodedPath = decodeURIComponent(path);
    } catch {
        decodedPath = path;
    }

    if (!decodedPath.startsWith("/") || decodedPath.startsWith("//")) {
        return null;
    }

    const cleanPath = decodedPath.split("?")[0];

    const isAuthPath = authRoutes.some(
        (route) => cleanPath === route || cleanPath.startsWith(`${route}/`)
    );

    if (isAuthPath) return null;

    return decodedPath;
}

function hasSessionCookie(request: NextRequest) {
    return Boolean(
        request.cookies.get("better-auth.session_token")?.value ||
            request.cookies.get("__Secure-better-auth.session_token")?.value
    );
}

export function middleware(request: NextRequest) {
    const { pathname, search, searchParams } = request.nextUrl;
    const sessionExists = hasSessionCookie(request);
    const currentPath = `${pathname}${search}`;
    const requestedRedirect = getSafeRedirectPath(searchParams.get("redirect"));

    const isPublicRoute = matchesRoute(pathname, publicRoutes);
    const isAuthRoute = matchesRoute(pathname, authRoutes);
    const isProtectedRoute = matchesRoute(pathname, protectedRoutes);

    if (isPublicRoute) {
        return NextResponse.next();
    }

    if (isProtectedRoute && !sessionExists) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", currentPath);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && sessionExists) {
        return NextResponse.redirect(
            new URL(requestedRedirect ?? "/dashboard", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\..*).*)",
    ],
};
