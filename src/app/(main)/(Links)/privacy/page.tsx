"use client";

import React, { useRef, useState, ReactNode } from "react";
import { motion, useInView, Variants, AnimatePresence } from "framer-motion";
import {
    HiShieldCheck,
    HiLockClosed,
    HiUser,
    HiCreditCard,
    HiDevicePhoneMobile,
    HiMapPin,
    HiCog6Tooth,
    HiChatBubbleLeftRight,
    HiSparkles,
    HiFingerPrint,
    HiBell,
    HiWrenchScrewdriver,
    HiServerStack,
    HiCloudArrowUp,
    HiCheckBadge,
    HiEye,
    HiPencilSquare,
    HiTrash,
    HiArrowDownTray,
    HiHandRaised,
    HiAdjustmentsHorizontal,
    HiEnvelope,
    HiQuestionMarkCircle,
    HiExclamationTriangle,
    HiArrowRight,
    HiDocumentText,
    HiGlobeAlt,
    HiChartBarSquare,
    HiCursorArrowRays,
    HiMegaphone,
    HiKey,
    HiClock,
    HiUserPlus,
    HiHome,
    HiArchiveBoxXMark,
    HiNoSymbol,
    HiCalendarDays,
    HiArrowPath,
    HiBookOpen,
    HiUserGroup,
    HiPhone,
    HiBuildingOffice2,
    HiInformationCircle,
    HiDocumentMagnifyingGlass,
    HiCircleStack,
    HiCommandLine,
    HiCubeTransparent,
    HiChevronDown,
} from "react-icons/hi2";
import { FaShieldAlt } from "react-icons/fa";

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            delay: i * 0.08,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
};

const fadeInVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number = 0) => ({
        opacity: 1,
        transition: { duration: 0.5, delay: i * 0.05 },
    }),
};

const scaleInVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i: number = 0) => ({
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
};

const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
};

const slideInLeftVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i: number = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
};

const slideInRightVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: (i: number = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
};

interface FloatingOrbProps {
    className: string;
    delay?: number;
}

const FloatingOrb = ({ className, delay = 0 }: FloatingOrbProps) => (
    <motion.div
        className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
        animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.05, 1],
        }}
        transition={{
            duration: 10,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
        }}
    />
);

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
}

const AnimatedSection = ({
    children,
    className = "",
    id,
}: AnimatedSectionProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.section
            ref={ref}
            id={id}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className={className}
        >
            {children}
        </motion.section>
    );
};

interface CustomChipProps {
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
}

const CustomChip = ({ children, icon, className = "" }: CustomChipProps) => (
    <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide border transition-all duration-300 ${className}`}
    >
        {icon && <span className="flex-shrink-0 text-current">{icon}</span>}
        <span>{children}</span>
    </span>
);

interface CustomButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "bordered";
    size?: "md" | "lg";
    className?: string;
    onClick?: () => void;
    as?: "button" | "a";
    href?: string;
}

const CustomButton = ({
    children,
    variant = "primary",
    size = "md",
    className = "",
    onClick,
    as = "button",
    href,
}: CustomButtonProps) => {
    const baseStyles =
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-950 active:scale-[0.98]";

    const variantStyles = {
        primary:
            "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 hover:opacity-95 border border-transparent",
        secondary:
            "bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-gray-900 dark:text-white border border-transparent dark:border-white/[0.06]",
        bordered:
            "bg-transparent hover:bg-white/[0.04] border border-gray-200 dark:border-white/[0.1] text-gray-800 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/[0.2]",
    };

    const sizeStyles = {
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3 text-base",
    };

    const combinedClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    if (as === "a") {
        return (
            <a href={href} className={combinedClasses}>
                {children}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={combinedClasses}>
            {children}
        </button>
    );
};

interface SectionHeaderProps {
    badge: string;
    badgeIcon?: ReactNode;
    title: string;
    description: string;
}

const SectionHeader = ({
    badge,
    badgeIcon,
    title,
    description,
}: SectionHeaderProps) => (
    <div className="text-center mb-12 md:mb-16">
        <motion.div variants={fadeUpVariants} custom={0} className="mb-4">
            <CustomChip
                icon={badgeIcon || <HiShieldCheck className="w-3.5 h-3.5" />}
                className="bg-violet-50 dark:bg-violet-500/[0.08] text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-500/[0.15] uppercase tracking-wider"
            >
                {badge}
            </CustomChip>
        </motion.div>
        <motion.h2
            variants={fadeUpVariants}
            custom={1}
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-gray-900 dark:text-white mb-4 leading-[1.15] tracking-tight"
        >
            {title}
        </motion.h2>
        <motion.p
            variants={fadeUpVariants}
            custom={2}
            className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
            {description}
        </motion.p>
    </div>
);

interface IconCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    index?: number;
    gradient?: string;
}

const IconCard = ({
    icon,
    title,
    description,
    index = 0,
    gradient = "from-violet-500 to-indigo-500",
}: IconCardProps) => (
    <motion.div
        variants={scaleInVariants}
        custom={index}
        whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
        className="group relative bg-white dark:bg-white/[0.02] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-xl hover:shadow-violet-500/[0.04] dark:hover:shadow-violet-500/[0.06] transition-all duration-400 backdrop-blur-sm"
    >
        <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 text-white text-xl shadow-lg shadow-violet-500/10 group-hover:scale-105 transition-all duration-300`}
        >
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 leading-snug">
            {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {description}
        </p>
    </motion.div>
);

interface StatCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    stat: string;
    statLabel: string;
    index?: number;
}

const StatCard = ({
    icon,
    title,
    description,
    stat,
    statLabel,
    index = 0,
}: StatCardProps) => (
    <motion.div
        variants={scaleInVariants}
        custom={index}
        whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
        className="group relative bg-white dark:bg-white/[0.02] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-xl hover:shadow-violet-500/[0.04] dark:hover:shadow-violet-500/[0.06] transition-all duration-400 backdrop-blur-sm"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/10 group-hover:scale-105 transition-transform duration-300">
                {icon}
            </div>
            <div className="text-right">
                <div className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    {stat}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                    {statLabel}
                </div>
            </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {description}
        </p>
    </motion.div>
);

interface TimelineStep {
    icon: ReactNode;
    title: string;
    description: string;
    duration: string;
}

const timelineSteps: TimelineStep[] = [
    {
        icon: <HiUserPlus className="w-5 h-5" />,
        title: "Account Active",
        description:
            "All personal data, booking history, preferences, and account settings are retained for the full duration your account remains active on AuraSpace.",
        duration: "Account lifetime",
    },
    {
        icon: <HiHome className="w-5 h-5" />,
        title: "Booking Records",
        description:
            "Transaction records, booking confirmations, and payment receipts are retained for 7 years to comply with tax regulations and legal obligations.",
        duration: "7 years",
    },
    {
        icon: <HiCreditCard className="w-5 h-5" />,
        title: "Payment Data",
        description:
            "Payment method details are tokenized and retained only as long as needed for refunds and disputes. Full card data is never stored on our servers.",
        duration: "18 months",
    },
    {
        icon: <HiChartBarSquare className="w-5 h-5" />,
        title: "Usage Analytics",
        description:
            "Anonymized usage data and aggregated analytics are retained for platform improvement purposes. This data cannot be linked back to individual users.",
        duration: "3 years",
    },
    {
        icon: <HiArchiveBoxXMark className="w-5 h-5" />,
        title: "Account Deletion",
        description:
            "Upon account deletion request, all personal data is permanently purged from active systems within 30 days and from backups within 90 days.",
        duration: "30–90 days",
    },
    {
        icon: <HiClock className="w-5 h-5" />,
        title: "Legal Hold",
        description:
            "In cases of active legal proceedings, disputes, or regulatory requirements, specific data may be retained beyond standard periods until resolution.",
        duration: "Until resolved",
    },
];

interface FaqItem {
    question: string;
    answer: string;
}

const faqItems: FaqItem[] = [
    {
        question: "How does AuraSpace protect my personal data?",
        answer: "We employ enterprise-grade security measures including AES-256 encryption for data at rest, TLS 1.3 for data in transit, multi-factor authentication, 24/7 automated threat monitoring, and regular third-party security audits. Our infrastructure runs on SOC 2 Type II certified data centers with redundant backups across multiple geographic regions.",
    },
    {
        question: "Can I delete my account and all associated data?",
        answer: "Yes, absolutely. You can request account deletion at any time from Account Settings → Privacy → Delete Account, or by contacting privacy@auraspace.com. All personal data is permanently removed from active systems within 30 days and from backups within 90 days. Some anonymized transaction data may be retained for legal and tax compliance purposes.",
    },
    {
        question: "Does AuraSpace sell my personal data to third parties?",
        answer: "No, never. We do not sell, rent, lease, or trade your personal information to any third parties for their marketing or commercial purposes. We only share data with trusted service providers (like Stripe for payments) who are contractually bound by strict data processing agreements and our privacy standards.",
    },
    {
        question: "What cookies does AuraSpace use and can I control them?",
        answer: "We use four categories of cookies: Essential (required for platform functionality), Analytics (usage insights), Functional (preference memory), and Marketing (relevant advertising). Essential cookies cannot be disabled as they're required for security and authentication. All other cookie categories can be managed through your browser settings or our Cookie Preferences center.",
    },
    {
        question: "How can I download a complete copy of my data?",
        answer: "Navigate to Account Settings → Privacy → Download My Data to request a full data export. Your export includes all personal information, booking history, reviews, saved properties, and account preferences in machine-readable JSON and CSV formats. Exports are typically ready within 24 hours and available for download for 7 days.",
    },
    {
        question: "Is AuraSpace compliant with GDPR and CCPA?",
        answer: "Yes. AuraSpace is fully compliant with the General Data Protection Regulation (GDPR) for EU/EEA users, the California Consumer Privacy Act (CCPA) for California residents, and other applicable regional privacy laws. We have appointed a Data Protection Officer (DPO) and maintain comprehensive data processing agreements with all service providers.",
    },
    {
        question: "How long does AuraSpace retain my personal data?",
        answer: "Retention periods vary by data type: account data is kept for the lifetime of your account, booking records are retained for 7 years for legal compliance, payment data is kept for 18 months, and anonymized analytics for 3 years. Upon account deletion, personal data is purged within 30 days from active systems and 90 days from backups.",
    },
    {
        question: "What happens to my data if AuraSpace is acquired or merged?",
        answer: "In the event of a merger, acquisition, or asset sale, your personal data may be transferred to the acquiring entity. We will provide at least 30 days advance notice via email and prominent website notification before any such transfer occurs. You will have the option to delete your account and all associated data before the transfer is completed.",
    },
];

interface ContactOption {
    icon: ReactNode;
    title: string;
    description: string;
    action: string;
    link: string;
    gradient: string;
}

const contactOptions: ContactOption[] = [
    {
        icon: <HiEnvelope className="w-6 h-6" />,
        title: "Privacy Email",
        description:
            "For data requests, privacy inquiries, and general questions about your information.",
        action: "privacy@auraspace.com",
        link: "mailto:privacy@auraspace.com",
        gradient: "from-violet-500 to-indigo-500",
    },
    {
        icon: <HiChatBubbleLeftRight className="w-6 h-6" />,
        title: "Support Center",
        description:
            "Browse our help documentation for step-by-step guides on privacy settings.",
        action: "Visit Help Center",
        link: "/help",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: <HiExclamationTriangle className="w-6 h-6" />,
        title: "Report a Concern",
        description:
            "Report a potential privacy violation, data breach, or security vulnerability.",
        action: "Submit Report",
        link: "/report",
        gradient: "from-amber-500 to-orange-500",
    },
];

const HeroSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section
            ref={ref}
            className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#050816]"
        >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#050816_0%,#0B1120_24%,#140b2d_58%,#050816_100%)]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(139,92,246,0.20),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_50%_55%,rgba(168,85,247,0.12),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.04),transparent_45%)]" />

            <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:46px_46px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)] [-webkit-mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.22)_0%,rgba(99,102,241,0.10)_28%,transparent_68%)]" />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-violet-500/10 blur-[140px] rounded-full" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] bg-indigo-500/10 blur-[120px] rounded-full" />

            <FloatingOrb
                className="w-[520px] h-[520px] bg-violet-500/18 -top-28 -left-28"
                delay={0}
            />
            <FloatingOrb
                className="w-[420px] h-[420px] bg-indigo-500/16 top-1/4 -right-24"
                delay={2.5}
            />
            <FloatingOrb
                className="w-[320px] h-[320px] bg-purple-500/12 bottom-16 left-1/3"
                delay={5}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8 inline-flex"
                >
                    <div className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/20 relative overflow-hidden">
                            <HiShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-white relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-6 flex justify-center"
                >
                    <span className="text-[11px] font-semibold text-violet-300 tracking-[0.2em] uppercase bg-violet-500/[0.08] px-3.5 py-1.5 rounded-full border border-violet-500/[0.15] backdrop-blur-md">
                        Last Updated — January 15, 2025
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                        duration: 0.7,
                        delay: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-bold text-white mb-6 tracking-tight leading-[1.1]"
                >
                    Privacy{" "}
                    <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Policy
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    At AuraSpace, we believe transparency isn&apos;t optional —
                    it&apos;s fundamental. Learn exactly how we collect, use,
                    and safeguard your personal information.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    <CustomButton
                        size="lg"
                        variant="primary"
                        onClick={() =>
                            document
                                .getElementById("introduction")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        Read Policy <HiArrowRight className="w-4 h-4" />
                    </CustomButton>

                    <CustomButton
                        size="lg"
                        variant="bordered"
                        className="dark:border-white/[0.1] hover:bg-white/[0.04] text-white"
                        onClick={() =>
                            document
                                .getElementById("contact")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        Contact Privacy Team
                    </CustomButton>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.55 }}
                    className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3.5 text-xs text-gray-400/80 uppercase tracking-widest font-medium"
                >
                    {[
                        {
                            icon: <HiLockClosed className="w-4 h-4" />,
                            text: "256-bit Encryption",
                        },
                        {
                            icon: <HiCheckBadge className="w-4 h-4" />,
                            text: "GDPR Compliant",
                        },
                        {
                            icon: <FaShieldAlt className="w-3.5 h-3.5" />,
                            text: "SOC 2 Certified",
                        },
                        {
                            icon: <HiGlobeAlt className="w-4 h-4" />,
                            text: "Global Standards",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                delay: 0.6 + i * 0.08,
                                duration: 0.4,
                            }}
                            className="flex items-center gap-2 bg-white/[0.03] dark:bg-white/[0.02] border border-white/[0.06] px-4 py-2 rounded-full backdrop-blur-sm"
                        >
                            <span className="text-violet-400">{item.icon}</span>
                            <span>{item.text}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-white dark:from-gray-950 via-white/80 dark:via-gray-950/80 to-transparent" />
        </section>
    );
};

const IntroductionSection = () => (
    <AnimatedSection
        id="introduction"
        className="py-20 md:py-28 px-6 max-w-6xl mx-auto"
    >
        <SectionHeader
            badge="Introduction"
            badgeIcon={<HiBookOpen className="w-3.5 h-3.5" />}
            title="Welcome to Our Privacy Policy"
            description="This Privacy Policy explains how AuraSpace handles your personal information when you use our accommodation and rental booking platform."
        />

        <motion.div
            variants={fadeUpVariants}
            custom={3}
            className="relative max-w-4xl mx-auto"
        >
            <div className="relative bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/15 rounded-3xl p-8 md:p-12 border border-violet-100 dark:border-violet-500/10 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-violet-200/60 to-indigo-200/60 dark:from-violet-600/10 dark:to-indigo-600/10 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-purple-200/40 to-pink-200/40 dark:from-purple-600/8 dark:to-pink-600/8 blur-3xl" />

                <div className="relative z-10 grid md:grid-cols-3 gap-10">
                    {[
                        {
                            icon: <HiEye className="w-7 h-7" />,
                            title: "Full Transparency",
                            text: "We clearly explain every piece of data we collect, the purpose behind it, and how it powers your AuraSpace experience.",
                        },
                        {
                            icon: <HiShieldCheck className="w-7 h-7" />,
                            title: "Ironclad Protection",
                            text: "Enterprise-grade encryption, SOC 2 compliance, and continuous monitoring ensure your data is protected at every layer.",
                        },
                        {
                            icon: <HiHandRaised className="w-7 h-7" />,
                            title: "Complete Control",
                            text: "Access, modify, export, or delete your data at any time. Your personal information belongs to you — always.",
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUpVariants}
                            custom={i + 4}
                            className="text-center md:text-left"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 mx-auto md:mx-0">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>

        <motion.div
            variants={fadeUpVariants}
            custom={8}
            className="max-w-4xl mx-auto mt-8"
        >
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-50/85 dark:bg-amber-500/[0.06] border border-amber-200/50 dark:border-amber-500/10">
                <HiInformationCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-amber-800 dark:text-amber-300 font-medium mb-1">
                        Scope of This Policy
                    </p>
                    <p className="text-sm text-amber-700/80 dark:text-amber-400/70 leading-relaxed">
                        This Privacy Policy applies to all AuraSpace services
                        including our website, mobile applications, APIs, and
                        any related services. By using AuraSpace, you agree to
                        the collection and use of information in accordance with
                        this policy.
                    </p>
                </div>
            </div>
        </motion.div>
    </AnimatedSection>
);

const collectItems: IconCardProps[] = [
    {
        icon: <HiUser className="w-5 h-5" />,
        title: "Personal Information",
        description:
            "Full name, email address, phone number, profile photo, date of birth, and government ID for identity verification when required.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: <HiHome className="w-5 h-5" />,
        title: "Booking Information",
        description:
            "Check-in/out dates, number of guests, special requests, accommodation preferences, booking history, and property reviews.",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        icon: <HiCreditCard className="w-5 h-5" />,
        title: "Payment Details",
        description:
            "Payment method type, billing address, transaction records, and refund history. Full card details are handled exclusively by our PCI-compliant payment processor.",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        icon: <HiDevicePhoneMobile className="w-5 h-5" />,
        title: "Device & Technical Data",
        description:
            "Device type, operating system, browser version, screen resolution, IP address, unique device identifiers, and crash reports.",
        gradient: "from-orange-500 to-amber-500",
    },
    {
        icon: <HiMapPin className="w-5 h-5" />,
        title: "Location Data",
        description:
            "Approximate location derived from your IP address. Precise GPS location only when you explicitly enable location services for nearby property search.",
        gradient: "from-rose-500 to-pink-500",
    },
    {
        icon: <HiChartBarSquare className="w-5 h-5" />,
        title: "Usage & Analytics",
        description:
            "Search queries, pages visited, features used, click patterns, session duration, and interaction data to improve platform functionality.",
        gradient: "from-indigo-500 to-violet-500",
    },
];

const InformationCollectedSection = () => (
    <AnimatedSection
        id="information-collected"
        className="py-20 md:py-28 px-6 bg-gray-50/40 dark:bg-white/[0.01]"
    >
        <div className="max-w-6xl mx-auto">
            <SectionHeader
                badge="Data Collection"
                badgeIcon={<HiCircleStack className="w-3.5 h-3.5" />}
                title="Information We Collect"
                description="We collect only what's necessary to deliver a secure, personalized booking experience. Here's a complete breakdown."
            />
            <motion.div
                variants={staggerContainer}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
                {collectItems.map((item, i) => (
                    <IconCard key={i} {...item} index={i} />
                ))}
            </motion.div>
        </div>
    </AnimatedSection>
);

const usageItems: IconCardProps[] = [
    {
        icon: <HiCog6Tooth className="w-5 h-5" />,
        title: "Booking Management",
        description:
            "Processing reservations, coordinating with hosts, managing check-ins, handling modifications, and processing cancellations and refunds.",
        gradient: "from-violet-500 to-indigo-500",
    },
    {
        icon: <HiChatBubbleLeftRight className="w-5 h-5" />,
        title: "Customer Support",
        description:
            "Responding to inquiries, resolving disputes between guests and hosts, providing real-time assistance, and escalating urgent issues.",
        gradient: "from-blue-500 to-sky-500",
    },
    {
        icon: <HiSparkles className="w-5 h-5" />,
        title: "Personalization",
        description:
            "Tailoring search results, recommending properties based on preferences and history, and customizing your browsing experience.",
        gradient: "from-amber-500 to-orange-500",
    },
    {
        icon: <HiFingerPrint className="w-5 h-5" />,
        title: "Security & Fraud Prevention",
        description:
            "Detecting suspicious activity, preventing unauthorized access, verifying identities, and protecting both guests and property hosts.",
        gradient: "from-emerald-500 to-green-500",
    },
    {
        icon: <HiBell className="w-5 h-5" />,
        title: "Communications",
        description:
            "Sending booking confirmations, check-in reminders, payment receipts, policy updates, and promotional content you've opted into.",
        gradient: "from-rose-500 to-pink-500",
    },
    {
        icon: <HiWrenchScrewdriver className="w-5 h-5" />,
        title: "Platform Improvements",
        description:
            "Analyzing usage patterns to optimize performance, develop new features, conduct A/B testing, and enhance overall user experience.",
        gradient: "from-purple-500 to-fuchsia-500",
    },
];

const HowWeUseSection = () => (
    <AnimatedSection id="how-we-use" className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
            <SectionHeader
                badge="Data Usage"
                badgeIcon={<HiCommandLine className="w-3.5 h-3.5" />}
                title="How We Use Your Information"
                description="Every piece of data serves a clear purpose. Here's exactly how your information powers your AuraSpace experience."
            />
            <motion.div
                variants={staggerContainer}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
                {usageItems.map((item, i) => (
                    <IconCard key={i} {...item} index={i} />
                ))}
            </motion.div>
        </div>
    </AnimatedSection>
);

const securityItems: StatCardProps[] = [
    {
        icon: <HiLockClosed className="w-6 h-6" />,
        title: "End-to-End Encryption",
        description:
            "All data in transit is protected with TLS 1.3 and data at rest uses AES-256 encryption across every storage layer.",
        stat: "256-bit",
        statLabel: "AES Encryption",
    },
    {
        icon: <HiCreditCard className="w-6 h-6" />,
        title: "Secure Payment Processing",
        description:
            "All payments are processed by PCI DSS Level 1 certified partners. We never store, process, or have access to your full card number.",
        stat: "PCI DSS",
        statLabel: "Level 1",
    },
    {
        icon: <HiServerStack className="w-6 h-6" />,
        title: "Redundant Infrastructure",
        description:
            "Data is replicated across geographically distributed data centers with automatic failover and disaster recovery capabilities.",
        stat: "99.99%",
        statLabel: "Uptime SLA",
    },
    {
        icon: <HiEye className="w-6 h-6" />,
        title: "Real-Time Threat Detection",
        description:
            "AI-powered monitoring continuously scans for anomalous activity, brute force attempts, and potential data breaches across our entire infrastructure.",
        stat: "24/7",
        statLabel: "Monitoring",
    },
    {
        icon: <HiKey className="w-6 h-6" />,
        title: "Multi-Factor Authentication",
        description:
            "Optional 2FA via authenticator apps, SMS, or hardware security keys adds a critical second layer of defense to your account.",
        stat: "2FA",
        statLabel: "Supported",
    },
    {
        icon: <HiAdjustmentsHorizontal className="w-6 h-6" />,
        title: "Access Control & Auditing",
        description:
            "Strict role-based access control with complete audit logging ensures only authorized personnel can access sensitive data.",
        stat: "RBAC",
        statLabel: "Enforced",
    },
];

const DataSecuritySection = () => (
    <AnimatedSection
        id="data-security"
        className="py-20 md:py-28 px-6 bg-gray-50/40 dark:bg-white/[0.01]"
    >
        <div className="max-w-6xl mx-auto">
            <SectionHeader
                badge="Security"
                badgeIcon={<HiLockClosed className="w-3.5 h-3.5" />}
                title="Data Storage & Security"
                description="Enterprise-grade security at every layer. Your data is protected by the same standards used by leading financial institutions."
            />
            <motion.div
                variants={staggerContainer}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
                {securityItems.map((item, i) => (
                    <StatCard key={i} {...item} index={i} />
                ))}
            </motion.div>
        </div>
    </AnimatedSection>
);

interface CookieItemData {
    icon: ReactNode;
    title: string;
    description: string;
    required: boolean;
    gradient: string;
    examples: string;
}

const cookieItems: CookieItemData[] = [
    {
        icon: <HiCog6Tooth className="w-5 h-5" />,
        title: "Essential Cookies",
        description:
            "Required for core functionality including authentication, session management, security tokens, and CSRF protection. The platform cannot function without these.",
        required: true,
        gradient: "from-blue-500 to-indigo-500",
        examples: "Session ID, Auth Token, CSRF Token",
    },
    {
        icon: <HiChartBarSquare className="w-5 h-5" />,
        title: "Analytics Cookies",
        description:
            "Help us understand how visitors interact with our platform, identify popular features, detect usability issues, and measure page performance.",
        required: false,
        gradient: "from-emerald-500 to-teal-500",
        examples: "Google Analytics, Mixpanel, Hotjar",
    },
    {
        icon: <HiCursorArrowRays className="w-5 h-5" />,
        title: "Functional Cookies",
        description:
            "Remember your preferences such as language, currency, region, display mode, and recently viewed properties for a consistent browsing experience.",
        required: false,
        gradient: "from-amber-500 to-orange-500",
        examples: "Language, Theme, Currency, Filters",
    },
    {
        icon: <HiMegaphone className="w-5 h-5" />,
        title: "Marketing Cookies",
        description:
            "Used to deliver relevant advertisements, measure campaign effectiveness, and prevent showing you the same ad repeatedly. You can opt out anytime.",
        required: false,
        gradient: "from-rose-500 to-pink-500",
        examples: "Google Ads, Meta Pixel, Attribution",
    },
];

const CookiesSection = () => (
    <AnimatedSection id="cookies" className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
            <SectionHeader
                badge="Cookies"
                badgeIcon={<HiCubeTransparent className="w-3.5 h-3.5" />}
                title="Cookies & Tracking Technologies"
                description="A transparent breakdown of every cookie type we use, why we use them, and how you can control them."
            />
            <motion.div
                variants={staggerContainer}
                className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto"
            >
                {cookieItems.map((item, i) => (
                    <motion.div
                        key={i}
                        variants={scaleInVariants}
                        custom={i}
                        whileHover={{ y: -5, transition: { duration: 0.25 } }}
                        className="relative bg-white dark:bg-white/[0.02] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-lg transition-all duration-500"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md`}
                            >
                                {item.icon}
                            </div>
                            <CustomChip
                                className={
                                    item.required
                                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-500/20"
                                        : "bg-gray-100 dark:bg-white/[0.04] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/[0.06]"
                                }
                            >
                                {item.required ? "Required" : "Optional"}
                            </CustomChip>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                            {item.description}
                        </p>
                        <div className="pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                <span className="font-medium text-gray-500 dark:text-gray-400">
                                    Examples:
                                </span>{" "}
                                {item.examples}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </AnimatedSection>
);

interface ThirdPartyItem {
    icon: ReactNode;
    name: string;
    provider: string;
    description: string;
    link: string;
    color: string;
    bg: string;
}

const thirdPartyItems: ThirdPartyItem[] = [
    {
        icon: <HiCreditCard className="w-6 h-6" />,
        name: "Payment Processing",
        provider: "Stripe",
        description:
            "Stripe handles all payment processing with PCI DSS Level 1 compliance. Your card information goes directly to Stripe and never touches our servers.",
        link: "https://stripe.com/privacy",
        color: "text-indigo-500",
        bg: "bg-indigo-50 dark:bg-indigo-500/[0.08]",
    },
    {
        icon: <HiFingerPrint className="w-6 h-6" />,
        name: "Authentication",
        provider: "Google, Apple, GitHub",
        description:
            "Social sign-in providers share only your basic profile and email with your explicit consent. We never receive your third-party passwords.",
        link: "https://policies.google.com/privacy",
        color: "text-red-500",
        bg: "bg-red-50 dark:bg-red-500/[0.08]",
    },
    {
        icon: <HiChartBarSquare className="w-6 h-6" />,
        name: "Analytics & Monitoring",
        provider: "Google Analytics, Sentry",
        description:
            "Analytics data is anonymized and aggregated. Error monitoring helps us detect and fix issues quickly to maintain platform reliability.",
        link: "https://policies.google.com/privacy",
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-500/[0.08]",
    },
    {
        icon: <HiCloudArrowUp className="w-6 h-6" />,
        name: "Cloud Infrastructure",
        provider: "AWS, Vercel",
        description:
            "Our platform runs on SOC 2 certified cloud infrastructure with data encryption at rest, geographic redundancy, and enterprise-grade DDoS protection.",
        link: "https://aws.amazon.com/privacy/",
        color: "text-orange-500",
        bg: "bg-orange-50 dark:bg-orange-500/[0.08]",
    },
];

const ThirdPartySection = () => (
    <AnimatedSection
        id="third-party"
        className="py-20 md:py-28 px-6 bg-gray-50/40 dark:bg-white/[0.01]"
    >
        <div className="max-w-6xl mx-auto">
            <SectionHeader
                badge="Third-Party"
                badgeIcon={<HiGlobeAlt className="w-3.5 h-3.5" />}
                title="Third-Party Services"
                description="We partner with industry-leading providers who meet our strict security and privacy requirements."
            />
            <motion.div
                variants={staggerContainer}
                className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto"
            >
                {thirdPartyItems.map((item, i) => (
                    <motion.div
                        key={i}
                        variants={scaleInVariants}
                        custom={i}
                        whileHover={{ y: -5, transition: { duration: 0.25 } }}
                        className="bg-white dark:bg-white/[0.02] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-lg transition-all duration-500"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div
                                className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}
                            >
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    {item.provider}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                            {item.description}
                        </p>
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 inline-flex items-center gap-1.5 font-medium group transition-colors"
                        >
                            View Privacy Policy{" "}
                            <HiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </AnimatedSection>
);

const rightsItems: IconCardProps[] = [
    {
        icon: <HiEye className="w-5 h-5" />,
        title: "Access Your Data",
        description:
            "Request a comprehensive report of all personal data we hold about you, delivered within 30 days.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: <HiPencilSquare className="w-5 h-5" />,
        title: "Rectify Information",
        description:
            "Correct or update any inaccurate personal information directly from your account settings at any time.",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        icon: <HiTrash className="w-5 h-5" />,
        title: "Delete Your Account",
        description:
            "Request permanent deletion of your account and all associated data. Completed within 30 days of verification.",
        gradient: "from-rose-500 to-red-500",
    },
    {
        icon: <HiArrowDownTray className="w-5 h-5" />,
        title: "Data Portability",
        description:
            "Export all your personal data, booking history, and preferences in machine-readable JSON or CSV format.",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        icon: <HiHandRaised className="w-5 h-5" />,
        title: "Withdraw Consent",
        description:
            "Revoke consent for optional data processing activities at any time without affecting prior lawful processing.",
        gradient: "from-amber-500 to-orange-500",
    },
    {
        icon: <HiNoSymbol className="w-5 h-5" />,
        title: "Object to Processing",
        description:
            "Object to processing of your data for direct marketing, profiling, or research purposes at any time.",
        gradient: "from-indigo-500 to-violet-500",
    },
];

const UserRightsSection = () => (
    <AnimatedSection id="user-rights" className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
            <SectionHeader
                badge="Your Rights"
                badgeIcon={<HiUserGroup className="w-3.5 h-3.5" />}
                title="You're Always in Control"
                description="Under GDPR, CCPA, and other privacy regulations, you have specific rights regarding your personal data. Here they are."
            />
            <motion.div
                variants={staggerContainer}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            >
                {rightsItems.map((item, i) => (
                    <IconCard key={i} {...item} index={i} />
                ))}
            </motion.div>
        </div>
    </AnimatedSection>
);

const DataRetentionSection = () => (
    <AnimatedSection
        id="data-retention"
        className="py-20 md:py-28 px-6 bg-gray-50/40 dark:bg-white/[0.01]"
    >
        <div className="max-w-4xl mx-auto">
            <SectionHeader
                badge="Retention"
                badgeIcon={<HiCalendarDays className="w-3.5 h-3.5" />}
                title="Data Retention Timeline"
                description="Understand how long we keep different types of data and what happens at each stage of its lifecycle."
            />

            <div className="relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-300 via-indigo-300 to-purple-300 dark:from-violet-600/30 dark:via-indigo-600/30 dark:to-purple-600/30 -translate-x-1/2 hidden md:block" />
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-violet-300 via-indigo-300 to-purple-300 dark:from-violet-600/30 dark:via-indigo-600/30 dark:to-purple-600/30 md:hidden" />

                <div className="space-y-8 md:space-y-14">
                    {timelineSteps.map((step, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                            <motion.div
                                key={i}
                                variants={
                                    isLeft
                                        ? slideInLeftVariants
                                        : slideInRightVariants
                                }
                                custom={i}
                                className={`relative flex items-start gap-5 md:gap-0 ${
                                    !isLeft
                                        ? "md:flex-row-reverse"
                                        : "md:flex-row"
                                }`}
                            >
                                <div className="md:hidden relative z-10 flex-shrink-0">
                                    <motion.div
                                        whileHover={{ scale: 1.15 }}
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25"
                                    >
                                        {step.icon}
                                    </motion.div>
                                </div>

                                <div className="hidden md:flex md:w-[calc(50%-2.5rem)] justify-end">
                                    {isLeft && (
                                        <div className="bg-white dark:bg-white/[0.02] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-lg transition-shadow duration-300 max-w-sm w-full">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {step.title}
                                                </h3>
                                                <CustomChip className="bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-500/20 text-xs">
                                                    {step.duration}
                                                </CustomChip>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="hidden md:flex items-center justify-center w-20 flex-shrink-0 relative z-10">
                                    <motion.div
                                        whileHover={{ scale: 1.2 }}
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25 border-4 border-white dark:border-gray-950"
                                    >
                                        {step.icon}
                                    </motion.div>
                                </div>

                                <div className="hidden md:flex md:w-[calc(50%-2.5rem)]">
                                    {!isLeft && (
                                        <div className="bg-white dark:bg-white/[0.02] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-lg transition-shadow duration-300 max-w-sm w-full">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {step.title}
                                                </h3>
                                                <CustomChip className="bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-500/20 text-xs">
                                                    {step.duration}
                                                </CustomChip>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="md:hidden bg-white dark:bg-white/[0.02] rounded-2xl p-5 border border-gray-100 dark:border-white/[0.06] shadow-sm flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                            {step.title}
                                        </h3>
                                        <CustomChip className="bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-500/20 text-[11px]">
                                            {step.duration}
                                        </CustomChip>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    </AnimatedSection>
);

const ChildrensPrivacySection = () => (
    <AnimatedSection id="childrens-privacy" className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
            <SectionHeader
                badge="Children's Privacy"
                badgeIcon={<HiUserGroup className="w-3.5 h-3.5" />}
                title="Protecting Young Users"
                description="We take the privacy and safety of children seriously. AuraSpace is designed for users aged 18 and above."
            />

            <motion.div
                variants={fadeUpVariants}
                custom={3}
                className="space-y-6"
            >
                <div className="relative bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/15 dark:to-orange-950/10 rounded-3xl p-8 md:p-10 border border-rose-100 dark:border-rose-500/10 overflow-hidden">
                    <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-rose-200/30 dark:bg-rose-600/5 blur-3xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                                <HiExclamationTriangle className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Age Requirement: 18+
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Strict enforcement across all services
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "No Intentional Collection",
                                    text: "AuraSpace does not knowingly collect personal information from anyone under the age of 18. Our registration process includes age verification steps.",
                                },
                                {
                                    title: "Immediate Data Deletion",
                                    text: "If we discover that we have inadvertently collected data from a child under 18, we will immediately delete all associated information from our systems.",
                                },
                                {
                                    title: "Parental Notification",
                                    text: "If a parent or guardian becomes aware that their child has provided us with personal data, they should contact us immediately at privacy@auraspace.com.",
                                },
                                {
                                    title: "COPPA Compliance",
                                    text: "We comply with the Children's Online Privacy Protection Act (COPPA) and similar international regulations designed to protect minors online.",
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeUpVariants}
                                    custom={i + 4}
                                >
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {item.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </AnimatedSection>
);

const ChangesSection = () => (
    <AnimatedSection
        id="changes"
        className="py-20 md:py-28 px-6 bg-gray-50/40 dark:bg-white/[0.01]"
    >
        <div className="max-w-4xl mx-auto">
            <SectionHeader
                badge="Updates"
                badgeIcon={<HiArrowPath className="w-3.5 h-3.5" />}
                title="Changes to This Policy"
                description="We may update this Privacy Policy periodically. Here's how we handle changes and keep you informed."
            />

            <motion.div variants={fadeUpVariants} custom={3}>
                <div className="relative bg-white dark:bg-white/[0.02] rounded-3xl p-8 md:p-10 border border-gray-100 dark:border-white/[0.06] shadow-sm overflow-hidden">
                    <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-br from-violet-100/50 to-indigo-100/50 dark:from-violet-600/5 dark:to-indigo-600/5 blur-3xl" />

                    <div className="relative z-10 space-y-8">
                        {[
                            {
                                icon: <HiBell className="w-5 h-5" />,
                                title: "Notification of Changes",
                                text: "We will notify you of material changes via email, in-app notification, or a prominent banner on our website at least 30 days before changes take effect.",
                            },
                            {
                                icon: (
                                    <HiDocumentMagnifyingGlass className="w-5 h-5" />
                                ),
                                title: "Review Period",
                                text: "You will have at least 30 days to review any significant changes before they become effective. We encourage you to review this policy periodically.",
                            },
                            {
                                icon: <HiClock className="w-5 h-5" />,
                                title: "Version History",
                                text: "We maintain a complete version history of this policy. Previous versions are available upon request by contacting our privacy team.",
                            },
                            {
                                icon: <HiCheckBadge className="w-5 h-5" />,
                                title: "Continued Use",
                                text: "Your continued use of AuraSpace after the effective date of changes constitutes acceptance of the updated policy. If you disagree, you may delete your account.",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUpVariants}
                                custom={i + 4}
                                className="flex gap-5"
                            >
                                <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                        {item.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    </AnimatedSection>
);

interface CustomAccordionItemProps {
    question: string;
    answer: string;
    index: number;
}

const CustomAccordionItem = ({
    question,
    answer,
    index,
}: CustomAccordionItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            variants={scaleInVariants}
            custom={index}
            className="bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
                <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 flex-shrink-0">
                        <HiQuestionMarkCircle className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white text-base">
                        {question}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-gray-400 dark:text-gray-500 flex-shrink-0 ml-4"
                >
                    <HiChevronDown className="w-5 h-5" />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="px-5 pb-5 pt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-white/[0.02]">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const FAQSection = () => (
    <AnimatedSection id="faq" className="py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto">
            <SectionHeader
                badge="FAQ"
                badgeIcon={<HiQuestionMarkCircle className="w-3.5 h-3.5" />}
                title="Frequently Asked Questions"
                description="Quick answers to the most common questions about your privacy and data protection at AuraSpace."
            />

            <div className="space-y-3">
                {faqItems.map((item, i) => (
                    <CustomAccordionItem
                        key={i}
                        question={item.question}
                        answer={item.answer}
                        index={i}
                    />
                ))}
            </div>
        </div>
    </AnimatedSection>
);

const ContactSection = () => (
    <AnimatedSection
        id="contact"
        className="py-20 md:py-28 px-6 bg-gray-50/40 dark:bg-white/[0.01]"
    >
        <div className="max-w-5xl mx-auto">
            <SectionHeader
                badge="Contact"
                badgeIcon={<HiPhone className="w-3.5 h-3.5" />}
                title="Contact Our Privacy Team"
                description="Questions about your data? Our dedicated privacy team typically responds within 24–48 hours."
            />

            <motion.div
                variants={staggerContainer}
                className="grid sm:grid-cols-3 gap-5 md:gap-6"
            >
                {contactOptions.map((item, i) => (
                    <motion.a
                        key={i}
                        href={item.link}
                        variants={scaleInVariants}
                        custom={i}
                        whileHover={{ y: -6, transition: { duration: 0.25 } }}
                        className="group bg-white dark:bg-white/[0.02] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm hover:shadow-xl hover:shadow-violet-500/[0.04] dark:hover:shadow-violet-500/[0.06] transition-all duration-400 text-center block"
                    >
                        <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg mx-auto mb-5 group-hover:scale-105 transition-all duration-300`}
                        >
                            {item.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
                            {item.description}
                        </p>
                        <span className="text-sm text-violet-600 dark:text-violet-400 font-semibold inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                            {item.action}{" "}
                            <HiArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </motion.a>
                ))}
            </motion.div>

            <motion.div
                variants={fadeUpVariants}
                custom={5}
                className="mt-10 max-w-2xl mx-auto"
            >
                <div className="bg-white dark:bg-white/[0.02] rounded-2xl p-6 border border-gray-100 dark:border-white/[0.06] shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                            <HiBuildingOffice2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Data Protection Officer
                            </h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                For formal privacy inquiries
                            </p>
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                Mailing Address
                            </p>
                            <p className="leading-relaxed">
                                AuraSpace Inc.
                                <br />
                                123 Innovation Drive, Suite 400
                                <br />
                                San Francisco, CA 94105
                            </p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                                Direct Contact
                            </p>
                            <p className="leading-relaxed">
                                Email: dpo@auraspace.com
                                <br />
                                Phone: +1 (415) 555-0199
                                <br />
                                Response Time: 24–48 hours
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    </AnimatedSection>
);

const TrustCTA = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section ref={ref} className="py-20 md:py-28 px-6">
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="max-w-4xl mx-auto"
            >
                <motion.div
                    variants={scaleInVariants}
                    className="relative rounded-3xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700" />
                    <div
                        className="absolute inset-0 opacity-50"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='g' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 0 10 L 40 10 M 10 0 L 10 40' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    <FloatingOrb
                        className="w-72 h-72 bg-white/[0.08] -top-24 -right-24"
                        delay={0}
                    />
                    <FloatingOrb
                        className="w-56 h-56 bg-white/[0.06] bottom-0 -left-16"
                        delay={3}
                    />
                    <FloatingOrb
                        className="w-40 h-40 bg-white/[0.05] top-1/2 left-1/2"
                        delay={5}
                    />

                    <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
                        <motion.div
                            variants={fadeUpVariants}
                            custom={0}
                            className="w-16 h-16 rounded-2xl bg-white/[0.12] backdrop-blur-md flex items-center justify-center mx-auto mb-7 border border-white/[0.15]"
                        >
                            <HiShieldCheck className="w-9 h-9 text-white" />
                        </motion.div>

                        <motion.h2
                            variants={fadeUpVariants}
                            custom={1}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight leading-[1.1]"
                        >
                            Your Trust Powers Everything We Build
                        </motion.h2>

                        <motion.p
                            variants={fadeUpVariants}
                            custom={2}
                            className="text-lg text-violet-100/90 max-w-xl mx-auto mb-10 leading-relaxed"
                        >
                            Privacy isn&apos;t a feature at AuraSpace —
                            it&apos;s the foundation. If you ever have questions
                            or concerns, our privacy team is just a message
                            away.
                        </motion.p>

                        <motion.div
                            variants={fadeUpVariants}
                            custom={3}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <CustomButton
                                size="lg"
                                variant="secondary"
                                className="bg-white hover:bg-gray-100 text-violet-700 font-semibold"
                                as="a"
                                href="mailto:privacy@auraspace.com"
                            >
                                <HiEnvelope className="w-4 h-4" /> Contact
                                Support
                            </CustomButton>
                            <CustomButton
                                size="lg"
                                variant="bordered"
                                className="border-white/25 text-white hover:bg-white/[0.08]"
                                as="a"
                                href="/terms"
                            >
                                <HiDocumentText className="w-4 h-4" /> Terms &
                                Conditions
                            </CustomButton>
                        </motion.div>

                        <motion.div
                            variants={fadeInVariants}
                            custom={5}
                            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/50"
                        >
                            {[
                                "GDPR Compliant",
                                "CCPA Compliant",
                                "SOC 2 Type II",
                                "ISO 27001",
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-1.5"
                                >
                                    <HiCheckBadge className="w-3.5 h-3.5 text-white/40" />
                                    {item}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

const SectionDivider = () => (
    <div className="max-w-6xl mx-auto px-6">
        <hr className="border-t border-gray-100 dark:border-white/[0.04]" />
    </div>
);

const tocItems = [
    { label: "Introduction", id: "introduction" },
    { label: "Data Collection", id: "information-collected" },
    { label: "Data Usage", id: "how-we-use" },
    { label: "Security", id: "data-security" },
    { label: "Cookies", id: "cookies" },
    { label: "Third-Party", id: "third-party" },
    { label: "Your Rights", id: "user-rights" },
    { label: "Retention", id: "data-retention" },
    { label: "Children", id: "childrens-privacy" },
    { label: "Updates", id: "changes" },
    { label: "FAQ", id: "faq" },
    { label: "Contact", id: "contact" },
];

const TableOfContents = () => {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.nav
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="py-10 md:py-14 px-6"
            aria-label="Table of Contents"
        >
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-white/[0.02] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-white/[0.06] shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                            <HiDocumentText className="w-4 h-4" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Table of Contents
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {tocItems.map((item, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{
                                    delay: 0.3 + i * 0.04,
                                    duration: 0.4,
                                }}
                                onClick={() =>
                                    document
                                        .getElementById(item.id)
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                                className="text-left text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/5 rounded-xl px-3 py-2.5 transition-all duration-200 font-medium"
                            >
                                <span className="text-xs text-gray-300 dark:text-gray-600 mr-1.5 font-mono">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                {item.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

const PrivacyPolicyPage = () => {
    return (
        <main className="bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">
            <HeroSection />
            <TableOfContents />
            <SectionDivider />
            <IntroductionSection />
            <InformationCollectedSection />
            <SectionDivider />
            <HowWeUseSection />
            <DataSecuritySection />
            <SectionDivider />
            <CookiesSection />
            <ThirdPartySection />
            <SectionDivider />
            <UserRightsSection />
            <DataRetentionSection />
            <SectionDivider />
            <ChildrensPrivacySection />
            <ChangesSection />
            <SectionDivider />
            <FAQSection />
            <ContactSection />
            <SectionDivider />
            <TrustCTA />
        </main>
    );
};

export default PrivacyPolicyPage;
