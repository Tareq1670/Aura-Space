"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    motion,
    useInView,
    useScroll,
    useTransform,
    AnimatePresence,
} from "framer-motion";
import {
    HiOutlineUsers,
    HiOutlineGlobe,
    HiOutlineCalendar,
    HiOutlineChatAlt2,
    HiOutlineHeart,
    HiOutlineShare,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlineStar,
    HiOutlineSparkles,
    HiOutlineShieldCheck,
    HiOutlineLightBulb,
    HiOutlineBadgeCheck,
    HiOutlineArrowRight,
    HiOutlineChevronDown,
    HiOutlinePlay,
    HiOutlinePhotograph,
    HiOutlineEmojiHappy,
    HiOutlinePlus,
    HiOutlineCheckCircle,
} from "react-icons/hi";

interface Stat {
    value: string;
    label: string;
    icon: React.ReactNode;
    color: string;
}

interface Feature {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

interface Group {
    id: string;
    name: string;
    description: string;
    members: string;
    icon: React.ReactNode;
    color: string;
    image: string;
}

interface Post {
    id: string;
    user: {
        name: string;
        avatar: string;
        location: string;
    };
    content: string;
    image: string;
    likes: number;
    comments: number;
    time: string;
}

interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    host: string;
    image: string;
    attendees: number;
}

interface Testimonial {
    quote: string;
    name: string;
    role: string;
    avatar: string;
    rating: number;
}

interface GalleryImage {
    src: string;
    alt: string;
    span?: string;
}

interface FaqItem {
    q: string;
    a: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
            type: "tween",
        },
    },
};

const stats: Stat[] = [
    {
        value: "50K+",
        label: "Active Members",
        icon: <HiOutlineUsers className="h-6 w-6" />,
        color: "from-indigo-500 to-violet-600",
    },
    {
        value: "64",
        label: "Cities Connected",
        icon: <HiOutlineGlobe className="h-6 w-6" />,
        color: "from-violet-500 to-fuchsia-600",
    },
    {
        value: "120K+",
        label: "Successful Bookings",
        icon: <HiOutlineCheckCircle className="h-6 w-6" />,
        color: "from-fuchsia-500 to-pink-600",
    },
    {
        value: "8.5K",
        label: "Community Posts",
        icon: <HiOutlineChatAlt2 className="h-6 w-6" />,
        color: "from-pink-500 to-rose-600",
    },
    {
        value: "150+",
        label: "Events Hosted",
        icon: <HiOutlineCalendar className="h-6 w-6" />,
        color: "from-rose-500 to-orange-500",
    },
];

const features: Feature[] = [
    {
        title: "Meet Fellow Travelers",
        description:
            "Connect with like-minded explorers, share itineraries, and find travel companions for your next adventure.",
        icon: <HiOutlineUsers className="h-6 w-6" />,
        color: "from-indigo-500 to-violet-600",
    },
    {
        title: "Connect with Hosts",
        description:
            "Build relationships with property owners, get insider tips about neighborhoods, and unlock special perks.",
        icon: <HiOutlineHeart className="h-6 w-6" />,
        color: "from-violet-500 to-fuchsia-600",
    },
    {
        title: "Ask & Share",
        description:
            "Get instant answers to your questions and share your own experiences to help others in the community.",
        icon: <HiOutlineChatAlt2 className="h-6 w-6" />,
        color: "from-fuchsia-500 to-pink-600",
    },
    {
        title: "Exclusive Tips",
        description:
            "Access hidden gems, local secrets, and curated recommendations from experienced travelers and hosts.",
        icon: <HiOutlineLightBulb className="h-6 w-6" />,
        color: "from-pink-500 to-rose-600",
    },
    {
        title: "Community Badges",
        description:
            "Earn recognition for your contributions, reviews, and milestones with our badge system.",
        icon: <HiOutlineBadgeCheck className="h-6 w-6" />,
        color: "from-rose-500 to-orange-500",
    },
    {
        title: "Verified Community",
        description:
            "Join a safe, moderated space where every member is verified to ensure quality interactions.",
        icon: <HiOutlineShieldCheck className="h-6 w-6" />,
        color: "from-orange-500 to-amber-500",
    },
];

const groups: Group[] = [
    {
        id: "travelers",
        name: "Travelers",
        description: "For those who wanderlust and explore new horizons",
        members: "24.5K",
        icon: <HiOutlineGlobe className="h-5 w-5" />,
        color: "from-indigo-500 to-violet-600",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: "nomads",
        name: "Digital Nomads",
        description:
            "Remote workers seeking the perfect work-from-anywhere spots",
        members: "12.8K",
        icon: <HiOutlineSparkles className="h-5 w-5" />,
        color: "from-violet-500 to-fuchsia-600",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: "hosts",
        name: "Hosts",
        description: "Property owners sharing spaces and hospitality tips",
        members: "8.2K",
        icon: <HiOutlineHeart className="h-5 w-5" />,
        color: "from-fuchsia-500 to-pink-600",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: "students",
        name: "Students",
        description: "Budget-friendly finds and student accommodation advice",
        members: "15.3K",
        icon: <HiOutlineLightBulb className="h-5 w-5" />,
        color: "from-pink-500 to-rose-600",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: "families",
        name: "Families",
        description: "Kid-friendly stays and family travel recommendations",
        members: "9.7K",
        icon: <HiOutlineUsers className="h-5 w-5" />,
        color: "from-rose-500 to-orange-500",
        image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
    },
    {
        id: "business",
        name: "Business Travelers",
        description: "Corporate stays, networking, and productivity tips",
        members: "6.4K",
        icon: <HiOutlineBadgeCheck className="h-5 w-5" />,
        color: "from-orange-500 to-amber-500",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    },
];

const posts: Post[] = [
    {
        id: "1",
        user: {
            name: "Sarah Rahman",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
            location: "Dhaka, Bangladesh",
        },
        content:
            "Just discovered this amazing rooftop cafe in Gulshan through a host recommendation! The view of the city at sunset is absolutely breathtaking. Can't wait to share more photos from my stay. ✨",
        image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
        likes: 234,
        comments: 45,
        time: "2 hours ago",
    },
    {
        id: "2",
        user: {
            name: "Ahmed Hassan",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
            location: "Chittagong, Bangladesh",
        },
        content:
            "Hosting tip: Adding a small welcome basket with local snacks and a handwritten note increases guest satisfaction by 40%! My guests always mention it in reviews. 🏠❤️",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
        likes: 189,
        comments: 32,
        time: "5 hours ago",
    },
    {
        id: "3",
        user: {
            name: "Nadia Islam",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
            location: "Sylhet, Bangladesh",
        },
        content:
            "Weekend getaway to Sylhet's tea gardens was magical! Found the perfect cottage through AuraSpace. The host was incredibly helpful and even arranged a private tea tasting session. 🍃",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
        likes: 456,
        comments: 67,
        time: "8 hours ago",
    },
];

const events: Event[] = [
    {
        id: "1",
        title: "Community Meetup: Dhaka Edition",
        date: "Dec 15, 2024",
        time: "6:00 PM - 9:00 PM",
        location: "Gulshan Club, Dhaka",
        host: "AuraSpace Team",
        image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
        attendees: 120,
    },
    {
        id: "2",
        title: "Host Workshop: Maximizing Bookings",
        date: "Dec 20, 2024",
        time: "2:00 PM - 4:00 PM",
        location: "Online (Zoom)",
        host: "Sarah Rahman",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
        attendees: 85,
    },
    {
        id: "3",
        title: "New Year's Eve Beach Bonfire",
        date: "Dec 31, 2024",
        time: "8:00 PM - 1:00 AM",
        location: "Cox's Bazar Beach",
        host: "Travelers Group",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        attendees: 250,
    },
];

const testimonials: Testimonial[] = [
    {
        quote: "The AuraSpace community completely transformed how I travel. I've made lifelong friends and discovered hidden gems I never would have found on my own.",
        name: "Fatima Khan",
        role: "Digital Nomad",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        rating: 5,
    },
    {
        quote: "As a host, the community has been invaluable. The tips and support from other hosts helped me optimize my listing and increase bookings by 200%.",
        name: "Rahim Chowdhury",
        role: "Superhost",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        rating: 5,
    },
    {
        quote: "I found my current apartment through a community recommendation. The local insights saved me so much time and helped me feel at home immediately.",
        name: "Priya Das",
        role: "Student",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        rating: 5,
    },
];

const galleryImages: GalleryImage[] = [
    {
        src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
        alt: "Community Meetup",
        span: "col-span-2 row-span-2",
    },
    {
        src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
        alt: "Friends Traveling",
    },
    {
        src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
        alt: "Rooftop Gathering",
    },
    {
        src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80",
        alt: "Family Time",
    },
    {
        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
        alt: "Digital Nomads",
        span: "col-span-2",
    },
    {
        src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
        alt: "Business Meeting",
    },
];

const faqs: FaqItem[] = [
    {
        q: "How do I join the AuraSpace community?",
        a: "Simply create an account on AuraSpace and you're automatically part of our community! You can access forums, join groups, and start engaging immediately. Verified members get additional perks and badges.",
    },
    {
        q: "Is the community free to join?",
        a: "Yes, absolutely! Our community is completely free for all AuraSpace users. Some exclusive events or workshops may have limited capacity, but there's no membership fee.",
    },
    {
        q: "How can I become a Community Leader?",
        a: "Community Leaders are selected based on their contributions, helpfulness, and engagement. Host workshops, write helpful guides, and actively support other members to be considered.",
    },
    {
        q: "Are community events open to everyone?",
        a: "Most events are open to all community members. Some specialized workshops may require registration due to limited spots. Premium members get early access to event registration.",
    },
];

const CommunityPage = () => {
    const heroRef = useRef<HTMLElement>(null);
    const statsRef = useRef<HTMLElement>(null);
    const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
    const isStatsInView = useInView(statsRef, { once: true, margin: "-50px" });
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [joinedGroups, setJoinedGroups] = useState<string[]>([]);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

    const toggleGroup = (id: string) => {
        setJoinedGroups((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
        );
    };

    return (
        <main className="w-full bg-slate-50/30">
            <section
                ref={heroRef}
                className="relative w-full overflow-hidden bg-slate-950 pb-24 pt-28 sm:pb-32 sm:pt-36 lg:pb-40 lg:pt-44"
            >
                <motion.div
                    className="absolute inset-0 -z-10"
                    style={{ y: heroY, opacity: heroOpacity }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/90 to-slate-900" />
                    <div className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-violet-500/20 blur-3xl" />
                    <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
                </motion.div>

                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                        backgroundSize: "32px 32px",
                    }}
                />

                <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate={isHeroInView ? "visible" : "hidden"}
                        variants={containerVariants}
                        className="mx-auto max-w-4xl text-center"
                    >
                       

                        <motion.h1
                            variants={itemVariants}
                            className="text-[40px] font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl md:text-[72px] lg:text-7xl"
                        >
                            Where Travelers{" "}
                            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                                Become Family
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="mx-auto mt-6 max-w-2xl text-lg leading-[1.8] text-white/60 sm:text-xl"
                        >
                            Join a vibrant community of explorers, hosts, and
                            dreamers. Share stories, get insider tips, and make
                            connections that last a lifetime.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="mx-auto mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                        >
                            <Link
                                href="#join"
                                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-950 shadow-[0_10px_40px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_14px_50px_rgba(255,255,255,0.3)]"
                            >
                                Join Community
                                <HiOutlineArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href="#explore"
                                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-8 text-sm font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/[0.12]"
                            >
                                <HiOutlinePlay className="h-5 w-5" />
                                Watch Video
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mx-auto mt-12 flex items-center justify-center gap-4 sm:gap-6"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-slate-950 ring-2 ring-indigo-500/30"
                                    >
                                        <Image
                                            src={`https://images.unsplash.com/photo-${i === 1 ? "1494790108377-be9c29b29330" : i === 2 ? "1500648767791-00dcc994a43e" : i === 3 ? "1438761681033-6461ffad8d80" : "1534528741775-53994a69daeb"}?auto=format&fit=crop&w=200&q=80`}
                                            alt="Member"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <HiOutlineStar
                                            key={i}
                                            className="h-4 w-4 fill-current"
                                        />
                                    ))}
                                </div>
                                <div className="mt-1 text-xs text-white/60">
                                    Rated 4.9 by 10,000+ members
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section
                ref={statsRef}
                className="relative -mt-16 w-full px-4 sm:px-6 lg:px-8"
            >
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={
                            isStatsInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 40 }
                        }
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:grid-cols-3 lg:grid-cols-5"
                    >
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={
                                    isStatsInView
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 20 }
                                }
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-center transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/30"
                            >
                                <div
                                    className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-110`}
                                >
                                    {stat.icon}
                                </div>
                                <div className="text-2xl font-black tracking-[-0.02em] text-slate-950 sm:text-3xl">
                                    {stat.value}
                                </div>
                                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="relative w-full bg-white py-24 sm:py-32">
                <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="mx-auto mb-16 max-w-2xl text-center"
                    >
                        

                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[46px]"
                        >
                            More than just{" "}
                            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                                bookings
                            </span>
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg"
                        >
                            Discover the benefits of being part of Bangladesh's
                            most vibrant travel community.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                variants={itemVariants}
                                whileHover={{
                                    y: -6,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                    },
                                }}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-500 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.1)]"
                            >
                                <div
                                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-110`}
                                >
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-black tracking-[-0.02em] text-slate-950">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 text-[15px] leading-[1.7] text-slate-500">
                                    {feature.description}
                                </p>

                                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-50 to-violet-50 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="relative w-full bg-slate-50/50 py-24 sm:py-32">
                <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="mx-auto mb-16 max-w-2xl text-center"
                    >
                        

                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[46px]"
                        >
                            Featured Groups
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg"
                        >
                            Join groups that match your lifestyle and connect
                            with people who share your passion.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {groups.map((group) => (
                            <motion.div
                                key={group.id}
                                variants={itemVariants}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)]"
                            >
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={group.image}
                                        alt={group.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center gap-2 text-white">
                                            <div
                                                className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${group.color} shadow-lg`}
                                            >
                                                {group.icon}
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                                                {group.members} members
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-lg font-black text-slate-950">
                                        {group.name}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                        {group.description}
                                    </p>

                                    <button
                                        onClick={() => toggleGroup(group.id)}
                                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                                            joinedGroups.includes(group.id)
                                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                                : "bg-slate-950 text-white hover:bg-slate-800"
                                        }`}
                                    >
                                        {joinedGroups.includes(group.id) ? (
                                            <>
                                                <HiOutlineCheckCircle className="h-5 w-5" />
                                                Joined
                                            </>
                                        ) : (
                                            <>
                                                <HiOutlinePlus className="h-5 w-5" />
                                                Join Group
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="relative w-full bg-white py-24 sm:py-32">
                <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="mx-auto mb-16 max-w-2xl text-center"
                    >
                        

                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[46px]"
                        >
                            Stories from our{" "}
                            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                                community
                            </span>
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="mx-auto max-w-3xl space-y-6"
                    >
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                variants={itemVariants}
                                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)]"
                            >
                                <div className="flex items-center gap-3 border-b border-slate-100 p-6">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-slate-100">
                                        <Image
                                            src={post.user.avatar}
                                            alt={post.user.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-950">
                                            {post.user.name}
                                        </h4>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <HiOutlineLocationMarker className="h-3 w-3" />
                                            {post.user.location}
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {post.time}
                                    </span>
                                </div>

                                <div className="p-6">
                                    <p className="text-[15px] leading-relaxed text-slate-700">
                                        {post.content}
                                    </p>

                                    <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl">
                                        <Image
                                            src={post.image}
                                            alt="Post image"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="mt-5 flex items-center gap-6 border-t border-slate-100 pt-4">
                                        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-rose-500">
                                            <HiOutlineHeart className="h-5 w-5" />
                                            {post.likes}
                                        </button>
                                        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600">
                                            <HiOutlineChatAlt2 className="h-5 w-5" />
                                            {post.comments}
                                        </button>
                                        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600">
                                            <HiOutlineShare className="h-5 w-5" />
                                            Share
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <motion.div
                            variants={itemVariants}
                            className="text-center"
                        >
                            <button className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 text-sm font-bold uppercase tracking-wider text-slate-950 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/50">
                                Load More Stories
                                <HiOutlineChevronDown className="h-5 w-5" />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="relative w-full bg-slate-50/50 py-24 sm:py-32">
                <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="mx-auto mb-16 max-w-2xl text-center"
                    >
                      

                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[46px]"
                        >
                            Join the conversation
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="grid gap-6 lg:grid-cols-3"
                    >
                        {events.map((event) => (
                            <motion.div
                                key={event.id}
                                variants={itemVariants}
                                whileHover={{
                                    y: -8,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                    },
                                }}
                                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-500 hover:shadow-[0_25px_60px_rgba(99,102,241,0.15)]"
                            >
                                <div className="relative h-56 w-full overflow-hidden">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center gap-2 text-white">
                                            <div className="flex h-10 w-10 flex-col items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                                                <span className="text-[10px] font-bold uppercase">
                                                    {event.date.split(" ")[0]}
                                                </span>
                                                <span className="text-lg font-black leading-none">
                                                    {event.date
                                                        .split(" ")[1]
                                                        .replace(",", "")}
                                                </span>
                                            </div>
                                            <div className="ml-2">
                                                <div className="flex items-center gap-1 text-xs text-white/80">
                                                    <HiOutlineClock className="h-3 w-3" />
                                                    {event.time}
                                                </div>
                                                <div className="mt-0.5 flex items-center gap-1 text-xs text-white/80">
                                                    <HiOutlineLocationMarker className="h-3 w-3" />
                                                    {event.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-lg font-black text-slate-950">
                                        {event.title}
                                    </h3>

                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-white"
                                                >
                                                    <Image
                                                        src={`https://images.unsplash.com/photo-${i === 1 ? "1494790108377-be9c29b29330" : i === 2 ? "1500648767791-00dcc994a43e" : "1438761681033-6461ffad8d80"}?auto=format&fit=crop&w=100&q=80`}
                                                        alt="Attendee"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-xs text-slate-500">
                                            +{event.attendees} attending
                                        </span>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-500">
                                            Hosted by {event.host}
                                        </span>
                                        <button className="rounded-full bg-slate-950 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-slate-800">
                                            Register
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="relative w-full bg-white py-24 sm:py-32">
                <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="mx-auto mb-16 max-w-2xl text-center"
                    >
                        

                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[46px]"
                        >
                            Loved by our{" "}
                            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                                community
                            </span>
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="grid gap-6 lg:grid-cols-3"
                    >
                        {testimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial.name}
                                variants={itemVariants}
                                whileHover={{
                                    y: -6,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                    },
                                }}
                                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.1)]"
                            >
                                <div className="mb-6 flex gap-1">
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <HiOutlineStar
                                                key={i}
                                                className="h-5 w-5 fill-amber-400 text-amber-400"
                                            />
                                        ),
                                    )}
                                </div>

                                <p className="text-[17px] leading-[1.7] text-slate-700">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>

                                <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">
                                    <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-slate-100">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-950">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-slate-500">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-50 to-violet-50 opacity-50 blur-3xl" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="relative w-full bg-slate-50/50 py-24 sm:py-32">
                <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="mx-auto mb-16 max-w-2xl text-center"
                    >

                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[46px]"
                        >
                            Moments that matter
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-4"
                    >
                        {galleryImages.map((img, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className={`group relative overflow-hidden rounded-2xl ${img.span || ""}`}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-slate-950/0 transition-all duration-300 group-hover:bg-slate-950/30" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                                    <div className="rounded-full bg-white/20 p-3 backdrop-blur-md">
                                        <HiOutlineHeart className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="relative w-full bg-white py-24 sm:py-32">
                <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="mx-auto mb-16 max-w-2xl text-center"
                    >

                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[46px]"
                        >
                            Frequently asked questions
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="mx-auto max-w-3xl space-y-4"
                    >
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                                    openFaq === idx
                                        ? "border-indigo-200 bg-indigo-50/40 shadow-[0_8px_24px_rgba(99,102,241,0.08)]"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenFaq(openFaq === idx ? null : idx)
                                    }
                                    className="flex w-full items-center justify-between gap-4 p-6 text-left"
                                >
                                    <h3 className="text-base font-black text-slate-950 sm:text-lg">
                                        {faq.q}
                                    </h3>
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                                            openFaq === idx
                                                ? "rotate-180 bg-indigo-100 text-indigo-600"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        <HiOutlineChevronDown className="h-5 w-5" />
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                duration: 0.35,
                                                ease: [0.16, 1, 0.3, 1],
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6">
                                                <p className="text-[15px] leading-[1.75] text-slate-600">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="relative w-full overflow-hidden bg-slate-950 py-24 sm:py-32">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-3xl" />
                </div>

                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                        backgroundSize: "32px 32px",
                    }}
                />

                <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="mx-auto max-w-4xl text-center"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/25"
                        >
                            <HiOutlineEmojiHappy className="h-8 w-8" />
                        </motion.div>

                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl"
                        >
                            Ready to join our{" "}
                            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                                family?
                            </span>
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
                        >
                            Become part of Bangladesh&apos;s most welcoming
                            travel community. Share experiences, make friends,
                            and discover your next adventure.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="mx-auto mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                        >
                            <Link
                                href="/register"
                                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-10 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-950 shadow-[0_14px_40px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_50px_rgba(255,255,255,0.3)]"
                            >
                                Join Now — It&apos;s Free
                                <HiOutlineArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href="/about"
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-10 text-sm font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/[0.12]"
                            >
                                Learn More
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mt-12 flex items-center justify-center gap-8 border-t border-white/10 pt-8"
                        >
                            <div className="text-center">
                                <div className="text-2xl font-black text-white">
                                    50K+
                                </div>
                                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                                    Members
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="text-center">
                                <div className="text-2xl font-black text-white">
                                    4.9
                                </div>
                                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                                    Rating
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div className="text-center">
                                <div className="text-2xl font-black text-white">
                                    100%
                                </div>
                                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                                    Free
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default CommunityPage;
