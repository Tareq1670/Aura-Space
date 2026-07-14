import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
    "/",
    "/spaces",
    "/search",
    "/about",
    "/contact",
    "/help",
    "/terms",
    "/privacy",
    "/unauthorized",
];

const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
];

const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/bookings",
    "/wishlist",
    "/favorites",
    "/messages",
    "/notifications",
    "/settings",
    "/checkout",
    "/payment",
    "/reviews",
    "/host",
    "/admin",
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

function getRoleFromCookies(request: NextRequest) {
    return (
        request.cookies.get("user_role")?.value ||
        request.cookies.get("role")?.value ||
        request.cookies.get("better-auth.role")?.value ||
        request.cookies.get("__Secure-better-auth.role")?.value ||
        null
    );
}

function getRedirectPathByRole(role: string | null) {
    if (role === "admin") return "/dashboard/admin/main";
    if (role === "host") return "/dashboard/host/main";
    return "/dashboard/guest/main";
}

export function middleware(request: NextRequest) {
    const sessionCookie =
        request.cookies.get("better-auth.session_token")?.value ||
        request.cookies.get("__Secure-better-auth.session_token")?.value;

    const role = getRoleFromCookies(request);

    const { pathname, search, searchParams } = request.nextUrl;
    const currentPath = `${pathname}${search}`;
    const requestedRedirect = getSafeRedirectPath(searchParams.get("redirect"));

    const isPublicRoute = matchesRoute(pathname, publicRoutes);
    const isAuthRoute = matchesRoute(pathname, authRoutes);
    const isProtectedRoute = matchesRoute(pathname, protectedRoutes);

    if (pathname === "/dashboard" && sessionCookie) {
        return NextResponse.redirect(
            new URL(getRedirectPathByRole(role), request.url)
        );
    }

    if (isProtectedRoute && !sessionCookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", currentPath);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && sessionCookie) {
        return NextResponse.redirect(
            new URL(
                requestedRedirect ?? getRedirectPathByRole(role),
                request.url
            )
        );
    }

    if (isPublicRoute) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)",
    ],
};