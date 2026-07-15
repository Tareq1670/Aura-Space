"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type UserRole = "guest" | "host" | "admin";

interface NavRoute {
  label: string;
  href: string;
  highlight?: boolean;
}

const publicRoutes: NavRoute[] = [
  { label: "Home", href: "/" },
  { label: "Explore Places", href: "/listings" },
  { label: "Contact Us", href: "/contact" },
];

const guestRoutes: NavRoute[] = [
  { label: "Home", href: "/" },
  { label: "Explore Places", href: "/listings" },
  { label: "My Trips", href: "/dashboard/guest/bookings", highlight: true },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faq" },
];

const hostRoutes: NavRoute[] = [
  { label: "Home", href: "/" },
  { label: "Explore Places", href: "/listings" },
  { label: "List Your Space", href: "/dashboard/host/items/add", highlight: true },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faq" },
];

const adminRoutes: NavRoute[] = [
  { label: "Home", href: "/" },
  { label: "Explore Places", href: "/listings" },
  { label: "Overview", href: "/dashboard/admin/main", highlight: true },
  { label: "Approvals", href: "/dashboard/admin/properties", highlight: true },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faq" },
];

const roleBadgeStyles: Record<UserRole, string> = {
  guest: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  host: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  admin: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

const roleLabels: Record<UserRole, string> = {
  guest: "Guest",
  host: "Host",
  admin: "Admin",
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  const userRole: UserRole = (() => {
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (role === "host") return "host";
    if (role === "admin") return "admin";
    return "guest";
  })();

  const routes: NavRoute[] = (() => {
    if (!session) return publicRoutes;
    if (userRole === "admin") return adminRoutes;
    if (userRole === "host") return hostRoutes;
    return guestRoutes;
  })();

  const profileMenuRoutes: NavRoute[] = [
    { label: "Dashboard", href: `/dashboard/${userRole}/main` },
    { label: "My Profile", href: `/dashboard/${userRole}/profile` },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const isInside = (target: EventTarget | null) => {
      const node = target as Node;
      return (
        (mobileMenuRef.current && mobileMenuRef.current.contains(node)) ||
        (mobileToggleRef.current && mobileToggleRef.current.contains(node))
      );
    };

    const closeMenu = () => setIsMobileMenuOpen(false);
    const handleOutsideMouseDown = (e: MouseEvent) => {
      if (!isInside(e.target)) closeMenu();
    };
    const handleOutsideTouchStart = (e: TouchEvent) => {
      if (!isInside(e.target)) closeMenu();
    };

    window.addEventListener("scroll", closeMenu, { passive: true });
    document.addEventListener("mousedown", handleOutsideMouseDown);
    document.addEventListener("touchstart", handleOutsideTouchStart);

    return () => {
      window.removeEventListener("scroll", closeMenu);
      document.removeEventListener("mousedown", handleOutsideMouseDown);
      document.removeEventListener("touchstart", handleOutsideTouchStart);
    };
  }, [isMobileMenuOpen]);

  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setIsMobileMenuOpen(false);
      setIsDropdownOpen(false);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);

    try {
      await authClient.signOut();
    } catch {
      // ignore — redirect regardless
    }
    const redirect = encodeURIComponent(pathname);
    window.location.href = `/login?redirect=${redirect}`;
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const ProfileIcon = ({ label }: { label: string }) =>
    label === "Dashboard" ? (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-lg shadow-indigo-950/5 border-b border-slate-200/80"
            : "bg-white border-b border-slate-100"
        }`}
      >
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <span className="text-xl font-extrabold tracking-tight text-slate-950">
                Aura<span className="text-indigo-600">Space</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive(route.href)
                      ? "text-indigo-600 bg-indigo-50"
                      : route.highlight
                      ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                  }`}
                >
                  {route.highlight && <span className="mr-1">✦</span>}
                  {route.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {isPending ? (
                <div className="hidden lg:flex items-center gap-3">
                  <div className="w-24 h-10 rounded-full bg-slate-100 animate-pulse" />
                </div>
              ) : session ? (
                <div className="hidden lg:block relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center gap-2 p-1 pr-2.5 rounded-full border transition-all active:scale-[0.98] ${
                      isDropdownOpen
                        ? "border-indigo-300 bg-indigo-50/50 shadow-md shadow-indigo-600/5"
                        : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-600/5"
                    }`}
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
                      />
                    ) : (
                      <span className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-bold">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <svg
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className={`absolute right-0 mt-2.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-950/10 overflow-hidden transition-all duration-200 origin-top-right ${
                      isDropdownOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-indigo-50/80 to-slate-50/50">
                      <div className="flex items-center gap-3">
                        {session.user.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                          />
                        ) : (
                          <span className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-bold">
                            {session.user.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{session.user.name}</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{session.user.email}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 mt-3 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${roleBadgeStyles[userRole]}`}
                      >
                        {roleLabels[userRole]} Account
                      </span>
                    </div>

                    <div className="p-1.5">
                      {profileMenuRoutes.map((route) => (
                        <Link
                          key={route.href}
                          href={route.href}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                            isActive(route.href)
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                          }`}
                        >
                          <ProfileIcon label={route.label} />
                          {route.label}
                        </Link>
                      ))}
                    </div>

                    <div className="p-1.5 border-t border-slate-100">
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        {isSigningOut ? "Signing out..." : "Sign Out"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all active:scale-[0.98]"
                  >
                    Register
                  </Link>
                </div>
              )}

              <button
                ref={mobileToggleRef}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition active:scale-95"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>

        <div
          ref={mobileMenuRef}
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-5 pt-2 bg-white border-t border-slate-100 overflow-y-auto max-h-[calc(100vh-4rem)]">
            {session && (
              <div className="p-3 mb-3 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-slate-50/50 border border-slate-100">
                <div className="flex items-center gap-3">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                  ) : (
                    <span className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-base font-bold">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{session.user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleBadgeStyles[userRole]}`}
                  >
                    {roleLabels[userRole]}
                  </span>
                </div>
              </div>
            )}

            <p className="px-4 pt-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Menu</p>
            <div className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    isActive(route.href)
                      ? "text-indigo-600 bg-indigo-50"
                      : route.highlight
                      ? "text-emerald-600 hover:bg-emerald-50"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                  }`}
                >
                  {route.highlight && <span className="mr-1">✦</span>}
                  {route.label}
                </Link>
              ))}
            </div>

            {session && (
              <>
                <p className="px-4 pt-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">Account</p>
                <div className="flex flex-col gap-1">
                  {profileMenuRoutes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        isActive(route.href)
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                      }`}
                    >
                      <ProfileIcon label={route.label} />
                      {route.label}
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100">
              {session ? (
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition active:scale-[0.98]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition active:scale-[0.98]"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="h-16 md:h-[72px]" />
    </>
  );
}