"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import { motion, useReducedMotion } from "framer-motion";

const partners = [
    {
        id: 1,
        name: "Marriott International",
        logo: (
            <svg viewBox="0 0 120 28" fill="currentColor" className="h-6 w-auto sm:h-7">
                <text x="0" y="21" fontSize="18" fontWeight="800" fontFamily="system-ui" letterSpacing="-0.5">
                    MARRIOTT
                </text>
            </svg>
        ),
    },
    {
        id: 2,
        name: "Hilton Hotels",
        logo: (
            <svg viewBox="0 0 90 28" fill="currentColor" className="h-6 w-auto sm:h-7">
                <text x="0" y="21" fontSize="18" fontWeight="800" fontFamily="system-ui" letterSpacing="-0.5">
                    HILTON
                </text>
            </svg>
        ),
    },
    {
        id: 3,
        name: "Four Seasons",
        logo: (
            <svg viewBox="0 0 160 28" fill="currentColor" className="h-6 w-auto sm:h-7">
                <text x="0" y="21" fontSize="18" fontWeight="700" fontFamily="system-ui" letterSpacing="-0.3">
                    FOUR SEASONS
                </text>
            </svg>
        ),
    },
    {
        id: 4,
        name: "Hyatt",
        logo: (
            <svg viewBox="0 0 80 28" fill="currentColor" className="h-6 w-auto sm:h-7">
                <text x="0" y="21" fontSize="18" fontWeight="800" fontFamily="system-ui" letterSpacing="-0.5">
                    HYATT
                </text>
            </svg>
        ),
    },
    {
        id: 5,
        name: "Ritz-Carlton",
        logo: (
            <svg viewBox="0 0 160 28" fill="currentColor" className="h-6 w-auto sm:h-7">
                <text x="0" y="21" fontSize="17" fontWeight="700" fontFamily="system-ui" letterSpacing="0.5">
                    RITZ-CARLTON
                </text>
            </svg>
        ),
    },
    {
        id: 6,
        name: "Airbnb Luxe",
        logo: (
            <svg viewBox="0 0 150 28" fill="currentColor" className="h-6 w-auto sm:h-7">
                <text x="0" y="21" fontSize="18" fontWeight="800" fontFamily="system-ui" letterSpacing="-0.3">
                    AIRBNB LUXE
                </text>
            </svg>
        ),
    },
    {
        id: 7,
        name: "Accor Hotels",
        logo: (
            <svg viewBox="0 0 80 28" fill="currentColor" className="h-6 w-auto sm:h-7">
                <text x="0" y="21" fontSize="18" fontWeight="800" fontFamily="system-ui" letterSpacing="-0.5">
                    ACCOR
                </text>
            </svg>
        ),
    },
    {
        id: 8,
        name: "Radisson",
        logo: (
            <svg viewBox="0 0 120 28" fill="currentColor" className="h-6 w-auto sm:h-7">
                <text x="0" y="21" fontSize="18" fontWeight="800" fontFamily="system-ui" letterSpacing="-0.3">
                    RADISSON
                </text>
            </svg>
        ),
    },
    {
        id: 9,
        name: "Booking.com",
        logo: (
            <svg viewBox="0 0 150 28" fill="currentColor" className="h-6 w-auto sm:h-7">
                <text x="0" y="21" fontSize="17" fontWeight="800" fontFamily="system-ui" letterSpacing="-0.5">
                    BOOKING.COM
                </text>
            </svg>
        ),
    },
    {
        id: 10,
        name: "Visa",
        logo: (
            <svg viewBox="0 0 60 28" fill="currentColor" className="h-6 w-auto sm:h-7">
                <text x="0" y="21" fontSize="20" fontWeight="900" fontFamily="system-ui" letterSpacing="1" fontStyle="italic">
                    VISA
                </text>
            </svg>
        ),
    },
    {
        id: 11,
        name: "Mastercard",
        logo: (
            <svg viewBox="0 0 150 28" fill="currentColor" className="h-6 w-auto sm:h-7">
                <text x="0" y="21" fontSize="17" fontWeight="800" fontFamily="system-ui" letterSpacing="-0.3">
                    MASTERCARD
                </text>
            </svg>
        ),
    },
    {
        id: 12,
        name: "Stripe",
        logo: (
            <svg viewBox="0 0 80 28" fill="currentColor" className="h-6 w-auto sm:h-7">
                <text x="0" y="21" fontSize="18" fontWeight="800" fontFamily="system-ui" letterSpacing="-0.5">
                    STRIPE
                </text>
            </svg>
        ),
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.06,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

export default function BrandPartners() {
    const reduceMotion = useReducedMotion();

    return (
        <section className="w-full border-b border-slate-200/60 bg-white py-5 sm:py-6 lg:py-8">
            <div className="mx-auto w-full container px-4 sm:px-6 lg:px-8">
               

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                >
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-20" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-20" />

                    <Marquee
                        gradient={false}
                        speed={reduceMotion ? 0 : 22}
                        pauseOnHover
                        play={!reduceMotion}
                        autoFill
                    >
                        {partners.map((partner) => (
                            <motion.div
                                key={partner.id}
                                whileHover={
                                    reduceMotion
                                        ? undefined
                                        : {
                                              y: -3,
                                              scale: 1.06,
                                              transition: {
                                                  type: "spring",
                                                  stiffness: 300,
                                                  damping: 20,
                                              },
                                          }
                                }
                                className="group mx-4 flex cursor-default items-center justify-center rounded-2xl border border-transparent px-5 py-3 text-slate-300 transition-all duration-500 hover:border-indigo-100 hover:bg-indigo-50/50 hover:text-indigo-600 hover:shadow-sm sm:mx-6 sm:px-6 sm:py-4"
                            >
                                {partner.logo}
                            </motion.div>
                        ))}
                    </Marquee>
                </motion.div>
            </div>
        </section>
    );
}