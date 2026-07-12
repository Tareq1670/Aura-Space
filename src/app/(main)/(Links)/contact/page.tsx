"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineGlobe,
  HiOutlineChatAlt2,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineLightBulb,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlinePaperAirplane,
} from "react-icons/hi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";

interface ContactMethod {
  title: string;
  value: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  accent: string;
}

interface OfficeInfo {
  title: string;
  text: string;
  icon: React.ReactNode;
}

interface InquiryOption {
  value: string;
  label: string;
  description: string;
}

interface SupportChannel {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: React.ReactNode;
}

interface FaqItem {
  q: string;
  a: string;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: string;
  subject: string;
  message: string;
  consent: boolean;
}

type SubmitStatus = "idle" | "sending" | "success" | "error";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      type: "tween",
    },
  },
};

const contactMethods: ContactMethod[] = [
  {
    title: "Email Support",
    value: "hello@auraspace.com",
    subtitle: "Replies within 24 hours",
    href: "mailto:hello@auraspace.com",
    accent: "from-indigo-500 to-violet-600",
    icon: <HiOutlineMail className="h-6 w-6" />,
  },
  {
    title: "Call Our Team",
    value: "+880 1700 000 000",
    subtitle: "Sat – Thu, 9 AM – 9 PM",
    href: "tel:+8801700000000",
    accent: "from-violet-500 to-fuchsia-600",
    icon: <HiOutlinePhone className="h-6 w-6" />,
  },
  {
    title: "Visit Head Office",
    value: "Gulshan, Dhaka",
    subtitle: "Gulshan Avenue, Dhaka 1212",
    href: "#location",
    accent: "from-fuchsia-500 to-pink-600",
    icon: <HiOutlineLocationMarker className="h-6 w-6" />,
  },
];

const inquiryOptions: InquiryOption[] = [
  {
    value: "general",
    label: "General Inquiry",
    description: "Ask us anything about AuraSpace",
  },
  {
    value: "booking",
    label: "Booking Support",
    description: "Help with an existing booking",
  },
  {
    value: "hosting",
    label: "Become a Host",
    description: "List your property or venue",
  },
  {
    value: "event",
    label: "Event Venue",
    description: "Book venues for celebrations",
  },
  {
    value: "partnership",
    label: "Partnership",
    description: "Business collaboration opportunities",
  },
  {
    value: "feedback",
    label: "Feedback",
    description: "Share your experience with us",
  },
];

const officeInfo: OfficeInfo[] = [
  {
    title: "Head Office",
    text: "Gulshan Avenue, Gulshan-2, Dhaka 1212, Bangladesh",
    icon: <HiOutlineOfficeBuilding className="h-4 w-4" />,
  },
  {
    title: "Business Hours",
    text: "Saturday – Thursday, 9:00 AM – 9:00 PM (BST)",
    icon: <HiOutlineClock className="h-4 w-4" />,
  },
  {
    title: "Global Support",
    text: "Serving all cities across Bangladesh, online 24/7",
    icon: <HiOutlineGlobe className="h-4 w-4" />,
  },
];

const supportChannels: SupportChannel[] = [
  {
    title: "Guest Support",
    description:
      "Booking issues, cancellations, refunds, and general stay support for travelers.",
    cta: "Contact Support",
    href: "#form",
    icon: <HiOutlineUserGroup className="h-5 w-5" />,
  },
  {
    title: "Host Success",
    description:
      "Guidance for listing your property, managing bookings, and growing revenue.",
    cta: "Host Assistance",
    href: "/dashboard/properties/add",
    icon: <HiOutlineSparkles className="h-5 w-5" />,
  },
  {
    title: "Event Planning",
    description:
      "Curated venue booking with decoration, catering, and floral add-ons.",
    cta: "Plan an Event",
    href: "/listings?type=event",
    icon: <HiOutlineLightBulb className="h-5 w-5" />,
  },
];

const faqs: FaqItem[] = [
  {
    q: "How quickly do you respond?",
    a: "Our team responds within 24 hours on business days. For urgent booking issues, please call our support line directly.",
  },
  {
    q: "Can I customize an event booking?",
    a: "Yes. During checkout you can add decoration, catering, floral setups, and photography as premium add-on services.",
  },
  {
    q: "How can I list my property?",
    a: "Click 'Become a Host' to submit your property details. Our team reviews and approves listings within 2–3 business days.",
  },
  {
    q: "Do you support corporate bookings?",
    a: "Absolutely. We have dedicated venues, meeting rooms, and full-service coordination for corporate events of any scale.",
  },
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", Icon: FaFacebookF },
  { name: "Instagram", href: "https://instagram.com", Icon: FaInstagram },
  { name: "Twitter", href: "https://twitter.com", Icon: FaTwitter },
  { name: "LinkedIn", href: "https://linkedin.com", Icon: FaLinkedinIn },
  { name: "GitHub", href: "https://github.com", Icon: FaGithub },
];

function InputField({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500"
      >
        {label} {required && <span className="text-indigo-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition-all duration-300 placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}

const ContactPage = () => {
  const reduceMotion = !!useReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const supportRef = useRef<HTMLElement>(null);
  const officeRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  const isFormInView = useInView(formRef, { once: true, margin: "-80px" });
  const isSupportInView = useInView(supportRef, {
    once: true,
    margin: "-80px",
  });
  const isOfficeInView = useInView(officeRef, { once: true, margin: "-80px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const [formData, setFormData] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "general",
    subject: "",
    message: "",
    consent: false,
  });

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (status !== "idle") setStatus("idle");
  };

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return "First name is required.";
    if (!formData.lastName.trim()) return "Last name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      return "Please enter a valid email address.";
    if (!formData.subject.trim()) return "Subject is required.";
    if (formData.message.trim().length < 10)
      return "Message must be at least 10 characters.";
    if (!formData.consent)
      return "Please accept the communication consent to continue.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validateForm();

    if (error) {
      setErrorMessage(error);
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    setTimeout(() => {
      setStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        inquiryType: "general",
        subject: "",
        message: "",
        consent: false,
      });
    }, 1200);
  };

  const selectedInquiry = inquiryOptions.find(
    (o) => o.value === formData.inquiryType
  );

  return (
    <main className="w-full bg-white">
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 py-20 sm:py-24 lg:py-28"
      >
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <div className="absolute -left-24 top-10 h-[400px] w-[400px] rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-[400px] w-[400px] rounded-full bg-violet-500/15 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/5 blur-3xl" />
        </motion.div>

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-[34px] font-black leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl md:text-[56px] lg:text-6xl"
            >
              Let&apos;s Start a{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                Conversation
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-6 max-w-2xl text-base leading-[1.8] text-white/60 sm:text-lg"
            >
              Whether you&apos;re booking a premium stay, listing your venue,
              or planning an unforgettable event — our team is ready to help
              you every step of the way.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                </div>
                <span className="text-xs font-semibold text-white/70">
                  Response within 24 hours
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-sm">
                <HiOutlineChatAlt2 className="h-4 w-4 text-indigo-300" />
                <span className="text-xs font-semibold text-white/70">
                  Multi-language support
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-sm">
                <HiOutlineGlobe className="h-4 w-4 text-indigo-300" />
                <span className="text-xs font-semibold text-white/70">
                  Dhaka, Bangladesh
                </span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5"
          >
            {contactMethods.map((method) => (
              <motion.a
                key={method.title}
                href={method.href}
                variants={itemVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -6,
                        transition: {
                          type: "spring",
                          stiffness: 280,
                          damping: 22,
                        },
                      }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.06] p-6 text-left backdrop-blur-md transition-all duration-300 hover:border-indigo-400/40 hover:bg-white/[0.10]"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${method.accent} text-white shadow-lg shadow-indigo-500/25`}
                >
                  {method.icon}
                </div>

                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">
                  {method.title}
                </div>

                <div className="mt-2 text-base font-black text-white sm:text-lg">
                  {method.value}
                </div>

                <div className="mt-1 text-xs text-white/50">
                  {method.subtitle}
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40 transition-all duration-300 group-hover:text-indigo-300">
                  Reach out
                  <HiOutlineArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={formRef}
        id="form"
        className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="absolute inset-0">
          <div className="absolute -left-24 top-10 h-[300px] w-[300px] rounded-full bg-indigo-50/80 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-[300px] w-[300px] rounded-full bg-violet-50/80 blur-3xl" />
        </div>

        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_420px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={
                isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
              }
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
                type: "tween",
              }}
              className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-50/60 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-violet-50/60 blur-3xl" />

              <div className="relative">
                <h2 className="text-2xl font-black leading-[1.15] tracking-[-0.02em] text-slate-950 sm:text-3xl md:text-[32px]">
                  We&apos;d love to hear from you
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-[15px]">
                  Fill out the form and our team will get back to you within
                  24 hours. All fields marked with * are required.
                </p>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-8 space-y-5"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                      label="First Name"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                      autoComplete="given-name"
                    />
                    <InputField
                      label="Last Name"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                      autoComplete="family-name"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                      label="Email Address"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      autoComplete="email"
                    />
                    <InputField
                      label="Phone Number"
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1XXX-XXXXXX"
                      autoComplete="tel"
                    />
                  </div>

                  <InputField
                    label="Company / Organization"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="AuraSpace Ltd. (optional)"
                    autoComplete="organization"
                  />

                  <div>
                    <label
                      htmlFor="inquiryType"
                      className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500"
                    >
                      Inquiry Type <span className="text-indigo-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="h-[52px] w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-11 text-sm font-semibold text-slate-900 outline-none transition-all duration-300 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      >
                        {inquiryOptions.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <svg
                          className="h-4 w-4 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {selectedInquiry && (
                      <p className="mt-2 text-xs text-slate-400">
                        {selectedInquiry.description}
                      </p>
                    )}
                  </div>

                  <InputField
                    label="Subject"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief subject of your inquiry"
                    required
                  />

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500"
                    >
                      Message <span className="text-indigo-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 outline-none transition-all duration-300 placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-slate-400">
                        Minimum 10 characters
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {formData.message.length} chars
                      </p>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/40">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className="text-[13px] leading-relaxed text-slate-600">
                      I agree to receive booking and support-related emails
                      from AuraSpace and understand I can unsubscribe anytime.
                    </span>
                  </label>

                  {status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, type: "tween" }}
                      className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <HiOutlineCheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-emerald-800">
                          Message sent successfully!
                        </p>
                        <p className="mt-0.5 text-xs text-emerald-700">
                          Our team will reach out within 24 hours.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {status === "error" && errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, type: "tween" }}
                      className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                        <HiOutlineExclamationCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-rose-800">
                          Please check your form
                        </p>
                        <p className="mt-0.5 text-xs text-rose-700">
                          {errorMessage}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={status === "sending"}
                    whileHover={
                      reduceMotion || status === "sending"
                        ? undefined
                        : {
                            scale: 1.01,
                            boxShadow: "0 14px 36px rgba(99,102,241,0.30)",
                          }
                    }
                    whileTap={
                      reduceMotion || status === "sending"
                        ? undefined
                        : { scale: 0.98 }
                    }
                    className="flex h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white shadow-[0_10px_28px_rgba(99,102,241,0.25)] transition-all duration-300 hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "sending" ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <HiOutlinePaperAirplane className="h-4 w-4 rotate-90" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={
                isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
              }
              transition={{
                duration: 0.75,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
                type: "tween",
              }}
              className="flex flex-col gap-6"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.15)] sm:p-7">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
                <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute -left-16 bottom-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />

                <div className="relative z-10">
                  <h3 className="text-xl font-black leading-tight tracking-[-0.02em] text-white sm:text-2xl">
                    Reach us at our{" "}
                    <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                      Dhaka office
                    </span>
                  </h3>

                  <div className="mt-6 space-y-3">
                    {officeInfo.map((info) => (
                      <div
                        key={info.title}
                        className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/30 hover:bg-white/[0.10]"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/20">
                          {info.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-300">
                            {info.title}
                          </div>
                          <div className="mt-1 text-[13px] leading-relaxed text-white/80">
                            {info.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-300">
                      Follow Us
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {socialLinks.map((social) => {
                        const Icon = social.Icon;
                        return (
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
                            whileTap={
                              reduceMotion ? undefined : { scale: 0.95 }
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70 transition-all duration-300 hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white"
                          >
                            <Icon className="h-4 w-4" />
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-7">
                <h3 className="text-lg font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-xl">
                  Looking for something specific?
                </h3>

                <div className="mt-5 space-y-2.5">
                  {[
                    { label: "Browse Listings", href: "/listings" },
                    {
                      label: "Become a Host",
                      href: "/dashboard/properties/add",
                    },
                    { label: "How It Works", href: "/how-it-works" },
                    { label: "Read our FAQs", href: "/faq" },
                    { label: "About AuraSpace", href: "/about" },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/50"
                    >
                      <span className="text-sm font-semibold text-slate-700 transition-colors duration-300 group-hover:text-indigo-700">
                        {link.label}
                      </span>
                      <HiOutlineArrowRight className="h-3.5 w-3.5 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-600" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        ref={supportRef}
        className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/40 to-white py-16 sm:py-20 lg:py-24"
      >
        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isSupportInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
            >
              Dedicated Help For{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                Every Journey
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
            >
              Whether you&apos;re a guest, host, or event organizer — we have a
              dedicated team ready to help you succeed.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isSupportInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3"
          >
            {supportChannels.map((channel) => (
              <motion.div
                key={channel.title}
                variants={itemVariants}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                        y: -6,
                        transition: {
                          type: "spring",
                          stiffness: 280,
                          damping: 22,
                        },
                      }
                }
                className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all duration-500 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)] sm:p-7"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
                  {channel.icon}
                </div>

                <h3 className="mt-5 text-lg font-black leading-tight tracking-[-0.02em] text-slate-950 sm:text-xl">
                  {channel.title}
                </h3>

                <p className="mt-3 flex-1 text-[13px] leading-[1.75] text-slate-500">
                  {channel.description}
                </p>

                <Link
                  href={channel.href}
                  className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-600 transition-all duration-300 hover:gap-3"
                >
                  {channel.cta}
                  <HiOutlineArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={officeRef}
        id="location"
        className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      >
        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isOfficeInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto mb-10 max-w-2xl text-center sm:mb-12"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
            >
              Find Our{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                Head Office
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
            >
              Located in the heart of Gulshan, Dhaka. Come say hello or send
              us a message anytime.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={
              isOfficeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
            }
            transition={{
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
              type: "tween",
            }}
            className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
          >
            <div className="grid gap-0 lg:grid-cols-[380px_minmax(0,1fr)]">
              <div className="flex flex-col justify-between border-b border-slate-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 text-white sm:p-8 lg:border-b-0 lg:border-r">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 backdrop-blur-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                      Open Now
                    </span>
                  </div>

                  <h3 className="mt-5 text-2xl font-black leading-tight tracking-[-0.02em] text-white">
                    AuraSpace HQ
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    Our head office and support hub, serving guests and hosts
                    across Bangladesh.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-indigo-300">
                        <HiOutlineLocationMarker className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-300">
                          Address
                        </div>
                        <div className="mt-1 text-[13px] leading-relaxed text-white/80">
                          Gulshan Avenue, Gulshan-2
                          <br />
                          Dhaka 1212, Bangladesh
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-indigo-300">
                        <HiOutlinePhone className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-300">
                          Phone
                        </div>
                        <a
                          href="tel:+8801700000000"
                          className="mt-1 block text-[13px] text-white/80 transition-colors hover:text-white"
                        >
                          +880 1700 000 000
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-indigo-300">
                        <HiOutlineMail className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-300">
                          Email
                        </div>
                        <a
                          href="mailto:hello@auraspace.com"
                          className="mt-1 block text-[13px] text-white/80 transition-colors hover:text-white"
                        >
                          hello@auraspace.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.a
                  href="https://maps.google.com/?q=Gulshan+Dhaka+Bangladesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-950 shadow-lg transition-all duration-300 hover:bg-indigo-50"
                >
                  Open in Google Maps
                  <HiOutlineArrowRight className="h-3.5 w-3.5" />
                </motion.a>
              </div>

              <div className="aspect-[16/12] w-full overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[500px]">
                <iframe
                  title="AuraSpace Head Office - Dhaka, Bangladesh"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9773843856854!2d90.41251971498154!3d23.79373968457436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c700a44dbf6f%3A0x84f1b5d1d1b1c0b1!2sGulshan%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1719000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "100%" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        ref={faqRef}
        className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/40 to-white py-16 sm:py-20 lg:py-24"
      >
        <div className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={isFaqInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto mb-10 max-w-2xl text-center sm:mb-12"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[42px]"
            >
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                Questions
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-[15px]"
            >
              Quick answers to common contact and support questions.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isFaqInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                  <span className="text-xs font-black">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h4 className="text-base font-black leading-snug tracking-[-0.02em] text-slate-950 sm:text-[17px]">
                  {faq.q}
                </h4>

                <p className="mt-3 text-[13px] leading-[1.75] text-slate-500 sm:text-sm">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.65,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
              type: "tween",
            }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-900 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700"
            >
              View All FAQs
              <HiOutlineArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="#form"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.15em] text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:from-indigo-700 hover:to-violet-700"
            >
              Contact Support
              <HiOutlineArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;