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

const sharedProtectedRoutes = [
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
];

const guestRoutes = ["/dashboard/guest"];
const hostRoutes = ["/dashboard/host", "/host"];
const adminRoutes = ["/dashboard/admin", "/admin"];

function matchesRoute(pathname: string, routes: string[]) {
    return routes.some((route) =>
        route === "/"
            ? pathname === "/"
            : pathname === route || pathname.startsWith(`${route}/`),
    );
}

function normalizeRole(role: string | null) {
    if (role === "guest") return "user";
    if (role === "user" || role === "host" || role === "admin") return role;
    return null;
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
        (route) =>
            cleanPath === route || cleanPath.startsWith(`${route}/`),
    );

    if (isAuthPath) return null;

    return decodedPath;
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

    const rawRole =
        request.cookies.get("user_role")?.value ||
        request.cookies.get("better-auth.role")?.value ||
        request.cookies.get("__Secure-better-auth.role")?.value ||
        null;

    const role = normalizeRole(rawRole);

    const { pathname, search, searchParams } = request.nextUrl;
    const currentPath = `${pathname}${search}`;
    const requestedRedirect = getSafeRedirectPath(searchParams.get("redirect"));

    const isPublicRoute = matchesRoute(pathname, publicRoutes);
    const isAuthRoute = matchesRoute(pathname, authRoutes);
    const isSharedProtectedRoute = matchesRoute(pathname, sharedProtectedRoutes);
    const isGuestRoute = matchesRoute(pathname, guestRoutes);
    const isHostRoute = matchesRoute(pathname, hostRoutes);
    const isAdminRoute = matchesRoute(pathname, adminRoutes);

    const isProtectedRoute =
        isSharedProtectedRoute || isGuestRoute || isHostRoute || isAdminRoute;

    if (pathname === "/dashboard" && sessionCookie) {
        return NextResponse.redirect(
            new URL(getRedirectPathByRole(role), request.url),
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
                request.url,
            ),
        );
    }

    if (isGuestRoute && role !== "user") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (isHostRoute && role !== "host" && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (isAdminRoute && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest).*)",
    ],
};