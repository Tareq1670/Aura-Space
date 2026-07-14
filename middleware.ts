import { NextRequest, NextResponse } from "next/server";

// ✅ Public Routes - কোনো authentication লাগবে না
const publicRoutes = [
    "/",
    "/spaces",           // সব spaces দেখা যাবে
    "/space",            // individual space details
    "/search",
    "/about",
    "/contact",
    "/help",
    "/terms",
    "/privacy",
    "/unauthorized",
    "/categories",       // categories browse
    "/locations",        // locations browse
];

// ✅ Auth Routes - শুধু logged out users এর জন্য
const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
];

// ✅ Protected Routes - শুধু logged in users এর জন্য
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
    "/reviews/create",   // review create করতে login লাগবে
    "/reviews/edit",     // review edit করতে login লাগবে
    "/host",
    "/admin",
];

// ✅ Semi-Protected Routes - দেখা যাবে, কিন্তু action এ login লাগবে
// এগুলো middleware এ handle করবো না, component level এ করবো
const semiProtectedRoutes = [
    "/reviews",          // reviews দেখা যাবে, কিন্তু লিখতে login লাগবে
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

    // ✅ Public routes - সবাই access করতে পারবে
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // ✅ Dashboard base route redirect
    if (pathname === "/dashboard" && sessionCookie) {
        return NextResponse.redirect(
            new URL(getRedirectPathByRole(role), request.url)
        );
    }

    // ✅ Protected routes - login ছাড়া access নেই
    if (isProtectedRoute && !sessionCookie) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", currentPath);
        return NextResponse.redirect(loginUrl);
    }

    // ✅ Auth routes - logged in হলে redirect
    if (isAuthRoute && sessionCookie) {
        return NextResponse.redirect(
            new URL(
                requestedRedirect ?? getRedirectPathByRole(role),
                request.url
            )
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|images|icons|fonts).*)",
    ],
};