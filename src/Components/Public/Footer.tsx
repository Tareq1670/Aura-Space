"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const exploreLinks = [
  { label: "All Listings", href: "/listings" },
  { label: "Premium Villas", href: "/listings?type=villa" },
  { label: "Event Venues", href: "/listings?type=event" },
  { label: "Urban Suites", href: "/listings?type=suite" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Become a Host", href: "/dashboard/properties/add" },
  { label: "Contact", href: "/contact" },
];

const supportLinks = [
  { label: "Help Center", href: "/support" },
  { label: "FAQs", href: "/faqs" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      type: "tween",
    },
  },
};

function LinkColumn({
  title,
  links,
  reduceMotion,
}: {
  title: string;
  links: { label: string; href: string }[];
  reduceMotion: boolean;
}) {
  return (
    <motion.div variants={itemVariants}>
      <h4 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors duration-300 hover:text-white"
            >
              <motion.span
                className="inline-block h-1 w-1 rounded-full bg-indigo-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: [1, 1.4, 1] }
                }
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  type: "tween",
                }}
              />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Footer() {
  const reduceMotion = !!useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
    >
      <div className="absolute inset-0">
        <div className="absolute -left-24 top-10 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto w-full container px-2 sm:px-0">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:py-20"
        >
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
            >
              <motion.div
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        rotate: 8,
                        scale: 1.05,
                        transition: {
                          type: "spring",
                          stiffness: 380,
                          damping: 16,
                        },
                      }
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25"
              >
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </motion.div>
              <span className="text-xl font-black tracking-[-0.02em] text-white">
                Aura<span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">Space</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-[1.8] text-white/60">
              Book premium stays, luxury villas, and exclusive event venues
              from a curated collection of verified properties worldwide.
            </p>

            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-indigo-300">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0l-7.5-4.615a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <a
                  href="mailto:hello@auraspace.com"
                  className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  hello@auraspace.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-indigo-300">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </div>
                <a
                  href="tel:+1234567890"
                  className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  +1 (234) 567-890
                </a>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-indigo-300">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-white/60">
                  Dhaka, Bangladesh
                </p>
              </li>
            </ul>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <LinkColumn
              title="Explore"
              links={exploreLinks}
              reduceMotion={reduceMotion}
            />
            <LinkColumn
              title="Company"
              links={companyLinks}
              reduceMotion={reduceMotion}
            />
            <LinkColumn
              title="Support"
              links={supportLinks}
              reduceMotion={reduceMotion}
            />
          </div>

          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h4 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">
              Stay Updated
            </h4>
            <p className="text-sm leading-[1.7] text-white/60">
              Subscribe to receive curated premium stays and exclusive
              AuraSpace opportunities.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="Your email address"
                aria-label="Email address"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-medium text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-indigo-400/60 focus:bg-white/[0.10] focus:ring-2 focus:ring-indigo-400/20"
              />

              <motion.button
                type="submit"
                whileHover={
                  reduceMotion
                    ? undefined
                    : { scale: 1.02, boxShadow: "0 12px 28px rgba(99,102,241,0.30)" }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:from-indigo-600 hover:to-violet-700"
              >
                Subscribe
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </motion.button>

              <div className="min-h-[20px]">
                {status === "success" && (
                  <p className="text-xs font-semibold text-emerald-400">
                    ✓ Subscribed successfully.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-xs font-semibold text-rose-400">
                    Please enter a valid email.
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
            type: "tween",
          }}
          className="flex flex-col items-center justify-between gap-5 border-t border-white/10 py-6 sm:flex-row sm:py-8"
        >
          <p className="text-xs text-white/50">
            © {currentYear}{" "}
            <span className="font-bold text-white/80">AuraSpace</span>. All
            rights reserved.
          </p>

          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -3,
                        scale: 1.05,
                        transition: {
                          type: "spring",
                          stiffness: 360,
                          damping: 18,
                        },
                      }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-white/60 transition-all duration-300 hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link href="/privacy" className="hover:text-white/80 transition-colors duration-300">
              Privacy
            </Link>
            <span className="h-3 w-px bg-white/10" />
            <Link href="/terms" className="hover:text-white/80 transition-colors duration-300">
              Terms
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}