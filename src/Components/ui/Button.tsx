import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    isLoading?: boolean;
    loadingText?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const BUTTON_BASE =
    "inline-flex items-center justify-center select-none whitespace-nowrap font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50";

const VARIANT_CLASSES: Record<Variant, string> = {
    primary:
        "bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white shadow-sm shadow-indigo-600/25 hover:shadow-md hover:shadow-indigo-600/35 hover:brightness-110 active:brightness-95",
    secondary:
        "border border-slate-300 bg-white text-slate-700 shadow-sm hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-600 active:bg-indigo-100/60",
    danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800",
};

const SIZE_CLASSES: Record<Size, string> = {
    sm: "h-8 gap-1.5 rounded-lg px-3 text-xs",
    md: "h-10 gap-2 rounded-xl px-4 text-sm",
    lg: "h-12 gap-2 rounded-xl px-5 text-base",
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
            className={cn(buttonClasses({ variant, size }), className)}
        >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {!isLoading && leftIcon}
            <span>{isLoading && loadingText ? loadingText : children}</span>
            {!isLoading && rightIcon}
        </button>
    );
});

export default Button;