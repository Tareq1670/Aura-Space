"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    useScroll,
    useSpring,
    type Variants,
    type Transition,
} from "framer-motion";
import type { Swiper as SwiperType } from "swiper";
import type { DateValue } from "@internationalized/date";

import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";

import { sliderData } from "./hero-data";
import { HeroSearchBar } from "./hero-search-bar";
import { getHomepageStats } from "@/lib/actions/property-public";

const AUTOPLAY_DELAY = 6000;
const PREVIEW_COUNT = 4;

const EASE_STANDARD = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_SPRING_OUT = [0.34, 1.56, 0.64, 1] as const;

const titleAnimation: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(12px)", rotateX: -15 },
    visible: {
        opacity: 1, y: 0, filter: "blur(0px)", rotateX: 0,
        transition: { duration: 0.8, ease: EASE_STANDARD },
    },
    exit: {
        opacity: 0, y: -30, filter: "blur(8px)", rotateX: 10,
        transition: { duration: 0.4, ease: "easeIn" },
    },
};

const subtitleAnimation: Variants = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: {
        opacity: 1, y: 0, filter: "blur(0px)",
        transition: { duration: 0.6, delay: 0.15, ease: EASE_STANDARD },
    },
    exit: {
        opacity: 0, y: -14, filter: "blur(4px)",
        transition: { duration: 0.3 },
    },
};

const tagAnimation: Variants = {
    hidden: { opacity: 0, x: -24, scale: 0.85, filter: "blur(6px)" },
    visible: {
        opacity: 1, x: 0, scale: 1, filter: "blur(0px)",
        transition: { duration: 0.5, ease: EASE_SPRING_OUT },
    },
    exit: {
        opacity: 0, x: 20, scale: 0.85, filter: "blur(4px)",
        transition: { duration: 0.3, ease: "easeIn" },
    },
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.5 },
    },
};

const staggerItem: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.9 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.45, ease: EASE_STANDARD },
    },
};

const magneticHover: Variants = {
    rest: { scale: 1 },
    hover: { scale: 1.08, transition: { type: "spring", stiffness: 400, damping: 17 } },
    tap: { scale: 0.95 },
};

const shimmerTransition: Transition = {
    duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1.5,
};

const shimmerAnimation = {
    initial: { backgroundPosition: "-200% 0" },
    animate: { backgroundPosition: "200% 0", transition: shimmerTransition },
};

const FALLBACK_HERO_STATS = [
    { value: "12K+", label: "Properties", icon: "🏠" },
    { value: "500+", label: "Cities", icon: "🌍" },
    { value: "98%", label: "Satisfaction", icon: "⭐" },
    { value: "24/7", label: "Support", icon: "💬" },
];

interface SearchState {
    location: string;
    checkIn: DateValue | null;
    guests: string;
}

function SlideProgress({ active }: { active: boolean }) {
    return (
        <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/15">
            <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: active ? 1 : 0 }}
                transition={
                    active
                        ? { duration: AUTOPLAY_DELAY / 1000, ease: "linear" }
                        : { duration: 0.25 }
                }
            />
        </div>
    );
}

function FloatingParticles() {
    const particles = useMemo(
        () =>
            Array.from({ length: 12 }, (_, i) => ({
                id: i,
                left: `${5 + i * 8}%`,
                top: `${10 + (i % 5) * 18}%`,
                size: 1 + (i % 3) * 0.5,
                duration: 3.5 + i * 0.45,
                delay: i * 0.28,
            })),
        [],
    );

    return (
        <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
            {particles.map((p) => (
                <motion.span
                    key={p.id}
                    className="absolute rounded-full bg-white/25"
                    style={{
                        left: p.left, top: p.top,
                        width: p.size, height: p.size,
                    }}
                    animate={{
                        y: [-24, 24, -24],
                        x: [-12, 12, -12],
                        opacity: [0.08, 0.5, 0.08],
                        scale: [0.6, 1.4, 0.6],
                    }}
                    transition={{
                        duration: p.duration, repeat: Infinity,
                        ease: "easeInOut", delay: p.delay,
                    }}
                />
            ))}
        </div>
    );
}

function AuroraBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
            <motion.div
                className="absolute -left-1/4 -top-1/4 h-[60%] w-[60%] rounded-full bg-indigo-600/[0.06] blur-[100px]"
                animate={{
                    x: [0, 100, -50, 0], y: [0, -80, 60, 0],
                    scale: [1, 1.3, 0.9, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-1/4 -right-1/4 h-[55%] w-[55%] rounded-full bg-violet-500/[0.05] blur-[100px]"
                animate={{
                    x: [0, -80, 60, 0], y: [0, 100, -50, 0],
                    scale: [1.1, 0.8, 1.2, 1.1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
                className="absolute left-1/3 top-1/3 h-[40%] w-[40%] rounded-full bg-fuchsia-500/[0.04] blur-[80px]"
                animate={{
                    x: [0, 60, -40, 0], y: [0, -60, 40, 0],
                    scale: [0.9, 1.15, 0.85, 0.9],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />
        </div>
    );
}

export default function Hero() {
    const router = useRouter();
    const heroRef = useRef<HTMLElement>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState<SearchState>({
        location: "",
        checkIn: null,
        guests: "2",
    });
    const [heroStats, setHeroStats] = useState(FALLBACK_HERO_STATS);

    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    const springConfig = { stiffness: 150, damping: 25, mass: 0.5 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);

    const backgroundX = useTransform(smoothMouseX, [0, 1], [-6, 6]);
    const backgroundY = useTransform(smoothMouseY, [0, 1], [-4, 4]);
    const overlayRotateX = useTransform(smoothMouseY, [0, 1], [2, -2]);
    const overlayRotateY = useTransform(smoothMouseX, [0, 1], [-2, 2]);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const parallaxOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);

    const currentSlide = sliderData[activeIndex];

    const previewSlides = useMemo(
        () =>
            Array.from({ length: PREVIEW_COUNT }, (_, i) => {
                const index = (activeIndex + i) % sliderData.length;
                return { ...sliderData[index], originalIndex: index, position: i };
            }),
        [activeIndex],
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            mouseX.set((e.clientX - rect.left) / rect.width);
            mouseY.set((e.clientY - rect.top) / rect.height);
        },
        [mouseX, mouseY],
    );

    const updateSearch = useCallback(
        <K extends keyof SearchState>(key: K, value: SearchState[K]) => {
            setSearchQuery((prev) => ({ ...prev, [key]: value }));
        },
        [],
    );

    const handleSearchSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const params = new URLSearchParams();
            const loc = searchQuery.location.trim();
            if (loc) params.set("location", loc);
            if (searchQuery.checkIn)
                params.set("checkIn", searchQuery.checkIn.toString());
            if (searchQuery.guests) params.set("guests", searchQuery.guests);
            router.push(`/listings?${params.toString()}`);
        },
        [searchQuery, router],
    );

    const scrollToNextSection = useCallback(() => {
        const next = heroRef.current?.nextElementSibling;
        if (next instanceof HTMLElement) {
            next.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }
        window.scrollTo({ top: window.innerHeight * 0.7, behavior: "smooth" });
    }, []);

    const handleFormBlur = useCallback(
        (e: React.FocusEvent<HTMLFormElement>) => {
            const next = e.relatedTarget as Node | null;
            if (!next || !e.currentTarget.contains(next)) {
                setIsSearchFocused(false);
            }
        },
        [],
    );

    const goToSlide = useCallback((index: number) => {
        swiperRef.current?.slideToLoop(index);
    }, []);

    useEffect(() => {
        let cancelled = false;
        getHomepageStats().then((res) => {
            if (cancelled || !res.success || !res.data) return;
            const d = res.data;
            const fmt = (n: number) => n >= 1000 ? `${Math.floor(n / 1000)}K+` : `${n}+`;
            setHeroStats([
                { value: fmt(d.totalProperties), label: "Properties", icon: "🏠" },
                { value: `${d.topCities.length}+`, label: "Cities", icon: "🌍" },
                {
                    value: d.avgRating > 0 ? `${Math.round((d.avgRating / 5) * 100)}%` : "98%",
                    label: "Satisfaction",
                    icon: "⭐",
                },
                { value: "24/7", label: "Support", icon: "💬" },
            ]);
        });
        return () => { cancelled = true; };
    }, []);

    return (
        <section
            ref={heroRef}
            onMouseMove={handleMouseMove}
            className="relative h-[68svh] min-h-[500px] max-h-[780px] w-full overflow-hidden bg-indigo-950 select-none sm:min-h-[560px] lg:h-[66svh] lg:min-h-[600px]"
        >
            <motion.div
                className="absolute inset-0 z-0"
                style={{ y: parallaxY, opacity: parallaxOpacity }}
            >
                <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    slidesPerView={1}
                    speed={1100}
                    loop
                    autoplay={{
                        delay: AUTOPLAY_DELAY,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    onSwiper={(s) => { swiperRef.current = s; }}
                    onSlideChange={(s) => setActiveIndex(s.realIndex)}
                    className="h-full w-full"
                    style={{ position: "absolute", inset: 0 }}
                >
                    {sliderData.map((slide, i) => (
                        <SwiperSlide key={slide.id}>
                            <motion.div
                                className="absolute inset-[-12px]"
                                style={{ x: backgroundX, y: backgroundY }}
                            >
                                <Image
                                    height={1080} width={1920}
                                    src={slide.image} alt=""
                                    loading={i <= 1 ? "eager" : "lazy"}
                                    decoding="async" draggable={false}
                                    className="pointer-events-none h-full w-full object-cover"
                                />
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="absolute inset-0 z-[1] bg-gradient-to-b from-indigo-950/65 via-indigo-950/50 to-indigo-950/95" />
                <div className="absolute inset-0 z-[1] bg-gradient-to-r from-indigo-950/90 via-indigo-950/35 to-indigo-950/20" />
                <div className="absolute inset-x-0 bottom-0 z-[1] h-36 bg-gradient-to-t from-indigo-950 via-indigo-950/80 to-transparent" />
            </motion.div>

            <AuroraBackground />
            <FloatingParticles />

            <motion.div
                className="pointer-events-none absolute right-[12%] top-[8%] z-[2] h-48 w-48 rounded-full bg-indigo-500/[0.08] blur-3xl sm:h-64 sm:w-64"
                animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.16, 0.05], rotate: [0, 180, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="pointer-events-none absolute bottom-20 left-[8%] z-[2] h-36 w-36 rounded-full bg-violet-400/[0.08] blur-3xl sm:h-48 sm:w-48"
                animate={{ scale: [1.15, 1, 1.15], opacity: [0.04, 0.14, 0.04], rotate: [360, 180, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="pointer-events-none absolute left-[45%] top-[20%] z-[2] h-32 w-32 rounded-full bg-fuchsia-400/[0.05] blur-3xl sm:h-40 sm:w-40"
                animate={{ scale: [1, 1.25, 0.9, 1], opacity: [0.03, 0.1, 0.05, 0.03], x: [-20, 30, -10, -20], y: [0, -20, 15, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />

            <motion.div
                className="pointer-events-none relative z-10 mx-auto flex h-full w-full container flex-col px-4 sm:px-6 lg:px-8"
                style={{ perspective: 1200, rotateX: overlayRotateX, rotateY: overlayRotateY }}
            >
                <div className="pointer-events-auto flex min-h-0 flex-1 items-center pb-4 pt-8 sm:pb-6 sm:pt-12 lg:pb-8 lg:pt-14">
                    <div className="grid w-full grid-cols-1 items-center gap-6 xl:grid-cols-12 xl:gap-10">
                        <div className="max-w-2xl space-y-3 sm:space-y-4 xl:col-span-7">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`tag-${activeIndex}`}
                                    variants={tagAnimation} initial="hidden" animate="visible" exit="exit"
                                >
                                    <motion.span
                                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300 backdrop-blur-xl sm:px-3.5 sm:py-1.5 sm:text-[10px]"
                                        whileHover={{ scale: 1.05, borderColor: "rgba(129,140,248,0.4)", backgroundColor: "rgba(255,255,255,0.12)" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <motion.span
                                            className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                                            animate={{ scale: [1, 1.5, 1], opacity: [0.65, 1, 0.65], boxShadow: ["0 0 0px rgba(129,140,248,0)", "0 0 8px rgba(129,140,248,0.6)", "0 0 0px rgba(129,140,248,0)"] }}
                                            transition={{ duration: 1.8, repeat: Infinity }}
                                        />
                                        {currentSlide.tag}
                                    </motion.span>
                                </motion.div>
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                <motion.div key={`title-${activeIndex}`} variants={titleAnimation} initial="hidden" animate="visible" exit="exit" style={{ perspective: 800 }}>
                                    <h1 className="text-[clamp(1.75rem,7vw,3rem)] font-black leading-[1.06] tracking-[-0.035em] text-white sm:text-4xl md:text-5xl lg:text-[3.35rem]">
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>{currentSlide.title}</motion.span><br />
                                        <motion.span
                                            className="bg-gradient-to-r from-indigo-300 via-violet-200 to-fuchsia-300 bg-clip-text text-transparent"
                                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                            style={{ backgroundSize: "200% 200%" }}
                                        >
                                            {currentSlide.highlight}
                                        </motion.span>
                                    </h1>
                                </motion.div>
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                <motion.p key={`subtitle-${activeIndex}`} variants={subtitleAnimation} initial="hidden" animate="visible" exit="exit" className="max-w-lg text-[13px] leading-relaxed text-slate-200/90 sm:text-[15px]">
                                    {currentSlide.subtitle}
                                </motion.p>
                            </AnimatePresence>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.35, ease: EASE_STANDARD }}
                                className="flex flex-wrap items-center gap-2.5 pt-1 sm:gap-3"
                            >
                                <motion.button
                                    type="button"
                                    onClick={() => router.push("/listings")}
                                    variants={magneticHover} initial="rest" whileHover="hover" whileTap="tap"
                                    className="relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-indigo-950/40 sm:px-6 sm:py-2.5 sm:text-xs"
                                    style={{ backgroundSize: "200% 100%" }}
                                >
                                    <motion.span
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        initial={shimmerAnimation.initial} animate={shimmerAnimation.animate}
                                        style={{ backgroundSize: "200% 100%" }}
                                    />
                                    <span className="relative z-10 flex items-center gap-2">
                                        Explore Now
                                        <motion.svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </motion.svg>
                                    </span>
                                </motion.button>

                                <motion.button
                                    type="button" onClick={scrollToNextSection}
                                    variants={magneticHover} initial="rest" whileHover="hover" whileTap="tap"
                                    className="hidden rounded-full border border-white/25 bg-white/[0.03] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm transition-colors hover:bg-white/[0.08] sm:inline-flex"
                                >
                                    <span className="flex items-center gap-2">
                                        <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="inline-block">✦</motion.span>
                                        Watch Tour
                                    </span>
                                </motion.button>
                            </motion.div>

                            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 sm:flex sm:flex-wrap sm:items-center sm:gap-6">
                                {heroStats.map((stat) => (
                                    <motion.div key={stat.label} variants={staggerItem}
                                        whileHover={{ y: -3, scale: 1.06, transition: { type: "spring", stiffness: 400, damping: 17 } }}
                                        className="group flex cursor-default items-center gap-1.5 sm:gap-2"
                                    >
                                        <motion.span className="text-sm sm:text-base" whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}>
                                            {stat.icon}
                                        </motion.span>
                                        <div>
                                            <motion.div className="text-xs font-extrabold leading-none text-white sm:text-sm" whileHover={{ color: "rgb(165, 180, 252)", transition: { duration: 0.2 } }}>
                                                {stat.value}
                                            </motion.div>
                                            <div className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.16em] text-slate-400 transition-colors group-hover:text-slate-300 sm:text-[8px]">{stat.label}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        <div className="hidden overflow-hidden xl:col-span-5 xl:block">
                            <motion.div
                                className="flex h-[220px] items-center gap-2.5 overflow-hidden"
                                initial={{ opacity: 0, x: 60 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: EASE_STANDARD }}
                            >
                                <AnimatePresence initial={false} mode="popLayout">
                                    {previewSlides.map((slide) => {
                                        const isActive = slide.position === 0;
                                        return (
                                            <motion.button
                                                key={`preview-${slide.id}`} type="button" layout
                                                initial={{ opacity: 0, x: 60, scale: 0.8, rotateY: 15 }}
                                                animate={{ opacity: isActive ? 1 : 0.5, x: 0, scale: isActive ? 1 : 0.92, rotateY: 0 }}
                                                exit={{ opacity: 0, x: -60, scale: 0.75, rotateY: -15 }}
                                                transition={{ duration: 0.6, ease: EASE_STANDARD, layout: { type: "spring", stiffness: 300, damping: 30 } }}
                                                whileHover={{ y: -6, opacity: 1, scale: isActive ? 1.03 : 0.96, transition: { type: "spring", stiffness: 400, damping: 17 } }}
                                                onClick={() => goToSlide(slide.originalIndex)}
                                                aria-label={`View ${slide.highlight}`}
                                                className={`relative flex-shrink-0 overflow-hidden rounded-2xl text-left transition-shadow duration-300 ${isActive ? "h-[200px] w-[160px] shadow-2xl shadow-indigo-500/25 ring-2 ring-indigo-400/60" : "h-[168px] w-[82px] shadow-lg hover:shadow-xl"}`}
                                                style={{ perspective: 600 }}
                                            >
                                                <Image height={1080} width={1920} src={slide.image} alt="" draggable={false} className="pointer-events-none h-full w-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/95 via-indigo-950/15 to-transparent" />
                                                {isActive && (
                                                    <>
                                                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400" />
                                                        <motion.div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"
                                                            animate={{ boxShadow: ["inset 0 0 0 rgba(129,140,248,0)", "inset 0 0 20px rgba(129,140,248,0.1)", "inset 0 0 0 rgba(129,140,248,0)"] }}
                                                            transition={{ duration: 3, repeat: Infinity }}
                                                        />
                                                    </>
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 p-2.5">
                                                    {isActive && (
                                                        <motion.span
                                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 17 }}
                                                            className="mb-1 inline-flex rounded-full bg-indigo-600/90 px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-white"
                                                        >
                                                            {slide.tag}
                                                        </motion.span>
                                                    )}
                                                    <p className={`line-clamp-2 font-bold uppercase tracking-[0.11em] text-white ${isActive ? "text-[10px]" : "text-[8px]"}`}>{slide.highlight}</p>
                                                    {isActive && (
                                                        <motion.div initial={{ width: 0 }} animate={{ width: 28 }} transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
                                                            className="mt-1.5 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" />
                                                    )}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <HeroSearchBar
                    searchQuery={searchQuery}
                    isSearchFocused={isSearchFocused}
                    onSearchChange={updateSearch}
                    onSubmit={handleSearchSubmit}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={handleFormBlur}
                />
            </motion.div>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:hidden">
                {sliderData.map((_, i) => (
                    <motion.button key={i} type="button" aria-label={`Go to slide ${i + 1}`}
                        onClick={() => goToSlide(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-indigo-400" : "w-1.5 bg-white/40"}`}
                        whileTap={{ scale: 0.8 }}
                        animate={i === activeIndex ? { boxShadow: ["0 0 0px rgba(129,140,248,0)", "0 0 6px rgba(129,140,248,0.6)", "0 0 0px rgba(129,140,248,0)"] } : {}}
                        transition={i === activeIndex ? { duration: 1.5, repeat: Infinity } : {}}
                    />
                ))}
            </div>

            <motion.div
                className="absolute right-4 top-4 z-20 hidden items-center gap-3 sm:right-6 sm:top-6 sm:gap-4 md:flex"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-white/60">
                    <motion.span key={activeIndex} className="text-xs text-white"
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                    >
                        {String(activeIndex + 1).padStart(2, "0")}
                    </motion.span>
                    <span className="text-white/30">/</span>
                    <span>{String(sliderData.length).padStart(2, "0")}</span>
                </div>
                <div className="hidden w-28 items-center gap-1 lg:flex lg:w-32">
                    {sliderData.map((_, i) => (
                        <SlideProgress key={i} active={i === activeIndex} />
                    ))}
                </div>
                <div className="flex items-center gap-1.5">
                    <motion.button type="button" aria-label="Previous slide"
                        onClick={() => swiperRef.current?.slidePrev()}
                        whileHover={{ scale: 1.15, borderColor: "rgba(129,140,248,0.55)", backgroundColor: "rgba(255,255,255,0.12)" }}
                        whileTap={{ scale: 0.88 }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-indigo-950/20 text-white/80 backdrop-blur-md transition-colors"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>
                    <motion.button type="button" aria-label="Next slide"
                        onClick={() => swiperRef.current?.slideNext()}
                        whileHover={{ scale: 1.15, borderColor: "rgba(129,140,248,0.55)", backgroundColor: "rgba(255,255,255,0.12)" }}
                        whileTap={{ scale: 0.88 }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-indigo-950/20 text-white/80 backdrop-blur-md transition-colors"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                </div>
            </motion.div>

            <motion.button type="button" onClick={scrollToNextSection} aria-label="Scroll to next section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{ opacity: { delay: 1.2, duration: 0.5 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                whileHover={{ scale: 1.15, borderColor: "rgba(129,140,248,0.5)", backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.88 }}
                className="absolute bottom-5 left-4 z-20 hidden h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] text-white/80 backdrop-blur-md transition-colors sm:left-6 lg:flex"
            >
                <motion.svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l6-6m-6 6-6-6" />
                </motion.svg>
            </motion.button>
        </section>
    );
}