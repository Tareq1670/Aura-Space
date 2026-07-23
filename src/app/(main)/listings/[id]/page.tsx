"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@heroui/react";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ModalPortal from "@/lib/modal-portal";
import { getPropertyDetail } from "@/lib/actions/property-public";
import type { PublicProperty, PublicReview } from "@/lib/actions/property-public";
import { startConversation } from "@/lib/actions/message";
import { authClient } from "@/lib/auth-client";
import { reviewAPI, type PendingBooking } from "@/lib/api/Guest/review-api";
import { createReview } from "@/lib/actions/review";
import RatingStars from "@/Components/Review/RatingStars";
import { PenLine, Sparkles, X } from "lucide-react";



function AmenityIcon({ amenity }: { amenity: string }) {
    const iconMap: Record<string, string> = {
        wifi: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0",
        pool: "M20.25 6.75v7.5a2.25 2.25 0 01-2.25 2.25h-3.75a2.25 2.25 0 01-2.25-2.25v-7.5m0 0V3.375c0-.621-.504-1.125-1.125-1.125H7.5c-.621 0-1.125.504-1.125 1.125V7.5m9.75 0a2.25 2.25 0 00-2.25 2.25v.75m-6-3a2.25 2.25 0 00-2.25 2.25v.75M21 21H3",
        air_conditioning: "M9 7.5h6m-6 3h6m-6 3h6M5.25 3h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25A2.25 2.25 0 015.25 3z",
        parking: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
        gym: "M15.75 5.25v13.5m-7.5-13.5v13.5m10.5-6h-13.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        kitchen: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42",
        washer: "M17.25 6.75v13.5m-10.5-13.5v13.5M5.25 3h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25A2.25 2.25 0 015.25 3z",
        "pet-friendly": "M9 15v3m-3-3h6m-6 0a3 3 0 01-3-3V9a3 3 0 013-3m0 0h6a3 3 0 013 3v6m-9-9h6",
    };

    const path = iconMap[amenity.toLowerCase()] || "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z";

    return (
        <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={path} />
        </svg>
    );
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

function DetailSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
                <div className="mt-6 space-y-4">
                    <Skeleton className="h-8 w-3/4 rounded-lg" />
                    <Skeleton className="h-5 w-1/2 rounded-lg" />
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-24 rounded-2xl" />
                        ))}
                    </div>
                    <Skeleton className="h-32 w-full rounded-2xl" />
                    <Skeleton className="h-48 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [property, setProperty] = useState<PublicProperty | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [messaging, setMessaging] = useState(false);
    const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [bookingError, setBookingError] = useState<string | null>(null);

    const today = new Date().toISOString().split("T")[0];

    function getMinCheckOut() {
        if (!checkIn) return today;
        const next = new Date(checkIn);
        next.setDate(next.getDate() + 1);
        return next.toISOString().split("T")[0];
    }

    function validateAndGetBookingUrl(): string | null {
        if (!property) {
            setBookingError("Property not found");
            return null;
        }
        if (!checkIn || !checkOut || !guests) {
            setBookingError("Please select dates and number of guests");
            return null;
        }
        if (checkOut <= checkIn) {
            setBookingError("Check-out must be after check-in");
            return null;
        }
        if (guests < 1) {
            setBookingError("At least 1 guest required");
            return null;
        }
        if (property.details && guests > (property.details.maxGuests || 99)) {
            setBookingError(`Maximum ${property.details.maxGuests} guests allowed`);
            return null;
        }
        setBookingError(null);
        return `/checkout?propertyId=${property.id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;
    }

    useEffect(() => {
        if (!id) return;
        async function fetchData() {
            setLoading(true);
            const res = await getPropertyDetail(id);
            if (res.success && res.data) {
                setProperty(res.data as PublicProperty);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
            setLoading(false);
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!property) return;
        let mounted = true;
        (async () => {
            try {
                const session = await authClient.getSession();
                if (!session?.data?.user || !mounted) return;
                setReviewLoading(true);
                const res = await reviewAPI.getMyReviews({ limit: 50 });
                if (!mounted) return;
                const match = res.pending.find((b) => b.propertyId === property.id);
                if (match) setPendingBooking(match);
            } catch {
                // not logged in — no review prompt
            } finally {
                if (mounted) setReviewLoading(false);
            }
        })();
        return () => { mounted = false };
    }, [property]);

    const openLightbox = useCallback((index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    }, []);

    const handleMessageHost = useCallback(async () => {
        const h = property?.host;
        if (!h || messaging) return;
        setMessaging(true);
        try {
            const res = await startConversation(h._id, undefined, property?.id);
            if (res.success) {
                toast.success("Conversation started");
                router.push("/dashboard/guest/messages");
            } else {
                toast.error((res as any).message || res.error || "Failed to start conversation");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setMessaging(false);
        }
    }, [messaging, property, router]);

    const handleSubmitReview = useCallback(async () => {
        if (!reviewRating || !reviewComment.trim() || !pendingBooking) {
            toast.error("Please provide a rating and comment");
            return;
        }
        setSubmittingReview(true);
        try {
            const res = await createReview({
                bookingId: pendingBooking._id,
                rating: reviewRating,
                comment: reviewComment,
            });
            if (res.success) {
                toast.success("Review submitted");
                setShowReviewModal(false);
                setReviewRating(0);
                setReviewComment("");
                setPendingBooking(null);
            } else {
                toast.error((res as any).message || res.error || "Failed to submit review");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSubmittingReview(false);
        }
    }, [reviewRating, reviewComment, pendingBooking]);

    if (loading) return <DetailSkeleton />;

    if (notFound || !property) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                        <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-slate-900">Property Not Found</h1>
                    <p className="mt-2 text-sm text-slate-500">The property you are looking for does not exist or has been removed.</p>
                    <Link
                        href="/listings"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Browse Properties
                    </Link>
            </div>
        </div>
    );
}

    const images = property.images?.length ? property.images : ["/placeholder-property.svg"];
    const host = property.host;
    const reviews = property.reviews || [];
    const related = property.relatedProperties || [];
    const price = property.price;
    const details = property.details;

    const ratingBreakdown = {
        5: reviews.filter((r) => r.rating >= 4.5).length,
        4: reviews.filter((r) => r.rating >= 3.5 && r.rating < 4.5).length,
        3: reviews.filter((r) => r.rating >= 2.5 && r.rating < 3.5).length,
        2: reviews.filter((r) => r.rating >= 1.5 && r.rating < 2.5).length,
        1: reviews.filter((r) => r.rating < 1.5).length,
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                        <Swiper
                            spaceBetween={0}
                            slidesPerView={1}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[Thumbs, Navigation]}
                            navigation
                            className="aspect-[16/9] w-full sm:aspect-[21/9]"
                        >
                            {images.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <button onClick={() => openLightbox(i)} className="h-full w-full cursor-pointer" aria-label="View image">
                                        <img
                                            src={img}
                                            alt={`${property.title} - Image ${i + 1}`}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/placeholder-property.svg";
                                            }}
                                        />
                                    </button>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {images.length > 1 && (
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={8}
                                slidesPerView={4}
                                watchSlidesProgress
                                modules={[Thumbs]}
                                className="mt-2 px-2 pb-2"
                            >
                                {images.map((img, i) => (
                                    <SwiperSlide key={i} className="cursor-pointer opacity-60 transition-opacity duration-200 hover:opacity-100 [&.swiper-slide-thumb-active]:opacity-100">
                                        <div className="aspect-[4/3] overflow-hidden rounded-lg border-2 border-transparent transition-colors duration-200 [&.swiper-slide-thumb-active]:border-indigo-500">
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${i + 1}`}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/placeholder-property.svg";
                                                }}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                                            {property.category}
                                        </div>
                                        <h1 className="text-2xl font-black text-slate-950 sm:text-3xl lg:text-4xl">
                                            {property.title}
                                        </h1>
                                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                            <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>
                                            <span>
                                                {property.location?.address ? `${property.location.address}, ` : ""}
                                                {property.location?.city}{property.location?.city && property.location?.country ? ", " : ""}{property.location?.country}
                                            </span>
                                        </div>
                                        <div className="mt-3 flex items-center gap-1.5">
                                            <RatingStars rating={property.rating} showValue readonly size="sm" />
                                            <span className="text-sm text-slate-400">({property.reviewCount} reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                {details && (
                                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center">
                                            <svg className="mx-auto h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                            <p className="mt-2 text-lg font-bold text-slate-900">{details.maxGuests}</p>
                                            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Guests</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center">
                                            <svg className="mx-auto h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                                            </svg>
                                            <p className="mt-2 text-lg font-bold text-slate-900">{details.bedrooms}</p>
                                            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Bedrooms</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center">
                                            <svg className="mx-auto h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                            <p className="mt-2 text-lg font-bold text-slate-900">{details.bathrooms}</p>
                                            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Bathrooms</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center">
                                            <svg className="mx-auto h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="mt-2 text-lg font-bold text-slate-900">${price?.perNight}</p>
                                            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Per Night</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {property.description && (
                                <div className="rounded-2xl border border-slate-100 bg-white p-6">
                                    <h2 className="text-lg font-extrabold text-slate-900">About This Space</h2>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                                        {property.description}
                                    </p>
                                </div>
                            )}

                            {property.amenities?.length > 0 && (
                                <div className="rounded-2xl border border-slate-100 bg-white p-6">
                                    <h2 className="text-lg font-extrabold text-slate-900">Amenities</h2>
                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                        {property.amenities.map((amenity) => (
                                            <div key={amenity} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                                <AmenityIcon amenity={amenity} />
                                                <span className="text-sm font-medium capitalize text-slate-700">
                                                    {amenity.replace(/_/g, " ")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {property.houseRules && (
                                <div className="rounded-2xl border border-slate-100 bg-white p-6">
                                    <h2 className="text-lg font-extrabold text-slate-900">House Rules</h2>
                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${property.houseRules.smokingAllowed ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"}`}>
                                                {property.houseRules.smokingAllowed ? (
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">
                                                {property.houseRules.smokingAllowed ? "Smoking Allowed" : "No Smoking"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${property.houseRules.petsAllowed ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"}`}>
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15v3m-3-3h6m-6 0a3 3 0 01-3-3V9a3 3 0 013-3m0 0h6a3 3 0 013 3v6m-9-9h6" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">
                                                {property.houseRules.petsAllowed ? "Pets Allowed" : "No Pets"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${property.houseRules.partiesAllowed ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"}`}>
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A2.701 2.701 0 003 15.546M21 12v3.546M3 12v3.546" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">
                                                {property.houseRules.partiesAllowed ? "Parties Allowed" : "No Parties"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                            <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm font-medium text-slate-700">
                                                Check-in: {property.houseRules.checkInTime} · Check-out: {property.houseRules.checkOutTime}
                                            </span>
                                        </div>
                                    </div>
                                    {property.houseRules.additionalRules && property.houseRules.additionalRules.length > 0 && (
                                        <ul className="mt-3 space-y-1.5">
                                            {property.houseRules.additionalRules.map((rule, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                    <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-slate-300" />
                                                    {rule}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            {reviews.length > 0 && (
                                <div className="rounded-2xl border border-slate-100 bg-white p-6">
                                    <h2 className="text-lg font-extrabold text-slate-900">
                                        Reviews ({reviews.length})
                                    </h2>
                                    <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                                        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 p-6 sm:w-48">
                                            <span className="text-4xl font-black text-slate-900">{property.rating.toFixed(1)}</span>
                                        <div className="mt-2">
                                            <RatingStars rating={property.rating} readonly size="sm" />
                                        </div>
                                            <span className="mt-1 text-xs text-slate-400">{reviews.length} reviews</span>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = ratingBreakdown[star as keyof typeof ratingBreakdown];
                                                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-3">
                                                        <span className="w-8 text-right text-xs font-medium text-slate-500">{star}</span>
                                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="w-8 text-xs text-slate-400">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-6">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                                                        {review.guestImage ? (
                                                            <img src={review.guestImage} alt={review.guestName} className="h-full w-full object-cover" />
                                                        ) : (
                                                            review.guestName?.charAt(0)?.toUpperCase() || "G"
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{review.guestName}</p>
                                                        <div className="flex items-center gap-2">
                                                            <RatingStars rating={review.rating} readonly size="sm" />
                                                            <span className="text-[11px] text-slate-400">{formatDate(review.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{review.comment}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {pendingBooking && (
                                <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-extrabold text-slate-900">Share Your Experience</h2>
                                            <p className="mt-1 text-sm text-slate-500">Tell others about your stay at {property.title}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setReviewRating(0);
                                                setReviewComment("");
                                                setShowReviewModal(true);
                                            }}
                                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl hover:shadow-amber-500/30"
                                        >
                                            <PenLine className="h-4 w-4" />
                                            Write a Review
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/50">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-slate-900">${price?.perNight}</span>
                                        <span className="text-sm text-slate-400">/ night</span>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Check-in</label>
                                            <input
                                                type="date"
                                                value={checkIn}
                                                min={today}
                                                onChange={(e) => {
                                                    setCheckIn(e.target.value);
                                                    setBookingError(null);
                                                    if (checkOut && e.target.value >= checkOut) setCheckOut("");
                                                }}
                                                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Check-out</label>
                                            <input
                                                type="date"
                                                value={checkOut}
                                                min={getMinCheckOut()}
                                                onChange={(e) => {
                                                    setCheckOut(e.target.value);
                                                    setBookingError(null);
                                                }}
                                                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Guests</label>
                                            <input
                                                type="number"
                                                value={guests}
                                                min={1}
                                                max={details?.maxGuests || 99}
                                                onChange={(e) => {
                                                    setGuests(Math.max(1, Number(e.target.value) || 1));
                                                    setBookingError(null);
                                                }}
                                                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                            />
                                        </div>
                                    </div>

                                    <hr className="my-4 border-slate-100" />

                                    <div className="space-y-2 text-sm">
                                        {price && (price.weeklyDiscount ?? 0) > 0 && (
                                            <div className="flex items-center justify-between text-green-600">
                                                <span>Weekly discount (7+ nights)</span>
                                                <span className="font-medium">{price.weeklyDiscount ?? 0}%</span>
                                            </div>
                                        )}
                                        {price && (price.monthlyDiscount ?? 0) > 0 && (
                                            <div className="flex items-center justify-between text-green-600">
                                                <span>Monthly discount (28+ nights)</span>
                                                <span className="font-medium">{price.monthlyDiscount ?? 0}%</span>
                                            </div>
                                        )}
                                        {price && (price.cleaningFee ?? 0) > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Cleaning fee</span>
                                                <span className="font-medium text-slate-700">${price.cleaningFee ?? 0}</span>
                                            </div>
                                        )}
                                        {price && (price.serviceFee ?? 0) > 0 && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500">Service fee</span>
                                                <span className="font-medium text-slate-700">${price.serviceFee ?? 0}</span>
                                            </div>
                                        )}
                                    </div>

                                    {bookingError && (
                                        <p className="mt-3 text-xs font-medium text-red-500">{bookingError}</p>
                                    )}

                                    <button
                                        onClick={async () => {
                                            const url = validateAndGetBookingUrl();
                                            if (!url) return;
                                            try {
                                                const session = await authClient.getSession();
                                                if (!session?.data?.user) {
                                                    router.push(`/login?redirect=${encodeURIComponent(url)}`);
                                                    return;
                                                }
                                                router.push(url);
                                            } catch {
                                                router.push(`/login?redirect=${encodeURIComponent(url)}`);
                                            }
                                        }}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                        Book Now
                                    </button>
                                </div>

                                {host && (
                                    <div className="rounded-2xl border border-slate-100 bg-white p-6">
                                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Hosted by</h3>
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                                                {host.image ? (
                                                    <img src={host.image} alt={host.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    host.name?.charAt(0)?.toUpperCase() || "H"
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{host.name}</p>
                                                <p className="text-xs text-slate-400">Member since {formatDate(host.createdAt)}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleMessageHost}
                                            disabled={messaging}
                                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                            </svg>
                                            {messaging ? "Starting..." : "Message Host"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {related.length > 0 && (
                        <div className="mt-12 border-t border-slate-100 pt-12">
                            <h2 className="text-xl font-extrabold text-slate-900">Similar Properties</h2>
                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {related.slice(0, 4).map((prop) => (
                                    <Link key={prop.id} href={`/listings/${prop.id}`} className="group block">
                                        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-200">
                                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                                <img
                                                    src={prop.images?.[0] || "/placeholder-property.svg"}
                                                    alt={prop.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/placeholder-property.svg";
                                                    }}
                                                />
                                                <div className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur-sm">
                                                    {prop.category}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-sm font-bold leading-snug text-slate-900 line-clamp-1">{prop.title}</h3>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {prop.location?.city}{prop.location?.city && prop.location?.country ? ", " : ""}{prop.location?.country}
                                                </p>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <span className="text-sm font-bold text-slate-900">
                                                        ${prop.price?.perNight} <span className="text-xs font-normal text-slate-400">/ night</span>
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <RatingStars rating={5} readonly size="sm" />
                                                        <span className="text-xs font-semibold text-slate-600">{prop.rating.toFixed(1)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            <ModalPortal>
              <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((i) => (i > 0 ? i - 1 : images.length - 1));
                            }}
                            className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <motion.img
                            key={lightboxIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            src={images[lightboxIndex]}
                            alt={`${property.title} - Image ${lightboxIndex + 1}`}
                            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
                            onClick={(e) => e.stopPropagation()}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder-property.svg";
                            }}
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((i) => (i < images.length - 1 ? i + 1 : 0));
                            }}
                            className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                            style={{ right: "4rem" }}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
                            {lightboxIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            </ModalPortal>

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                    <div>
                        <span className="text-lg font-black text-slate-900">${price?.perNight}</span>
                        <span className="text-xs text-slate-400"> / night</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {host && (
                            <button
                                onClick={handleMessageHost}
                                disabled={messaging}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                </svg>
                            </button>
                        )}
                        <button
                            onClick={async () => {
                                const url = validateAndGetBookingUrl();
                                if (!url) return;
                                try {
                                    const session = await authClient.getSession();
                                    if (!session?.data?.user) {
                                        router.push(`/login?redirect=${encodeURIComponent(url)}`);
                                        return;
                                    }
                                    router.push(url);
                                } catch {
                                    router.push(`/login?redirect=${encodeURIComponent(url)}`);
                                }
                            }}
                            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            <ModalPortal>
              <AnimatePresence>
                {showReviewModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowReviewModal(false)}
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 24 }}
                            transition={{ type: "spring", stiffness: 300, damping: 26 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
                        >
                            <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 shrink-0">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="h-5 w-5 text-white/80" />
                                        <h3 className="text-lg font-semibold text-white">Write a Review</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowReviewModal(false)}
                                        className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                                {pendingBooking && property && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="relative mt-2 text-sm text-white/70"
                                    >
                                        Reviewing:{" "}
                                        <span className="font-medium text-white">
                                            {property.title}
                                        </span>
                                    </motion.p>
                                )}
                            </div>

                            <div className="px-6 py-5">
                                <div className="mb-5">
                                    <label className="mb-2.5 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Rating
                                    </label>
                                    <div className="inline-block rounded-xl bg-gray-50 px-4 py-3">
                                        <RatingStars
                                            rating={reviewRating}
                                            onRate={setReviewRating}
                                            size="lg"
                                            animated
                                        />
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label className="mb-2.5 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Comment
                                    </label>
                                    <textarea
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        rows={4}
                                        placeholder="Share your experience..."
                                        className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3.5 text-sm text-gray-700 outline-none placeholder-gray-300 transition-all hover:border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowReviewModal(false)}
                                        className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmitReview}
                                        disabled={submittingReview || !reviewRating || !reviewComment.trim()}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/15 transition-all hover:shadow-xl disabled:opacity-40"
                                    >
                                        {submittingReview && (
                                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                        )}
                                        Submit Review
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            </ModalPortal>
        </div>
    );
}
