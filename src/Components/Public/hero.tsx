"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
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
} from "framer-motion";
import type { Swiper as SwiperType } from "swiper";
import type { DateValue } from "@internationalized/date";
import {
    Calendar,
    DateField,
    DatePicker,
    Label,
    ListBox,
    Select,
} from "@heroui/react";

import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";

export const sliderData = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920&auto=format&fit=crop",
        title: "Find Your Next",
        highlight: "Premium Stay",
        subtitle:
            "Discover luxury villas, cozy apartments, and private island resorts tailored for you.",
        tag: "Featured",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1920&auto=format&fit=crop",
        title: "Experience Unmatched",
        highlight: "Comfort & Class",
        subtitle:
            "Handpicked premium rentals with real-time verification and flexible booking protocols.",
        tag: "Popular",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1920&auto=format&fit=crop",
        title: "Your Gateway to",
        highlight: "Perfect Vacations",
        subtitle:
            "AuraSpace makes finding ultra-luxury hotels, event venues, and homestays faster than ever.",
        tag: "Trending",
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1920&auto=format&fit=crop",
        title: "Discover Exquisite",
        highlight: "Coastal Villas",
        subtitle:
            "Wake up to breathtaking ocean views and private beaches with our curated waterfront estates.",
        tag: "Luxury",
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1920&auto=format&fit=crop",
        title: "Embrace Modern",
        highlight: "Urban Penthouses",
        subtitle:
            "Stay in the heart of metropolitan cities with elite skyline views and high-end smart amenities.",
        tag: "Elite Stay",
    },
    {
        id: 6,
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1920&auto=format&fit=crop",
        title: "Escape to Serene",
        highlight: "Nature Retreats",
        subtitle:
            "Unplug and rejuvenate in premium eco-lodges, treehouses, and peaceful mountain cabins.",
        tag: "Eco Luxury",
    },
    {
        id: 7,
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1920&auto=format&fit=crop",
        title: "Host Your Next",
        highlight: "Exclusive Event",
        subtitle:
            "Book spectacular rooftop venues, historic halls, and garden spaces for unforgettable moments.",
        tag: "Spaces",
    },
    {
        id: 8,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop",
        title: "Live the Royal",
        highlight: "Heritage Estates",
        subtitle:
            "Experience majestic living inside beautifully restored castles, mansions, and historic estates.",
        tag: "Exclusive",
    },
    {
        id: 9,
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1920&auto=format&fit=crop",
        title: "Unwind at Finest",
        highlight: "Wellness Resorts",
        subtitle:
            "Indulge in properties featuring private infinity pools, world-class spas, and personal chefs.",
        tag: "Wellness",
    },
    {
        id: 10,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1920&auto=format&fit=crop",
        title: "Work from Dream",
        highlight: "Co-Living Spaces",
        subtitle:
            "Seamlessly combine work and travel with premium high-speed workspaces and luxury stays.",
        tag: "Workation",
    },
];

const guestOptions = [
    { id: "1", label: "1 Guest" },
    { id: "2", label: "2 Guests" },
    { id: "3", label: "3 Guests" },
    { id: "4", label: "4 Guests" },
    { id: "5", label: "5 Guests" },
    { id: "6+", label: "6+ Guests" },
];

const stats = [
    { value: "12K+", label: "Properties", icon: "🏠" },
    { value: "500+", label: "Cities", icon: "🌍" },
    { value: "98%", label: "Satisfaction", icon: "⭐" },
    { value: "24/7", label: "Support", icon: "💬" },
];

const AUTOPLAY_DELAY = 6000;
const PREVIEW_COUNT = 4;

const titleAnimation = {
    hidden: { opacity: 0, y: 40, filter: "blur(12px)", rotateX: -15 },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        rotateX: 0,
        transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
        opacity: 0,
        y: -30,
        filter: "blur(8px)",
        rotateX: 10,
        transition: { duration: 0.4, ease: "easeIn" },
    },
};

const subtitleAnimation = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: {
        opacity: 0,
        y: -14,
        filter: "blur(4px)",
        transition: { duration: 0.3 },
    },
};

const tagAnimation = {
    hidden: { opacity: 0, x: -24, scale: 0.85, filter: "blur(6px)" },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
    },
    exit: {
        opacity: 0,
        x: 20,
        scale: 0.85,
        filter: "blur(4px)",
        transition: { duration: 0.3, ease: "easeIn" },
    },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.5,
        },
    },
};

const staggerItem = {
    hidden: { opacity: 0, y: 18, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const magneticHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.08,
        transition: { type: "spring", stiffness: 400, damping: 17 },
    },
    tap: { scale: 0.95 },
};

const shimmerAnimation = {
    initial: { backgroundPosition: "-200% 0" },
    animate: {
        backgroundPosition: "200% 0",
        transition: { duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1.5 },
    },
};

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
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [-24, 24, -24],
                        x: [-12, 12, -12],
                        opacity: [0.08, 0.5, 0.08],
                        scale: [0.6, 1.4, 0.6],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay,
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
                    x: [0, 100, -50, 0],
                    y: [0, -80, 60, 0],
                    scale: [1, 1.3, 0.9, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-1/4 -right-1/4 h-[55%] w-[55%] rounded-full bg-violet-500/[0.05] blur-[100px]"
                animate={{
                    x: [0, -80, 60, 0],
                    y: [0, 100, -50, 0],
                    scale: [1.1, 0.8, 1.2, 1.1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
                className="absolute left-1/3 top-1/3 h-[40%] w-[40%] rounded-full bg-fuchsia-500/[0.04] blur-[80px]"
                animate={{
                    x: [0, 60, -40, 0],
                    y: [0, -60, 40, 0],
                    scale: [0.9, 1.15, 0.85, 0.9],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />
        </div>
    );
}

function MorphingGradientBorder({ isActive }: { isActive: boolean }) {
    if (!isActive) return null;
    return (
        <motion.div
            className="pointer-events-none absolute -inset-[1px] rounded-2xl"
            style={{
                background:
                    "linear-gradient(90deg, rgba(99,102,241,0.4), rgba(167,139,250,0.3), rgba(236,72,153,0.3), rgba(99,102,241,0.4))",
                backgroundSize: "300% 100%",
            }}
            initial={{ opacity: 0, backgroundPosition: "0% 50%" }}
            animate={{
                opacity: 1,
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            exit={{ opacity: 0 }}
            transition={{
                opacity: { duration: 0.3 },
                backgroundPosition: { duration: 4, repeat: Infinity, ease: "linear" },
            }}
        />
    );
}

const FIELD_CLASSES =
    "flex min-h-[50px] flex-col justify-center rounded-xl border border-transparent bg-white px-3 py-2 transition-all duration-200 focus-within:border-indigo-500/50 focus-within:shadow-md focus-within:shadow-indigo-500/8 sm:min-h-[52px] sm:px-3.5";

const LABEL_CLASSES =
    "mb-0.5 block text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 sm:text-[9px]";

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
                return {
                    ...sliderData[index],
                    originalIndex: index,
                    position: i,
                };
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
        window.scrollTo({
            top: window.innerHeight * 0.7,
            behavior: "smooth",
        });
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

    return (
        <section
            ref={heroRef}
            onMouseMove={handleMouseMove}
            className="relative h-[68svh] min-h-[500px] max-h-[780px] w-full overflow-hidden bg-indigo-950 select-none sm:min-h-[560px] lg:h-[66svh] lg:min-h-[600px]"
        >
            <motion.div className="absolute inset-0 z-0" style={{ y: parallaxY, opacity: parallaxOpacity }}>
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
                    onSwiper={(s) => {
                        swiperRef.current = s;
                    }}
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
                                    height={1080}
                                    width={1920}
                                    src={slide.image}
                                    alt=""
                                    loading={i <= 1 ? "eager" : "lazy"}
                                    decoding="async"
                                    draggable={false}
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
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.05, 0.16, 0.05],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="pointer-events-none absolute bottom-20 left-[8%] z-[2] h-36 w-36 rounded-full bg-violet-400/[0.08] blur-3xl sm:h-48 sm:w-48"
                animate={{
                    scale: [1.15, 1, 1.15],
                    opacity: [0.04, 0.14, 0.04],
                    rotate: [360, 180, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="pointer-events-none absolute left-[45%] top-[20%] z-[2] h-32 w-32 rounded-full bg-fuchsia-400/[0.05] blur-3xl sm:h-40 sm:w-40"
                animate={{
                    scale: [1, 1.25, 0.9, 1],
                    opacity: [0.03, 0.1, 0.05, 0.03],
                    x: [-20, 30, -10, -20],
                    y: [0, -20, 15, 0],
                }}
                transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3,
                }}
            />

            <motion.div
                className="pointer-events-none relative z-10 mx-auto flex h-full w-full container flex-col px-4 sm:px-6 lg:px-8"
                style={{
                    perspective: 1200,
                    rotateX: overlayRotateX,
                    rotateY: overlayRotateY,
                }}
            >
                <div className="pointer-events-auto flex min-h-0 flex-1 items-center pb-4 pt-8 sm:pb-6 sm:pt-12 lg:pb-8 lg:pt-14">
                    <div className="grid w-full grid-cols-1 items-center gap-6 xl:grid-cols-12 xl:gap-10">
                        <div className="max-w-2xl space-y-3 sm:space-y-4 xl:col-span-7">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`tag-${activeIndex}`}
                                    variants={tagAnimation}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <motion.span
                                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300 backdrop-blur-xl sm:px-3.5 sm:py-1.5 sm:text-[10px]"
                                        whileHover={{
                                            scale: 1.05,
                                            borderColor: "rgba(129,140,248,0.4)",
                                            backgroundColor: "rgba(255,255,255,0.12)",
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <motion.span
                                            className="h-1.5 w-1.5 rounded-full bg-indigo-400"
                                            animate={{
                                                scale: [1, 1.5, 1],
                                                opacity: [0.65, 1, 0.65],
                                                boxShadow: [
                                                    "0 0 0px rgba(129,140,248,0)",
                                                    "0 0 8px rgba(129,140,248,0.6)",
                                                    "0 0 0px rgba(129,140,248,0)",
                                                ],
                                            }}
                                            transition={{
                                                duration: 1.8,
                                                repeat: Infinity,
                                            }}
                                        />
                                        {currentSlide.tag}
                                    </motion.span>
                                </motion.div>
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`title-${activeIndex}`}
                                    variants={titleAnimation}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    style={{ perspective: 800 }}
                                >
                                    <h1 className="text-[clamp(1.75rem,7vw,3rem)] font-black leading-[1.06] tracking-[-0.035em] text-white sm:text-4xl md:text-5xl lg:text-[3.35rem]">
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {currentSlide.title}
                                        </motion.span>
                                        <br />
                                        <motion.span
                                            className="bg-gradient-to-r from-indigo-300 via-violet-200 to-fuchsia-300 bg-clip-text text-transparent"
                                            animate={{
                                                backgroundPosition: [
                                                    "0% 50%",
                                                    "100% 50%",
                                                    "0% 50%",
                                                ],
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            style={{
                                                backgroundSize: "200% 200%",
                                            }}
                                        >
                                            {currentSlide.highlight}
                                        </motion.span>
                                    </h1>
                                </motion.div>
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={`subtitle-${activeIndex}`}
                                    variants={subtitleAnimation}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="max-w-lg text-[13px] leading-relaxed text-slate-200/90 sm:text-[15px]"
                                >
                                    {currentSlide.subtitle}
                                </motion.p>
                            </AnimatePresence>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="flex flex-wrap items-center gap-2.5 pt-1 sm:gap-3"
                            >
                                <motion.button
                                    type="button"
                                    onClick={() => router.push("/listings")}
                                    variants={magneticHover}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-indigo-950/40 sm:px-6 sm:py-2.5 sm:text-xs"
                                    style={{ backgroundSize: "200% 100%" }}
                                >
                                    <motion.span
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        {...shimmerAnimation}
                                        style={{ backgroundSize: "200% 100%" }}
                                    />
                                    <span className="relative z-10 flex items-center gap-2">
                                        Explore Now
                                        <motion.svg
                                            className="h-3.5 w-3.5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{
                                                duration: 1.2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </motion.svg>
                                    </span>
                                </motion.button>

                                <motion.button
                                    type="button"
                                    onClick={scrollToNextSection}
                                    variants={magneticHover}
                                    initial="rest"
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="hidden rounded-full border border-white/25 bg-white/[0.03] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm transition-colors hover:bg-white/[0.08] sm:inline-flex"
                                >
                                    <span className="flex items-center gap-2">
                                        <motion.span
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                            className="inline-block"
                                        >
                                            ✦
                                        </motion.span>
                                        Watch Tour
                                    </span>
                                </motion.button>
                            </motion.div>

                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={staggerContainer}
                                className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 sm:flex sm:flex-wrap sm:items-center sm:gap-6"
                            >
                                {stats.map((stat) => (
                                    <motion.div
                                        key={stat.label}
                                        variants={staggerItem}
                                        whileHover={{
                                            y: -3,
                                            scale: 1.06,
                                            transition: { type: "spring", stiffness: 400, damping: 17 },
                                        }}
                                        className="group flex cursor-default items-center gap-1.5 sm:gap-2"
                                    >
                                        <motion.span
                                            className="text-sm sm:text-base"
                                            whileHover={{
                                                scale: 1.2,
                                                rotate: [0, -10, 10, 0],
                                                transition: { duration: 0.4 },
                                            }}
                                        >
                                            {stat.icon}
                                        </motion.span>
                                        <div>
                                            <motion.div
                                                className="text-xs font-extrabold leading-none text-white sm:text-sm"
                                                whileHover={{
                                                    color: "rgb(165, 180, 252)",
                                                    transition: { duration: 0.2 },
                                                }}
                                            >
                                                {stat.value}
                                            </motion.div>
                                            <div className="mt-0.5 text-[7px] font-bold uppercase tracking-[0.16em] text-slate-400 transition-colors group-hover:text-slate-300 sm:text-[8px]">
                                                {stat.label}
                                            </div>
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
                                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                <AnimatePresence
                                    initial={false}
                                    mode="popLayout"
                                >
                                    {previewSlides.map((slide) => {
                                        const isActive = slide.position === 0;
                                        return (
                                            <motion.button
                                                key={`preview-${slide.id}`}
                                                type="button"
                                                layout
                                                initial={{
                                                    opacity: 0,
                                                    x: 60,
                                                    scale: 0.8,
                                                    rotateY: 15,
                                                }}
                                                animate={{
                                                    opacity: isActive ? 1 : 0.5,
                                                    x: 0,
                                                    scale: isActive ? 1 : 0.92,
                                                    rotateY: 0,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    x: -60,
                                                    scale: 0.75,
                                                    rotateY: -15,
                                                }}
                                                transition={{
                                                    duration: 0.6,
                                                    ease: [0.25, 0.46, 0.45, 0.94],
                                                    layout: { type: "spring", stiffness: 300, damping: 30 },
                                                }}
                                                whileHover={{
                                                    y: -6,
                                                    opacity: 1,
                                                    scale: isActive ? 1.03 : 0.96,
                                                    transition: { type: "spring", stiffness: 400, damping: 17 },
                                                }}
                                                onClick={() =>
                                                    goToSlide(slide.originalIndex)
                                                }
                                                aria-label={`View ${slide.highlight}`}
                                                className={`relative flex-shrink-0 overflow-hidden rounded-2xl text-left transition-shadow duration-300 ${
                                                    isActive
                                                        ? "h-[200px] w-[160px] shadow-2xl shadow-indigo-500/25 ring-2 ring-indigo-400/60"
                                                        : "h-[168px] w-[82px] shadow-lg hover:shadow-xl"
                                                }`}
                                                style={{ perspective: 600 }}
                                            >
                                                <Image
                                                    height={1080}
                                                    width={1920}
                                                    src={slide.image}
                                                    alt=""
                                                    draggable={false}
                                                    className="pointer-events-none h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/95 via-indigo-950/15 to-transparent" />

                                                {isActive && (
                                                    <>
                                                        <motion.div
                                                            initial={{ scaleX: 0 }}
                                                            animate={{ scaleX: 1 }}
                                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                                            className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400"
                                                        />
                                                        <motion.div
                                                            className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"
                                                            animate={{
                                                                boxShadow: [
                                                                    "inset 0 0 0 rgba(129,140,248,0)",
                                                                    "inset 0 0 20px rgba(129,140,248,0.1)",
                                                                    "inset 0 0 0 rgba(129,140,248,0)",
                                                                ],
                                                            }}
                                                            transition={{ duration: 3, repeat: Infinity }}
                                                        />
                                                    </>
                                                )}

                                                <div className="absolute inset-x-0 bottom-0 p-2.5">
                                                    {isActive && (
                                                        <motion.span
                                                            initial={{
                                                                opacity: 0,
                                                                y: 10,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                                scale: 1,
                                                            }}
                                                            transition={{
                                                                delay: 0.2,
                                                                type: "spring",
                                                                stiffness: 400,
                                                                damping: 17,
                                                            }}
                                                            className="mb-1 inline-flex rounded-full bg-indigo-600/90 px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-white"
                                                        >
                                                            {slide.tag}
                                                        </motion.span>
                                                    )}
                                                    <p
                                                        className={`line-clamp-2 font-bold uppercase tracking-[0.11em] text-white ${
                                                            isActive
                                                                ? "text-[10px]"
                                                                : "text-[8px]"
                                                        }`}
                                                    >
                                                        {slide.highlight}
                                                    </p>
                                                    {isActive && (
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: 28 }}
                                                            transition={{
                                                                duration: 0.4,
                                                                delay: 0.25,
                                                                ease: "easeOut",
                                                            }}
                                                            className="mt-1.5 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
                                                        />
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

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        duration: 0.75,
                        delay: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="pointer-events-auto mx-auto mb-6 w-full max-w-3xl sm:mb-8 lg:mb-6 lg:max-w-4xl"
                >
                    <motion.div
                        animate={{
                            borderColor: isSearchFocused
                                ? "rgba(99,102,241,0.42)"
                                : "rgba(255,255,255,0.12)",
                            backgroundColor: isSearchFocused
                                ? "rgba(255,255,255,0.11)"
                                : "rgba(255,255,255,0.07)",
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative rounded-2xl border p-1.5 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-2"
                    >
                        <AnimatePresence>
                            {isSearchFocused && (
                                <>
                                    <MorphingGradientBorder isActive={isSearchFocused} />
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-indigo-500/20 via-violet-400/10 to-fuchsia-500/15 blur-sm"
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        <form
                            onSubmit={handleSearchSubmit}
                            onFocusCapture={() => setIsSearchFocused(true)}
                            onBlurCapture={handleFormBlur}
                            className="relative grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2 lg:grid-cols-[1.5fr_1.1fr_1fr_auto]"
                        >
                            <motion.div
                                className={`${FIELD_CLASSES} sm:col-span-2 lg:col-span-1`}
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <label
                                    htmlFor="hero-location"
                                    className={LABEL_CLASSES}
                                >
                                    Where To?
                                </label>
                                <div className="flex items-center gap-2">
                                    <motion.svg
                                        className="h-3.5 w-3.5 flex-shrink-0 text-slate-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        animate={
                                            searchQuery.location
                                                ? { color: "rgb(99,102,241)", scale: [1, 1.1, 1] }
                                                : {}
                                        }
                                        transition={{ duration: 0.3 }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z"
                                        />
                                    </motion.svg>
                                    <input
                                        id="hero-location"
                                        type="text"
                                        required
                                        autoComplete="off"
                                        placeholder="City, region, or property..."
                                        value={searchQuery.location}
                                        onChange={(e) =>
                                            updateSearch("location", e.target.value)
                                        }
                                        className="h-5 w-full border-0 bg-transparent p-0 text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400 sm:text-[13px]"
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                className={FIELD_CLASSES}
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <DatePicker
                                    className="w-full"
                                    aria-label="Check-in date"
                                    value={searchQuery.checkIn}
                                    onChange={(date) =>
                                        updateSearch("checkIn", date)
                                    }
                                >
                                    <Label className={LABEL_CLASSES}>
                                        Check-in
                                    </Label>
                                    <DateField.Group
                                        fullWidth
                                        className="flex h-5 min-h-0 items-center gap-1 border-0 bg-transparent p-0 shadow-none"
                                    >
                                        <svg
                                            className="mr-1 h-3.5 w-3.5 flex-shrink-0 text-slate-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                                            />
                                        </svg>
                                        <DateField.Input className="flex flex-1 items-center gap-0.5 text-xs font-semibold text-slate-800 sm:text-[13px]">
                                            {(segment) => (
                                                <DateField.Segment
                                                    segment={segment}
                                                    className="rounded px-0.5 py-px text-center outline-none transition-colors data-[placeholder]:text-slate-400 data-[focused]:bg-indigo-100 data-[focused]:text-indigo-800"
                                                />
                                            )}
                                        </DateField.Input>
                                        <DateField.Suffix>
                                            <DatePicker.Trigger
                                                aria-label="Open date picker"
                                                className="ml-auto flex h-6 w-6 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                                            >
                                                <DatePicker.TriggerIndicator />
                                            </DatePicker.Trigger>
                                        </DateField.Suffix>
                                    </DateField.Group>

                                    <DatePicker.Popover className="z-[100] rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-indigo-950/10">
                                        <Calendar
                                            aria-label="Check-in date"
                                            className="w-[280px] max-w-[calc(100vw-2rem)] p-3 sm:w-[310px]"
                                        >
                                            <Calendar.Header className="mb-2 flex items-center justify-between">
                                                <Calendar.YearPickerTrigger className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100">
                                                    <Calendar.YearPickerTriggerHeading />
                                                    <Calendar.YearPickerTriggerIndicator />
                                                </Calendar.YearPickerTrigger>
                                                <div className="flex gap-1">
                                                    <Calendar.NavButton
                                                        slot="previous"
                                                        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                                                    />
                                                    <Calendar.NavButton
                                                        slot="next"
                                                        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                                                    />
                                                </div>
                                            </Calendar.Header>
                                            <Calendar.Grid className="w-full">
                                                <Calendar.GridHeader>
                                                    {(day) => (
                                                        <Calendar.HeaderCell className="pb-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                            {day}
                                                        </Calendar.HeaderCell>
                                                    )}
                                                </Calendar.GridHeader>
                                                <Calendar.GridBody>
                                                    {(date) => (
                                                        <Calendar.Cell
                                                            date={date}
                                                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[13px] font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 data-[disabled]:pointer-events-none data-[disabled]:text-slate-300 data-[selected]:bg-indigo-600 data-[selected]:font-bold data-[selected]:text-white data-[today]:font-bold data-[today]:text-indigo-600"
                                                        />
                                                    )}
                                                </Calendar.GridBody>
                                            </Calendar.Grid>
                                            <Calendar.YearPickerGrid className="mt-2">
                                                <Calendar.YearPickerGridBody>
                                                    {({ year }) => (
                                                        <Calendar.YearPickerCell
                                                            year={year}
                                                            className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-indigo-50 data-[selected]:bg-indigo-600 data-[selected]:text-white"
                                                        />
                                                    )}
                                                </Calendar.YearPickerGridBody>
                                            </Calendar.YearPickerGrid>
                                        </Calendar>
                                    </DatePicker.Popover>
                                </DatePicker>
                            </motion.div>

                            <motion.div
                                className={FIELD_CLASSES}
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <Select
                                    className="w-full"
                                    aria-label="Number of guests"
                                    placeholder="Select"
                                    selectedKey={searchQuery.guests}
                                    onSelectionChange={(key) =>
                                        updateSearch("guests", key ? String(key) : "2")
                                    }
                                >
                                    <Label className={LABEL_CLASSES}>
                                        Guests
                                    </Label>
                                    <Select.Trigger className="flex h-5 min-h-0 items-center gap-1 border-0 bg-transparent p-0 text-xs font-semibold text-slate-800 shadow-none sm:text-[13px]">
                                        <svg
                                            className="mr-0.5 h-3.5 w-3.5 flex-shrink-0 text-slate-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                            />
                                        </svg>
                                        <Select.Value className="flex-1 truncate" />
                                        <Select.Indicator className="ml-auto text-slate-400" />
                                    </Select.Trigger>
                                    <Select.Popover className="z-[100] rounded-xl border border-slate-200 bg-white p-1 shadow-2xl shadow-indigo-950/10">
                                        <ListBox>
                                            {guestOptions.map((option) => (
                                                <ListBox.Item
                                                    key={option.id}
                                                    id={option.id}
                                                    textValue={option.label}
                                                    className="cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 data-[selected]:bg-indigo-50 data-[selected]:text-indigo-700"
                                                >
                                                    {option.label}
                                                    <ListBox.ItemIndicator />
                                                </ListBox.Item>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                            </motion.div>

                            <motion.button
                                type="submit"
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: "0 8px 30px rgba(99,102,241,0.45)",
                                }}
                                whileTap={{ scale: 0.96 }}
                                className="relative min-h-[50px] overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-indigo-600/25 transition-colors sm:col-span-2 sm:min-h-[52px] sm:text-xs lg:col-span-1 lg:min-w-[120px]"
                                style={{ backgroundSize: "200% 100%" }}
                            >
                                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                                    <motion.svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        whileHover={{ rotate: 90, scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                        />
                                    </motion.svg>
                                    Search
                                </span>
                                <motion.span
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    animate={{ x: ["-200%", "200%"] }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                        repeatDelay: 1.5,
                                    }}
                                />
                                <motion.span
                                    className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-fuchsia-500/30 to-violet-600/0"
                                    animate={{ opacity: [0, 0.5, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1,
                                    }}
                                />
                            </motion.button>
                        </form>
                    </motion.div>
                </motion.div>
            </motion.div>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:hidden">
                {sliderData.map((_, i) => (
                    <motion.button
                        key={i}
                        type="button"
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => goToSlide(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === activeIndex
                                ? "w-6 bg-indigo-400"
                                : "w-1.5 bg-white/40"
                        }`}
                        whileTap={{ scale: 0.8 }}
                        animate={
                            i === activeIndex
                                ? {
                                      boxShadow: [
                                          "0 0 0px rgba(129,140,248,0)",
                                          "0 0 6px rgba(129,140,248,0.6)",
                                          "0 0 0px rgba(129,140,248,0)",
                                      ],
                                  }
                                : {}
                        }
                        transition={
                            i === activeIndex
                                ? { duration: 1.5, repeat: Infinity }
                                : {}
                        }
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
                    <motion.span
                        key={activeIndex}
                        className="text-xs text-white"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
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
                    <motion.button
                        type="button"
                        aria-label="Previous slide"
                        onClick={() => swiperRef.current?.slidePrev()}
                        whileHover={{
                            scale: 1.15,
                            borderColor: "rgba(129,140,248,0.55)",
                            backgroundColor: "rgba(255,255,255,0.12)",
                        }}
                        whileTap={{ scale: 0.88 }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-indigo-950/20 text-white/80 backdrop-blur-md transition-colors"
                    >
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
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </motion.button>
                    <motion.button
                        type="button"
                        aria-label="Next slide"
                        onClick={() => swiperRef.current?.slideNext()}
                        whileHover={{
                            scale: 1.15,
                            borderColor: "rgba(129,140,248,0.55)",
                            backgroundColor: "rgba(255,255,255,0.12)",
                        }}
                        whileTap={{ scale: 0.88 }}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-indigo-950/20 text-white/80 backdrop-blur-md transition-colors"
                    >
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
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </motion.button>
                </div>
            </motion.div>

            <motion.button
                type="button"
                onClick={scrollToNextSection}
                aria-label="Scroll to next section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{
                    opacity: { delay: 1.2, duration: 0.5 },
                    y: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                }}
                whileHover={{
                    scale: 1.15,
                    borderColor: "rgba(129,140,248,0.5)",
                    backgroundColor: "rgba(255,255,255,0.1)",
                }}
                whileTap={{ scale: 0.88 }}
                className="absolute bottom-5 left-4 z-20 hidden h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] text-white/80 backdrop-blur-md transition-colors sm:left-6 lg:flex"
            >
                <motion.svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14m0 0l6-6m-6 6-6-6"
                    />
                </motion.svg>
            </motion.button>
        </section>
    );
}