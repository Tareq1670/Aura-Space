import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type Variant = "primary" | "secondary" | "outline" | "ghost" | "success" | "danger";
export type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    isLoading?: boolean;
    loadingText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

const BUTTON_BASE =
    "inline-flex items-center justify-center rounded-xl font-semibold select-none whitespace-nowrap transition-all duration-200 disabled:pointer-events-none disabled:opacity-50";

const VARIANT_CLASSES: Record<Variant, string> = {
    primary:
        "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_100%] bg-left text-white shadow-sm shadow-indigo-600/25 hover:bg-right hover:shadow-md hover:shadow-indigo-600/30 hover:brightness-110 active:brightness-95",
    secondary:
        "border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-600 active:bg-indigo-100/60",
    outline:
        "border-2 border-indigo-600 bg-transparent text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100",
    ghost: "border border-transparent bg-transparent text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-600 active:bg-indigo-100/60",
    success: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800",
    danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800",
};

const SIZE_CLASSES: Record<Size, string> = {
    sm: "h-9 touch-44 gap-1.5 px-3 text-sm",
    md: "h-11 gap-2 px-4 text-sm",
    lg: "h-12 gap-2 px-6 text-base",
};

export function buttonClasses(
    opts: { variant?: Variant; size?: Size; className?: string } = {},
): string {
    return cn(
        BUTTON_BASE,
        VARIANT_CLASSES[opts.variant ?? "primary"],
        SIZE_CLASSES[opts.size ?? "md"],
        opts.className,
    );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
        variant = "primary",
        size = "md",
        isLoading = false,
        loadingText,
        leftIcon,
        rightIcon,
        fullWidth = false,
        className,
        children,
        disabled,
        type = "button",
        ...props
    },
    ref,
) {
    return (
        <button
            {...props}
            ref={ref}
            type={type}
            disabled={disabled || isLoading}
            aria-busy={isLoading ? true : undefined}
            className={cn(buttonClasses({ variant, size }), fullWidth && "w-full", className)}
        >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {!isLoading && leftIcon}
            <span>{isLoading && loadingText ? loadingText : children}</span>
            {!isLoading && rightIcon}
        </button>
    );
});

export default Button;