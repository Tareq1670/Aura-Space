import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type HeadingTag = "h1" | "h2" | "h3";

interface SectionHeadingProps {
    eyebrow?: string;
    title: string;
    highlight?: string;
    subtitle?: string;
    align?: "center" | "left";
    as?: HeadingTag;
    action?: ReactNode;
    className?: string;
}

export default function SectionHeading({
    eyebrow,
    title,
    highlight,
    subtitle,
    align = "center",
    as: Tag = "h2",
    action,
    className,
}: SectionHeadingProps) {
    const centered = align === "center";

    return (
        <div
            className={cn(
                centered ? "mx-auto max-w-2xl text-center" : "text-left",
                action ? "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" : "",
                className,
            )}
        >
            <div className={cn(centered ? "mx-auto max-w-2xl text-center" : "")}>
                {eyebrow && (
                    <span
                        className={cn(
                            "mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-1.5",
                        )}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                            {eyebrow}
                        </span>
                    </span>
                )}

                <Tag className="text-3xl font-black leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl md:text-[44px]">
                    {title}
                    {highlight && (
                        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            {highlight}
                        </span>
                    )}
                </Tag>

                {subtitle && (
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-[15px]">
                        {subtitle}
                    </p>
                )}
            </div>

            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}