"use client";

import React, { useRef, useState, ReactNode } from "react";
import { motion, useInView, Variants, AnimatePresence } from "framer-motion";
import {
  HiShieldCheck,
  HiLockClosed,
  HiUser,
  HiCreditCard,
  HiCog6Tooth,
  HiCheckBadge,
  HiEye,
  HiHandRaised,
  HiEnvelope,
  HiArrowRight,
  HiDocumentText,
  HiGlobeAlt,
  HiNoSymbol,
  HiArrowPath,
  HiBookOpen,
  HiScale,
  HiExclamationTriangle,
  HiClock,
  HiChevronDown,
  HiQuestionMarkCircle,
  HiChatBubbleLeftRight,
  HiPhone,
  HiBuildingOffice2,
  HiInformationCircle,
  HiSparkles,
  HiServerStack,
  HiFingerPrint,
  HiClipboardDocumentCheck,
  HiHomeModern,
  HiBellAlert,
  HiReceiptPercent,
  HiFlag,
} from "react-icons/hi2";
import { FaShieldAlt, FaBalanceScale, FaGavel } from "react-icons/fa";

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
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
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface FloatingOrbProps {
  className: string;
  delay?: number;
}

const FloatingOrb = ({ className, delay = 0 }: FloatingOrbProps) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{
      y: [0, -25, 0],
      x: [0, 12, 0],
      scale: [1, 1.06, 1],
    }}
    transition={{
      duration: 12,
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

const AnimatedSection = ({ children, className = "", id }: AnimatedSectionProps) => {
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
    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider border transition-all duration-300 ${className}`}
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
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-white active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/35 hover:brightness-110 border border-transparent",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200",
    bordered:
      "bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-600 hover:border-gray-400",
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

const SectionHeader = ({ badge, badgeIcon, title, description }: SectionHeaderProps) => (
  <div className="text-center mb-12 md:mb-16">
    <motion.div variants={fadeUpVariants} custom={0} className="mb-4">
      <CustomChip
        icon={badgeIcon || <HiDocumentText className="w-3.5 h-3.5" />}
        className="bg-violet-50 text-violet-600 border-violet-200 uppercase"
      >
        {badge}
      </CustomChip>
    </motion.div>
    <motion.h2
      variants={fadeUpVariants}
      custom={1}
      className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-gray-900 mb-4 leading-[1.15] tracking-tight"
    >
      {title}
    </motion.h2>
    <motion.p
      variants={fadeUpVariants}
      custom={2}
      className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
    >
      {description}
    </motion.p>
  </div>
);

interface TermsCardProps {
  icon: ReactNode;
  title: string;
  content: string;
  index?: number;
  gradient?: string;
  bulletPoints?: string[];
}

const TermsCard = ({
  icon,
  title,
  content,
  index = 0,
  gradient = "from-violet-500 to-indigo-500",
  bulletPoints,
}: TermsCardProps) => (
  <motion.div
    variants={scaleInVariants}
    custom={index}
    whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
    className="group relative bg-white rounded-2xl p-6 md:p-7 border border-gray-100 hover:border-violet-200 shadow-sm hover:shadow-xl hover:shadow-violet-500/[0.08] transition-all duration-500 overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="relative z-10">
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg shadow-violet-500/15 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 leading-snug">{title}</h3>
        </div>
      </div>

      <div className="w-full h-px bg-gray-100 mb-4" />

      <p className="text-sm text-gray-500 leading-relaxed mb-3">{content}</p>

      {bulletPoints && bulletPoints.length > 0 && (
        <ul className="space-y-2 mt-3">
          {bulletPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
              <HiCheckBadge className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
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

const StatCard = ({ icon, title, description, stat, statLabel, index = 0 }: StatCardProps) => (
  <motion.div
    variants={scaleInVariants}
    custom={index}
    whileHover={{ y: -6, transition: { duration: 0.25 } }}
    className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 shadow-sm hover:shadow-xl hover:shadow-violet-500/[0.08] transition-all duration-500"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/15 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="text-right">
        <div className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          {stat}
        </div>
        <div className="text-xs text-gray-400 font-medium">{statLabel}</div>
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
  </motion.div>
);

interface AccordionItemProps {
  question: string;
  answer: string;
  index: number;
}

const AccordionItem = ({ question, answer, index }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      variants={scaleInVariants}
      custom={index}
      className="bg-white border border-gray-100 hover:border-violet-200 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none group"
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 flex-shrink-0 group-hover:bg-violet-100 transition-colors">
            <HiQuestionMarkCircle className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-900 text-base">{question}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-gray-400 flex-shrink-0 ml-4"
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
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 pb-5 pt-1 text-sm text-gray-500 leading-relaxed border-t border-gray-100">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SectionDivider = () => (
  <div className="max-w-6xl mx-auto px-6">
    <div className="h-px w-full bg-gray-200" />
  </div>
);

const termsData: TermsCardProps[] = [
  {
    icon: <HiClipboardDocumentCheck className="w-5 h-5" />,
    title: "Acceptance of Terms",
    content:
      "By accessing or using AuraSpace services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must immediately discontinue use of our platform.",
    gradient: "from-violet-500 to-indigo-500",
    bulletPoints: [
      "Terms apply to all users, guests, and property hosts",
      "Agreement is effective upon first use of the platform",
      "Continued use constitutes ongoing acceptance",
      "Users must be at least 18 years of age",
    ],
  },
  {
    icon: <HiCog6Tooth className="w-5 h-5" />,
    title: "Use of Services",
    content:
      "AuraSpace provides an online platform for booking accommodations, connecting guests with property hosts, and managing rental experiences. You agree to use our services only for their intended, lawful purposes.",
    gradient: "from-blue-500 to-cyan-500",
    bulletPoints: [
      "Platform is for legitimate accommodation bookings only",
      "Users must provide accurate, current information",
      "Service availability may vary by region",
      "We reserve the right to modify features at any time",
    ],
  },
  {
    icon: <HiUser className="w-5 h-5" />,
    title: "Account Responsibility",
    content:
      "You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify AuraSpace immediately of any unauthorized access or security breach.",
    gradient: "from-emerald-500 to-teal-500",
    bulletPoints: [
      "Keep your login credentials secure and confidential",
      "Do not share your account with others",
      "Report unauthorized access within 24 hours",
      "You are liable for all activity on your account",
    ],
  },
  {
    icon: <HiCreditCard className="w-5 h-5" />,
    title: "Payments & Subscriptions",
    content:
      "All payments are processed securely through our PCI DSS Level 1 certified payment partners. Prices are displayed in your local currency and include applicable taxes unless otherwise stated. Cancellation and refund policies vary by listing.",
    gradient: "from-amber-500 to-orange-500",
    bulletPoints: [
      "Payments are processed securely via Stripe",
      "Service fees are non-refundable unless stated otherwise",
      "Cancellation policies are set by individual hosts",
      "Currency conversion rates may apply for international bookings",
    ],
  },
  {
    icon: <HiLockClosed className="w-5 h-5" />,
    title: "Privacy & Data Protection",
    content:
      "Your privacy is paramount. We collect, process, and store personal data in accordance with our Privacy Policy, GDPR, CCPA, and applicable data protection laws. We employ enterprise-grade encryption and security measures to protect your information.",
    gradient: "from-violet-500 to-purple-500",
    bulletPoints: [
      "Data handling governed by our comprehensive Privacy Policy",
      "AES-256 encryption for all data at rest",
      "TLS 1.3 encryption for all data in transit",
      "You can request data deletion at any time",
    ],
  },
  {
    icon: <HiSparkles className="w-5 h-5" />,
    title: "Intellectual Property",
    content:
      "All content, trademarks, logos, design elements, software, and proprietary technology on AuraSpace are owned by or licensed to AuraSpace Inc. No content may be reproduced, distributed, or modified without explicit written permission.",
    gradient: "from-pink-500 to-rose-500",
    bulletPoints: [
      "All platform content is copyright protected",
      "AuraSpace logo and brand assets are registered trademarks",
      "User-generated content remains property of the creator",
      "License granted for personal, non-commercial use only",
    ],
  },
  {
    icon: <HiNoSymbol className="w-5 h-5" />,
    title: "Prohibited Activities",
    content:
      "Users are strictly prohibited from engaging in any activity that violates laws, infringes on rights of others, or disrupts the platform. AuraSpace reserves the right to terminate accounts that violate these provisions without prior notice.",
    gradient: "from-red-500 to-rose-600",
    bulletPoints: [
      "No fraudulent bookings or fake listings",
      "No harassment, discrimination, or hate speech",
      "No unauthorized scraping, bots, or automated access",
      "No attempts to circumvent security or payment systems",
    ],
  },
  {
    icon: <HiArrowPath className="w-5 h-5" />,
    title: "Changes & Termination",
    content:
      "AuraSpace reserves the right to modify these Terms at any time. Material changes will be communicated at least 30 days in advance via email and platform notifications. You may terminate your account at any time through your account settings.",
    gradient: "from-indigo-500 to-violet-500",
    bulletPoints: [
      "30 days advance notice for material changes",
      "Continued use after changes constitutes acceptance",
      "Account termination available at any time",
      "Data deletion completed within 30 days of termination",
    ],
  },
];

const additionalTerms: TermsCardProps[] = [
  {
    icon: <FaBalanceScale className="w-5 h-5" />,
    title: "Limitation of Liability",
    content:
      "To the maximum extent permitted by applicable law, AuraSpace and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform or inability to access our services.",
    gradient: "from-slate-500 to-zinc-500",
    bulletPoints: [
      "Maximum liability limited to fees paid in the last 12 months",
      "No liability for third-party actions or content",
      "Force majeure events exclude liability",
      "Users assume risk for property condition and accuracy",
    ],
  },
  {
    icon: <HiScale className="w-5 h-5" />,
    title: "Dispute Resolution",
    content:
      "Any disputes arising from these Terms shall first be attempted to be resolved through good-faith negotiation, followed by mediation. If unresolved, disputes will be subject to binding arbitration under the rules of the American Arbitration Association.",
    gradient: "from-cyan-500 to-blue-500",
    bulletPoints: [
      "30-day negotiation period before escalation",
      "Mediation conducted by certified neutral mediator",
      "Arbitration governed by AAA Commercial Rules",
      "Class action waiver applies to all disputes",
    ],
  },
  {
    icon: <HiGlobeAlt className="w-5 h-5" />,
    title: "Governing Law",
    content:
      "These Terms and Conditions shall be governed by and construed in accordance with the laws of the State of California, United States of America, without regard to its conflict of law principles.",
    gradient: "from-teal-500 to-emerald-500",
    bulletPoints: [
      "California state law governs these terms",
      "Federal courts in San Francisco have jurisdiction",
      "International users subject to local consumer protections",
      "Conflict of laws provisions are excluded",
    ],
  },
  {
    icon: <HiExclamationTriangle className="w-5 h-5" />,
    title: "Disclaimers & Warranties",
    content:
      "AuraSpace is provided on an 'as is' and 'as available' basis without warranties of any kind, either express or implied. We do not guarantee that the platform will be uninterrupted, error-free, or free from harmful components.",
    gradient: "from-orange-500 to-amber-500",
    bulletPoints: [
      "No warranty of merchantability or fitness",
      "No guarantee of uninterrupted service",
      "Third-party integrations are not warranted",
      "Users responsible for their own backup practices",
    ],
  },
];

const hostTerms: TermsCardProps[] = [
  {
    icon: <HiHomeModern className="w-5 h-5" />,
    title: "Host Responsibilities",
    content:
      "Property hosts are responsible for ensuring their listings are accurate, up-to-date, and comply with all local laws, regulations, and safety standards. Hosts must maintain appropriate insurance and obtain necessary permits.",
    gradient: "from-violet-500 to-indigo-500",
    bulletPoints: [
      "Accurate listing descriptions and photos required",
      "Compliance with local zoning and rental laws",
      "Adequate insurance coverage must be maintained",
      "Timely response to guest inquiries and issues",
    ],
  },
  {
    icon: <HiReceiptPercent className="w-5 h-5" />,
    title: "Service Fees & Commissions",
    content:
      "AuraSpace charges service fees to both guests and hosts for each completed booking. Host commission rates are disclosed during the listing creation process and may vary based on listing type, location, and promotional programs.",
    gradient: "from-emerald-500 to-teal-500",
    bulletPoints: [
      "Guest service fee: 6-12% of booking subtotal",
      "Host commission: 3% of booking subtotal",
      "Fees displayed before booking confirmation",
      "Special rates may apply for long-term bookings",
    ],
  },
  {
    icon: <HiBellAlert className="w-5 h-5" />,
    title: "Cancellation Policies",
    content:
      "Hosts set their own cancellation policies from three tiers: Flexible (full refund up to 24 hours before check-in), Moderate (full refund up to 5 days before), and Strict (50% refund up to 7 days before). All policies are displayed before booking.",
    gradient: "from-amber-500 to-orange-500",
    bulletPoints: [
      "Flexible: Full refund up to 24 hours before check-in",
      "Moderate: Full refund up to 5 days before check-in",
      "Strict: 50% refund up to 7 days before check-in",
      "Extenuating circumstances policy applies to all tiers",
    ],
  },
  {
    icon: <HiFlag className="w-5 h-5" />,
    title: "Content & Review Guidelines",
    content:
      "All user-generated content including reviews, photos, and listing descriptions must be truthful, relevant, and compliant with our community guidelines. AuraSpace reserves the right to remove content that violates these standards.",
    gradient: "from-rose-500 to-pink-500",
    bulletPoints: [
      "Reviews must be based on actual experiences",
      "No defamatory, discriminatory, or misleading content",
      "Photos must accurately represent the property",
      "Violations may result in content removal or account action",
    ],
  },
];

const protectionItems: StatCardProps[] = [
  {
    icon: <HiLockClosed className="w-6 h-6" />,
    title: "Data Encryption",
    description:
      "All personal and financial data is encrypted using industry-standard AES-256 encryption at rest and TLS 1.3 in transit.",
    stat: "256-bit",
    statLabel: "AES Encryption",
  },
  {
    icon: <HiShieldCheck className="w-6 h-6" />,
    title: "Compliance Standards",
    description:
      "We maintain compliance with GDPR, CCPA, SOC 2 Type II, and PCI DSS Level 1 security standards.",
    stat: "SOC 2",
    statLabel: "Type II Certified",
  },
  {
    icon: <HiServerStack className="w-6 h-6" />,
    title: "Platform Uptime",
    description:
      "Our infrastructure is designed for high availability with redundant systems across multiple geographic regions.",
    stat: "99.99%",
    statLabel: "Uptime SLA",
  },
  {
    icon: <HiFingerPrint className="w-6 h-6" />,
    title: "Authentication",
    description:
      "Multi-factor authentication, biometric login support, and hardware security key compatibility protect your account.",
    stat: "2FA/MFA",
    statLabel: "Supported",
  },
  {
    icon: <HiEye className="w-6 h-6" />,
    title: "Threat Monitoring",
    description:
      "Real-time AI-powered threat detection and automated response systems protect against unauthorized access.",
    stat: "24/7",
    statLabel: "Monitoring",
  },
  {
    icon: <FaShieldAlt className="w-5 h-5" />,
    title: "Payment Security",
    description:
      "All payment processing is handled by PCI DSS Level 1 certified partners with tokenized card storage.",
    stat: "PCI DSS",
    statLabel: "Level 1",
  },
];

const faqItems = [
  {
    question: "When do these Terms & Conditions take effect?",
    answer:
      "These Terms & Conditions are effective immediately upon your first use of the AuraSpace platform. By creating an account, making a booking, or browsing our listings, you acknowledge and agree to be bound by these terms. The current version was last updated on January 15, 2025.",
  },
  {
    question: "Can AuraSpace change these terms without notice?",
    answer:
      "We commit to providing at least 30 days advance notice for any material changes to these Terms & Conditions. Notifications are sent via email to your registered address and displayed as a prominent banner on the platform. Minor administrative changes may be made without advance notice.",
  },
  {
    question: "What happens if I violate these terms?",
    answer:
      "Violations may result in a range of actions depending on severity, including: temporary account suspension, permanent account termination, forfeiture of pending payouts (for hosts), removal of content, and legal action in cases of fraud or criminal activity. We investigate all reported violations before taking action.",
  },
  {
    question: "How are disputes between guests and hosts resolved?",
    answer:
      "AuraSpace provides a structured Resolution Center for guest-host disputes. The process begins with direct communication, followed by mediation from our support team. If unresolved, our Trust & Safety team makes a binding decision. For disputes with AuraSpace directly, we follow arbitration procedures outlined in our dispute resolution clause.",
  },
  {
    question: "Are these terms enforceable internationally?",
    answer:
      "While these Terms are governed by California law, we comply with applicable local consumer protection laws in every jurisdiction where we operate. For EU users, nothing in these terms overrides mandatory consumer rights under EU law. Users in other regions are similarly protected by their local mandatory regulations.",
  },
  {
    question: "Can I terminate my account and what happens to my data?",
    answer:
      "You can terminate your account at any time through Account Settings → Delete Account, or by contacting our support team. Upon termination, your personal data is permanently deleted within 30 days from active systems and 90 days from backups. Certain transaction records may be retained for 7 years for legal and tax compliance.",
  },
  {
    question: "What are my rights regarding intellectual property?",
    answer:
      "You retain ownership of all content you create and upload to AuraSpace (photos, reviews, listing descriptions). By posting content, you grant AuraSpace a non-exclusive, worldwide license to display and distribute that content within the platform. You may revoke this license by deleting your content or account.",
  },
  {
    question: "How does AuraSpace handle liability for property issues?",
    answer:
      "AuraSpace acts as a platform connecting guests and hosts, not as a property owner or manager. Hosts are responsible for property condition and accuracy of listings. We provide Host Protection Insurance up to $1M for eligible claims and our Guest Refund Policy covers situations where listings are materially different from their descriptions.",
  },
];

const contactOptions = [
  {
    icon: <HiEnvelope className="w-6 h-6" />,
    title: "Legal Email",
    description:
      "For questions about these Terms & Conditions, legal notices, or formal inquiries.",
    action: "legal@auraspace.com",
    link: "mailto:legal@auraspace.com",
    gradient: "from-violet-500 to-indigo-500",
  },
  {
    icon: <HiChatBubbleLeftRight className="w-6 h-6" />,
    title: "Support Center",
    description: "Visit our help documentation for general platform questions and guides.",
    action: "Visit Help Center",
    link: "/help",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <HiExclamationTriangle className="w-6 h-6" />,
    title: "Report a Violation",
    description:
      "Report terms violations, fraud, or safety concerns to our Trust & Safety team.",
    action: "Submit Report",
    link: "/report",
    gradient: "from-amber-500 to-orange-500",
  },
];

const tocItems = [
  { label: "Introduction", id: "introduction" },
  { label: "Core Terms", id: "core-terms" },
  { label: "Legal Protections", id: "legal-protections" },
  { label: "Host Terms", id: "host-terms" },
  { label: "Security", id: "security" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
];

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gray-50"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/30 to-gray-50" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(139,92,246,0.08),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(99,102,241,0.06),transparent_28%),radial-gradient(circle_at_50%_55%,rgba(168,85,247,0.04),transparent_38%)]" />

      <div className="absolute inset-0 opacity-[0.4] [background-image:linear-gradient(to_right,rgba(139,92,246,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)] [-webkit-mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <FloatingOrb className="w-[520px] h-[520px] bg-violet-200/30 -top-28 -left-28" delay={0} />
      <FloatingOrb className="w-[420px] h-[420px] bg-indigo-200/20 top-1/4 -right-24" delay={2.5} />
      <FloatingOrb className="w-[320px] h-[320px] bg-purple-200/20 bottom-16 left-1/3" delay={5} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 inline-flex"
        >
          <div className="relative p-1 rounded-3xl bg-gradient-to-b from-violet-200/60 to-transparent">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/25 relative overflow-hidden">
              <FaGavel className="w-9 h-9 md:w-11 md:h-11 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex justify-center"
        >
          <span className="text-[11px] font-semibold text-violet-600 tracking-[0.2em] uppercase bg-violet-50 px-3.5 py-1.5 rounded-full border border-violet-200 inline-flex items-center gap-2">
            <HiClock className="w-3.5 h-3.5" />
            Last Updated — January 15, 2025
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]"
        >
          Terms &{" "}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Conditions
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Please review our terms carefully. By using AuraSpace, you agree to these terms which
          govern your use of our platform, services, and interactions with our community.
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
              document.getElementById("introduction")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Read Terms <HiArrowRight className="w-4 h-4" />
          </CustomButton>

          <CustomButton
            size="lg"
            variant="bordered"
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Contact Legal Team
          </CustomButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <div className="inline-flex bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-500 uppercase tracking-widest font-medium">
              {[
                { icon: <HiDocumentText className="w-3.5 h-3.5" />, text: "Version 3.2" },
                { icon: <FaGavel className="w-3 h-3" />, text: "Legally Binding" },
                { icon: <HiGlobeAlt className="w-3.5 h-3.5" />, text: "Global Coverage" },
                { icon: <HiShieldCheck className="w-3.5 h-3.5" />, text: "GDPR Compliant" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.55 + i * 0.06, duration: 0.4 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="text-violet-500">{item.icon}</span>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent" />
    </section>
  );
};

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
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
              <HiDocumentText className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Table of Contents</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {tocItems.map((item, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.4 }}
                onClick={() =>
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-left text-sm text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-xl px-3 py-2.5 transition-all duration-200 font-medium"
              >
                <span className="text-xs text-gray-400 mr-1.5 font-mono">
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

const IntroductionSection = () => (
  <AnimatedSection id="introduction" className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
    <SectionHeader
      badge="Introduction"
      badgeIcon={<HiBookOpen className="w-3.5 h-3.5" />}
      title="Understanding Our Terms"
      description="These Terms & Conditions constitute a legally binding agreement between you and AuraSpace Inc. governing your use of our platform and services."
    />

    <motion.div variants={fadeUpVariants} custom={3} className="relative max-w-4xl mx-auto">
      <div className="relative bg-gradient-to-br from-violet-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-violet-100 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-100/50 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="relative z-10 grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <HiDocumentText className="w-7 h-7" />,
              title: "Clear Language",
              text: "We write our terms in plain, understandable language so you know exactly what you're agreeing to — no hidden clauses or legal jargon.",
            },
            {
              icon: <FaBalanceScale className="w-6 h-6" />,
              title: "Fair & Balanced",
              text: "Our terms are designed to protect both you and AuraSpace equally, ensuring a fair and trustworthy marketplace for all users.",
            },
            {
              icon: <HiHandRaised className="w-7 h-7" />,
              title: "Your Rights First",
              text: "We respect your consumer rights under all applicable laws. Nothing in these terms overrides your mandatory legal protections.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariants}
              custom={i + 4}
              className="text-center md:text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-violet-100 flex items-center justify-center text-violet-600 mb-4 mx-auto md:mx-0 shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>

    <motion.div variants={fadeUpVariants} custom={8} className="max-w-4xl mx-auto mt-8">
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-200">
        <HiInformationCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-700 font-medium mb-1">Important Notice</p>
          <p className="text-sm text-amber-600 leading-relaxed">
            By using AuraSpace services — including browsing listings, creating an account, making
            bookings, or listing properties — you agree to be bound by these Terms & Conditions
            and our Privacy Policy. Please read both documents carefully before using our platform.
          </p>
        </div>
      </div>
    </motion.div>
  </AnimatedSection>
);

const CoreTermsSection = () => (
  <AnimatedSection id="core-terms" className="py-20 md:py-28 px-6">
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        badge="Core Terms"
        badgeIcon={<HiClipboardDocumentCheck className="w-3.5 h-3.5" />}
        title="Core Terms & Conditions"
        description="The fundamental terms that govern your use of the AuraSpace platform, from account creation to payment processing."
      />

      <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-5 md:gap-6">
        {termsData.map((item, i) => (
          <TermsCard key={i} {...item} index={i} />
        ))}
      </motion.div>
    </div>
  </AnimatedSection>
);

const LegalProtectionsSection = () => (
  <AnimatedSection id="legal-protections" className="py-20 md:py-28 px-6">
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        badge="Legal"
        badgeIcon={<FaGavel className="w-3 h-3" />}
        title="Legal Protections & Disclaimers"
        description="Important legal provisions regarding liability limitations, dispute resolution, governing law, and warranties."
      />

      <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-5 md:gap-6">
        {additionalTerms.map((item, i) => (
          <TermsCard key={i} {...item} index={i} />
        ))}
      </motion.div>
    </div>
  </AnimatedSection>
);

const HostTermsSection = () => (
  <AnimatedSection id="host-terms" className="py-20 md:py-28 px-6">
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        badge="Host Terms"
        badgeIcon={<HiHomeModern className="w-3.5 h-3.5" />}
        title="Terms for Property Hosts"
        description="Additional terms specifically applicable to users who list properties on the AuraSpace platform."
      />

      <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-5 md:gap-6">
        {hostTerms.map((item, i) => (
          <TermsCard key={i} {...item} index={i} />
        ))}
      </motion.div>
    </div>
  </AnimatedSection>
);

const SecuritySection = () => (
  <AnimatedSection id="security" className="py-20 md:py-28 px-6">
    <div className="max-w-6xl mx-auto">
      <SectionHeader
        badge="Security"
        badgeIcon={<HiLockClosed className="w-3.5 h-3.5" />}
        title="Security & Compliance"
        description="Enterprise-grade security measures and compliance standards that protect your data and transactions on AuraSpace."
      />

      <motion.div
        variants={staggerContainer}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
      >
        {protectionItems.map((item, i) => (
          <StatCard key={i} {...item} index={i} />
        ))}
      </motion.div>
    </div>
  </AnimatedSection>
);

const FAQSection = () => (
  <AnimatedSection id="faq" className="py-20 md:py-28 px-6">
    <div className="max-w-3xl mx-auto">
      <SectionHeader
        badge="FAQ"
        badgeIcon={<HiQuestionMarkCircle className="w-3.5 h-3.5" />}
        title="Frequently Asked Questions"
        description="Common questions about our Terms & Conditions and how they affect your use of AuraSpace."
      />

      <div className="space-y-3">
        {faqItems.map((item, i) => (
          <AccordionItem key={i} question={item.question} answer={item.answer} index={i} />
        ))}
      </div>
    </div>
  </AnimatedSection>
);

const ContactSection = () => (
  <AnimatedSection id="contact" className="py-20 md:py-28 px-6">
    <div className="max-w-5xl mx-auto">
      <SectionHeader
        badge="Contact"
        badgeIcon={<HiPhone className="w-3.5 h-3.5" />}
        title="Contact Our Legal Team"
        description="Questions about these terms? Our legal team typically responds within 24–48 business hours."
      />

      <motion.div variants={staggerContainer} className="grid sm:grid-cols-3 gap-5 md:gap-6">
        {contactOptions.map((item, i) => (
          <motion.a
            key={i}
            href={item.link}
            variants={scaleInVariants}
            custom={i}
            whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
            className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 shadow-sm hover:shadow-xl hover:shadow-violet-500/[0.08] transition-all duration-500 text-center block"
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
            >
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">{item.description}</p>
            <span className="text-sm text-violet-600 font-semibold inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
              {item.action} <HiArrowRight className="w-3.5 h-3.5" />
            </span>
          </motion.a>
        ))}
      </motion.div>

      <motion.div variants={fadeUpVariants} custom={5} className="mt-10 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
              <HiBuildingOffice2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Legal Department</h3>
              <p className="text-xs text-gray-400">For formal legal inquiries and notices</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <p className="font-medium text-gray-700 mb-0.5">Mailing Address</p>
              <p className="leading-relaxed">
                AuraSpace Inc.
                <br />
                123 Innovation Drive, Suite 400
                <br />
                San Francisco, CA 94105
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-0.5">Direct Contact</p>
              <p className="leading-relaxed">
                Email: legal@auraspace.com
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
        <motion.div variants={scaleInVariants} className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700" />

          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />

          <FloatingOrb className="w-72 h-72 bg-white/[0.08] -top-24 -right-24" delay={0} />
          <FloatingOrb className="w-56 h-56 bg-white/[0.06] bottom-0 -left-16" delay={3} />

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
            <motion.div
              variants={fadeUpVariants}
              custom={0}
              className="w-16 h-16 rounded-2xl bg-white/[0.15] backdrop-blur-md flex items-center justify-center mx-auto mb-7 border border-white/[0.2]"
            >
              <FaGavel className="w-8 h-8 text-white" />
            </motion.div>

            <motion.h2
              variants={fadeUpVariants}
              custom={1}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight leading-[1.1]"
            >
              Built on Trust & Transparency
            </motion.h2>

            <motion.p
              variants={fadeUpVariants}
              custom={2}
              className="text-lg text-violet-100/90 max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Our terms are designed to create a safe, fair, and transparent marketplace. If you
              have any questions, our legal team is always available to help.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              custom={3}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <CustomButton
                size="lg"
                variant="secondary"
                className="bg-white hover:bg-gray-100 text-violet-700 font-semibold border-transparent"
                as="a"
                href="mailto:legal@auraspace.com"
              >
                <HiEnvelope className="w-4 h-4" /> Contact Legal Team
              </CustomButton>
              <CustomButton
                size="lg"
                variant="bordered"
                className="border-white/25 text-white hover:bg-white/[0.12]"
                as="a"
                href="/privacy"
              >
                <HiLockClosed className="w-4 h-4" /> Privacy Policy
              </CustomButton>
            </motion.div>

            <motion.div
              variants={fadeInVariants}
              custom={5}
              className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60"
            >
              {["Legally Binding", "Globally Applicable", "Regularly Updated", "Fair Terms"].map(
                (item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <HiCheckBadge className="w-3.5 h-3.5 text-white/50" />
                    {item}
                  </div>
                )
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

const TermsPage = () => {
  return (
    <main className="bg-gray-50 min-h-screen text-gray-900">
      <HeroSection />
      <TableOfContents />
      <SectionDivider />
      <IntroductionSection />
      <SectionDivider />
      <CoreTermsSection />
      <SectionDivider />
      <LegalProtectionsSection />
      <SectionDivider />
      <HostTermsSection />
      <SectionDivider />
      <SecuritySection />
      <SectionDivider />
      <FAQSection />
      <SectionDivider />
      <ContactSection />
      <SectionDivider />
      <TrustCTA />
    </main>
  );
};

export default TermsPage;