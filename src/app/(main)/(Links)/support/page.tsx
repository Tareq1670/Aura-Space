"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    motion,
    useInView,
    useScroll,
    useTransform,
    AnimatePresence,
    type Variants,
} from "framer-motion";
import {
    HiOutlineSearch,
    HiOutlineChatAlt2,
    HiOutlineMail,
    HiOutlinePhone,
    HiOutlineClock,
    HiOutlineCalendar,
    HiOutlineShieldCheck,
    HiOutlineCreditCard,
    HiOutlineUserCircle,
    HiOutlineExclamationCircle,
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineSparkles,
    HiOutlineGlobe,
    HiOutlineHeart,
    HiOutlinePlus,
    HiOutlineMinus,
    HiOutlinePaperAirplane,
    HiOutlineOfficeBuilding,
    HiOutlineWifi,
    HiOutlineX,
} from "react-icons/hi";

interface Category {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

interface Article {
    id: string;
    title: string;
    excerpt: string;
    icon: React.ReactNode;
    readTime: string;
}

interface ContactMethod {
    id: string;
    title: string;
    description: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    action: string;
}

interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

interface Testimonial {
    id: string;
    name: string;
    role: string;
    avatar: string;
    content: string;
    rating: number;
}

interface FormData {
    name: string;
    email: string;
    subject: string;
    category: string;
    priority: string;
    message: string;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
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

const categories: Category[] = [
    {
        id: "booking",
        title: "Booking Issues",
        description: "Reservations, changes, cancellations, and modifications",
        icon: <HiOutlineCalendar className="h-6 w-6" />,
        color: "from-indigo-500 to-violet-600",
    },
    {
        id: "payments",
        title: "Payments & Refunds",
        description: "Billing, payment methods, refunds, and charges",
        icon: <HiOutlineCreditCard className="h-6 w-6" />,
        color: "from-violet-500 to-fuchsia-600",
    },
    {
        id: "account",
        title: "Account Settings",
        description: "Profile, security, verification, and preferences",
        icon: <HiOutlineUserCircle className="h-6 w-6" />,
        color: "from-fuchsia-500 to-pink-600",
    },
    {
        id: "host",
        title: "Host Support",
        description: "Listing management, payouts, and hosting tools",
        icon: <HiOutlineOfficeBuilding className="h-6 w-6" />,
        color: "from-pink-500 to-rose-600",
    },
    {
        id: "technical",
        title: "Technical Help",
        description: "App issues, login problems, and bug reports",
        icon: <HiOutlineWifi className="h-6 w-6" />,
        color: "from-rose-500 to-orange-500",
    },
    {
        id: "safety",
        title: "Safety & Security",
        description: "Emergency assistance, safety concerns, and reporting",
        icon: <HiOutlineShieldCheck className="h-6 w-6" />,
        color: "from-orange-500 to-amber-500",
    },
];

const articles: Article[] = [
    {
        id: "1",
        title: "How to cancel a reservation",
        excerpt:
            "Step-by-step guide to cancel your booking and understand refund policies",
        icon: <HiOutlineX className="h-5 w-5" />,
        readTime: "3 min read",
    },
    {
        id: "2",
        title: "Updating your payment method",
        excerpt: "Add, remove, or change your default payment options securely",
        icon: <HiOutlineCreditCard className="h-5 w-5" />,
        readTime: "2 min read",
    },
    {
        id: "3",
        title: "Verifying your identity",
        excerpt: "Complete the verification process for enhanced security",
        icon: <HiOutlineShieldCheck className="h-5 w-5" />,
        readTime: "4 min read",
    },
    {
        id: "4",
        title: "Contacting your host",
        excerpt: "Best practices for communicating with property owners",
        icon: <HiOutlineChatAlt2 className="h-5 w-5" />,
        readTime: "2 min read",
    },
];

const contactMethods: ContactMethod[] = [
    {
        id: "chat",
        title: "Live Chat",
        description: "Instant support from our team",
        value: "Available 24/7",
        icon: <HiOutlineChatAlt2 className="h-6 w-6" />,
        color: "from-emerald-500 to-teal-600",
        action: "Start Chat",
    },
    {
        id: "email",
        title: "Email Support",
        description: "Get a detailed response",
        value: "support@auraspace.com",
        icon: <HiOutlineMail className="h-6 w-6" />,
        color: "from-indigo-500 to-violet-600",
        action: "Send Email",
    },
    {
        id: "phone",
        title: "Phone Support",
        description: "Speak with an agent",
        value: "+880 1700-000-000",
        icon: <HiOutlinePhone className="h-6 w-6" />,
        color: "from-violet-500 to-fuchsia-600",
        action: "Call Now",
    },
    {
        id: "whatsapp",
        title: "WhatsApp",
        description: "Message us on WhatsApp",
        value: "+880 1700-000-000",
        icon: <HiOutlinePaperAirplane className="h-6 w-6" />,
        color: "from-green-500 to-emerald-600",
        action: "Message",
    },
];

const faqs: FaqItem[] = [
    {
        id: "1",
        question: "How do I cancel my booking and get a refund?",
        answer: "You can cancel your booking by going to 'My Trips' and selecting 'Cancel Reservation'. Refund eligibility depends on the cancellation policy chosen by the host. Typically, full refunds are available if cancelled 48 hours before check-in. The refund will be processed to your original payment method within 5-7 business days.",
    },
    {
        id: "2",
        question: "What should I do if I can't access my account?",
        answer: "If you're having trouble logging in, try resetting your password using the 'Forgot Password' link. If you've enabled two-factor authentication and lost access to your device, contact our support team immediately with proof of identity for account recovery.",
    },
    {
        id: "3",
        question: "How do I modify my reservation dates?",
        answer: "To change your dates, go to 'My Trips', select your booking, and click 'Modify Reservation'. Note that date changes are subject to host approval and availability. Additional charges may apply if the new dates have different pricing.",
    },
    {
        id: "4",
        question: "Is my payment information secure?",
        answer: "Absolutely. We use 256-bit SSL encryption and are PCI DSS compliant. Your payment details are never stored on our servers; they're processed securely through our payment partners. We also offer two-factor authentication for added security.",
    },
    {
        id: "5",
        question: "What is the AuraSpace Guarantee?",
        answer: "The AuraSpace Guarantee protects you if your booking falls through or if the property significantly differs from the listing. Contact us within 24 hours of check-in, and we'll either find you a similar place or provide a full refund.",
    },
];

const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Sarah Rahman",
        role: "Traveler",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        content:
            "The support team resolved my booking issue within 30 minutes. Incredible service that made me feel truly valued as a customer.",
        rating: 5,
    },
    {
        id: "2",
        name: "Karim Hassan",
        role: "Host",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        content:
            "As a host, having 24/7 support gives me peace of mind. The team helped me optimize my listing and increase bookings significantly.",
        rating: 5,
    },
    {
        id: "3",
        name: "Nadia Islam",
        role: "Business Traveler",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
        content:
            "I had an urgent issue during a business trip. The live chat support was responsive and professional. Truly world-class service.",
        rating: 5,
    },
];

const SupportPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState<string | null>("1");
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        subject: "",
        category: "",
        priority: "medium",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const heroRef = useRef<HTMLElement>(null);
    const statsRef = useRef<HTMLElement>(null);
    const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
    const isStatsInView = useInView(statsRef, { once: true, margin: "-50px" });

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setFormData({
            name: "",
            email: "",
            subject: "",
            category: "",
            priority: "medium",
            message: "",
        });
    };

    const toggleFaq = (id: string) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    return (
        <main className="min-h-screen w-full bg-slate-50/30">
            <section
                ref={heroRef}
                className="relative w-full overflow-hidden bg-slate-950 pb-28 pt-32 sm:pb-36 sm:pt-40 lg:pb-44 lg:pt-48"
            >
                <motion.div
                    className="absolute inset-0 -z-10"
                    style={{ y: heroY, opacity: heroOpacity }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/90 to-slate-900" />
                    <div className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-indigo-500/15 blur-3xl" />
                    <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-violet-500/15 blur-3xl" />
                    <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/[0.08] blur-3xl" />
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
                            How can we{" "}
                            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                                help you?
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="mx-auto mt-6 max-w-2xl text-lg leading-[1.8] text-white/60 sm:text-xl"
                        >
                            Get instant answers, personalized support, and
                            expert guidance for all your AuraSpace needs.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="mx-auto mt-12 max-w-2xl"
                        >
                            <div
                                className={`group relative flex items-center rounded-2xl border bg-white/5 backdrop-blur-xl transition-all duration-500 ${
                                    isSearchFocused
                                        ? "border-indigo-400/50 bg-white/10 shadow-[0_0_60px_rgba(99,102,241,0.25)]"
                                        : "border-white/10 hover:border-white/20 hover:bg-white/[0.08]"
                                }`}
                            >
                                <div className="pointer-events-none absolute left-6 text-white/30 transition-colors group-focus-within:text-indigo-300">
                                    <HiOutlineSearch className="h-6 w-6" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for help articles..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="h-16 w-full rounded-2xl border-none bg-transparent pl-16 pr-32 text-base font-medium text-white placeholder:text-white/30 focus:outline-none focus:ring-0 sm:h-20 sm:text-lg"
                                />
                                <div className="absolute right-4 flex items-center gap-2">
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="rounded-full bg-white/10 p-2 text-white/60 transition-all hover:bg-white/20 hover:text-white"
                                        >
                                            <HiOutlineX className="h-5 w-5" />
                                        </button>
                                    )}
                                    <button className="hidden rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg transition-transform hover:scale-105 sm:block">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mx-auto mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                        >
                            <Link
                                href="#contact"
                                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-950 shadow-[0_10px_40px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_14px_50px_rgba(255,255,255,0.3)]"
                            >
                                Contact Support
                                <HiOutlineArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href="#ticket"
                                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-8 text-sm font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/[0.12]"
                            >
                                Submit Ticket
                                <HiOutlinePaperAirplane className="h-5 w-5" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="relative -mt-16 w-full px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1],
                            type: "tween",
                        }}
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {categories.map((category, idx) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: idx * 0.1,
                                    type: "tween",
                                }}
                                whileHover={{
                                    y: -6,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                    },
                                }}
                                className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-500 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.1)] sm:p-8"
                            >
                                <div
                                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-110`}
                                >
                                    {category.icon}
                                </div>
                                <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">
                                    {category.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                                    {category.description}
                                </p>
                                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-indigo-600 transition-colors group-hover:text-indigo-700">
                                    Explore
                                    <HiOutlineArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                            Quick answers
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="grid gap-6 lg:grid-cols-2"
                    >
                        {articles.map((article) => (
                            <motion.div
                                key={article.id}
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                className="group flex items-start gap-5 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/30"
                            >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                                    {article.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-slate-950 transition-colors group-hover:text-indigo-700">
                                        {article.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {article.excerpt}
                                    </p>
                                    <div className="mt-3 flex items-center gap-3">
                                        <span className="text-xs font-medium text-slate-400">
                                            {article.readTime}
                                        </span>
                                        <span className="text-xs font-bold text-indigo-600">
                                            Read article
                                        </span>
                                    </div>
                                </div>
                                <HiOutlineArrowRight className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-indigo-500" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section
                ref={statsRef}
                className="relative w-full bg-slate-50/50 py-24 sm:py-32"
            >
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
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl"
                        >
                            By the numbers
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={
                            isStatsInView
                                ? { opacity: 1, y: 0 }
                                : { opacity: 0, y: 30 }
                        }
                        transition={{
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1],
                            type: "tween",
                        }}
                        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                    >
                        {[
                            {
                                value: "98%",
                                label: "Satisfaction Rate",
                                icon: <HiOutlineHeart className="h-5 w-5" />,
                            },
                            {
                                value: "<2h",
                                label: "Avg. Response",
                                icon: <HiOutlineClock className="h-5 w-5" />,
                            },
                            {
                                value: "50K+",
                                label: "Tickets Resolved",
                                icon: (
                                    <HiOutlineCheckCircle className="h-5 w-5" />
                                ),
                            },
                            {
                                value: "24/7",
                                label: "Always Online",
                                icon: <HiOutlineGlobe className="h-5 w-5" />,
                            },
                        ].map((stat, idx) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={
                                    isStatsInView
                                        ? { opacity: 1, scale: 1 }
                                        : { opacity: 0, scale: 0.9 }
                                }
                                transition={{
                                    duration: 0.5,
                                    delay: idx * 0.1,
                                    type: "tween",
                                }}
                                className="flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_4px_20px_rgba(15,23,42,0.04)]"
                            >
                                <div className="mb-3 text-indigo-500">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-black tracking-[-0.02em] text-slate-950 sm:text-4xl">
                                    {stat.value}
                                </div>
                                <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section
                id="contact"
                className="relative w-full bg-white py-24 sm:py-32"
            >
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
                            Contact us directly
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {contactMethods.map((method) => (
                            <motion.div
                                key={method.id}
                                variants={itemVariants}
                                whileHover={{
                                    y: -8,
                                    transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                    },
                                }}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)]"
                            >
                                <div
                                    className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${method.color} text-white shadow-lg`}
                                >
                                    {method.icon}
                                </div>
                                <h3 className="text-lg font-black text-slate-950">
                                    {method.title}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {method.description}
                                </p>
                                <div className="mt-4 text-sm font-bold text-slate-900">
                                    {method.value}
                                </div>
                                <button className="mt-5 w-full rounded-xl bg-slate-950 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-slate-800">
                                    {method.action}
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section
                id="ticket"
                className="relative w-full bg-slate-50/50 py-24 sm:py-32"
            >
                <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                        <div className="grid lg:grid-cols-5">
                            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-10 text-white lg:col-span-2">
                                <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/30 blur-3xl" />
                                <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-violet-500/30 blur-3xl" />

                                <div className="relative">
                                    <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                                        <HiOutlinePaperAirplane className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-2xl font-black leading-tight">
                                        Submit a support ticket
                                    </h3>
                                    <p className="mt-4 text-sm leading-relaxed text-white/60">
                                        Can&apos;t find what you&apos;re looking
                                        for? Send us a message and our team will
                                        get back to you as soon as possible.
                                    </p>

                                    <div className="mt-10 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <HiOutlineCheckCircle className="h-5 w-5 text-emerald-400" />
                                            <span className="text-sm text-white/80">
                                                Priority support for urgent
                                                issues
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <HiOutlineCheckCircle className="h-5 w-5 text-emerald-400" />
                                            <span className="text-sm text-white/80">
                                                Track your ticket status
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <HiOutlineCheckCircle className="h-5 w-5 text-emerald-400" />
                                            <span className="text-sm text-white/80">
                                                Expert assistance guaranteed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 lg:col-span-3 lg:p-10">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                                Category
                                            </label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        category:
                                                            e.target.value,
                                                    })
                                                }
                                                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                            >
                                                <option value="">
                                                    Select category
                                                </option>
                                                <option value="booking">
                                                    Booking Issue
                                                </option>
                                                <option value="payment">
                                                    Payment Problem
                                                </option>
                                                <option value="account">
                                                    Account Help
                                                </option>
                                                <option value="technical">
                                                    Technical Support
                                                </option>
                                                <option value="other">
                                                    Other
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                                Priority
                                            </label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        priority:
                                                            e.target.value,
                                                    })
                                                }
                                                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">
                                                    Medium
                                                </option>
                                                <option value="high">
                                                    High - Urgent
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.subject}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    subject: e.target.value,
                                                })
                                            }
                                            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                            placeholder="Brief description of your issue"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Message
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    message: e.target.value,
                                                })
                                            }
                                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                            placeholder="Describe your issue in detail..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-sm font-extrabold uppercase tracking-[0.16em] text-white shadow-lg transition-all hover:bg-slate-800 disabled:opacity-70"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Submit Ticket
                                                <HiOutlinePaperAirplane className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
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
                            Common questions
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="mx-auto max-w-3xl space-y-4"
                    >
                        {faqs.map((faq) => (
                            <motion.div
                                key={faq.id}
                                variants={itemVariants}
                                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                                    openFaq === faq.id
                                        ? "border-indigo-200 bg-indigo-50/40 shadow-[0_8px_24px_rgba(99,102,241,0.08)]"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(faq.id)}
                                    className="flex w-full items-center justify-between gap-4 p-6 text-left"
                                >
                                    <h3 className="text-base font-black text-slate-950 sm:text-lg">
                                        {faq.question}
                                    </h3>
                                    <div
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                                            openFaq === faq.id
                                                ? "bg-indigo-100 text-indigo-600"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        {openFaq === faq.id ? (
                                            <HiOutlineMinus className="h-4 w-4" />
                                        ) : (
                                            <HiOutlinePlus className="h-4 w-4" />
                                        )}
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {openFaq === faq.id && (
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
                                                type: "tween",
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6">
                                                <p className="text-[15px] leading-[1.75] text-slate-600">
                                                    {faq.answer}
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

            <section className="relative w-full bg-slate-50/50 py-24 sm:py-32">
                <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                    >
                        <motion.div
                            variants={itemVariants}
                            className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 p-10 text-white shadow-2xl sm:p-16"
                        >
                            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
                            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-white/20 blur-3xl" />

                            <div className="relative flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
                                <div className="flex-1">
                                    <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
                                        <HiOutlineExclamationCircle className="h-5 w-5" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                            Emergency Support
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black leading-tight sm:text-3xl">
                                        Need immediate assistance?
                                    </h3>
                                    <p className="mt-3 text-white/80">
                                        For urgent safety concerns or active
                                        booking emergencies, our priority line
                                        is available 24/7.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <button className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-extrabold uppercase tracking-[0.16em] text-rose-600 shadow-lg transition-all hover:scale-[1.02]">
                                        <HiOutlinePhone className="h-5 w-5" />
                                        Emergency Line
                                    </button>
                                    <button className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 text-sm font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-all hover:bg-white/20">
                                        Report Issue
                                    </button>
                                </div>
                            </div>
                        </motion.div>
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
                            className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl"
                        >
                            What our users say
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
                                key={testimonial.id}
                                variants={itemVariants}
                                whileHover={{ y: -6 }}
                                className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 transition-all duration-300 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.1)]"
                            >
                                <div className="mb-4 flex gap-1">
                                    {[...Array(testimonial.rating)].map(
                                        (_, i) => (
                                            <HiOutlineSparkles
                                                key={i}
                                                className="h-4 w-4 fill-amber-400 text-amber-400"
                                            />
                                        ),
                                    )}
                                </div>
                                <p className="text-[15px] leading-relaxed text-slate-700">
                                    &ldquo;{testimonial.content}&rdquo;
                                </p>
                                <div className="mt-6 flex items-center gap-4 border-t border-slate-200 pt-6">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-950">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
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

                <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="mx-auto max-w-4xl text-center"
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="text-3xl font-black leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl"
                        >
                            Still have questions?
                        </motion.h2>
                        <motion.p
                            variants={itemVariants}
                            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
                        >
                            Our team is ready to help you with any issue, any
                            time.
                        </motion.p>
                        <motion.div
                            variants={itemVariants}
                            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                        >
                            <Link
                                href="#contact"
                                className="group inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-10 text-sm font-extrabold uppercase tracking-[0.16em] text-slate-950 shadow-[0_14px_40px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_50px_rgba(255,255,255,0.3)]"
                            >
                                Contact Now
                                <HiOutlineArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="#"
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-10 text-sm font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/[0.12]"
                            >
                                Browse Articles
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
};

export default SupportPage;