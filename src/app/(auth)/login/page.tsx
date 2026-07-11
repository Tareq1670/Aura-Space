"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Form,
    Button,
    TextField,
    Label,
    Input,
    FieldError,
} from "@heroui/react";
import { authClient } from "@/lib/auth-client";

interface GlobalMessage {
    type: "success" | "error";
    text: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [globalMessage, setGlobalMessage] = useState<GlobalMessage | null>(
        null,
    );

    const handleDemoLogin = (role: "guest" | "host"): void => {
        setGlobalMessage(null);
        if (role === "guest") {
            setEmail("demo.guest@stayease.com");
            setPassword("Guest@1234");
        } else {
            setEmail("demo.host@stayease.com");
            setPassword("Host@1234");
        }
    };

    const validateForm = (): string | null => {
        if (!email.trim()) return "Email address is required!";
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.trim()))
            return "Please enter a valid email address.";
        if (!password) return "Password is required!";
        if (password.length < 8)
            return "Password must be at least 8 characters.";
        return null;
    };

    const onSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        setGlobalMessage(null);

        const validationError = validateForm();
        if (validationError) {
            setGlobalMessage({ type: "error", text: validationError });
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await authClient.signIn.email({
                email: email.trim(),
                password: password,
                rememberMe: rememberMe,
            });

            if (error) {
                setGlobalMessage({
                    type: "error",
                    text: error.message ?? "Invalid email or password.",
                });
                return;
            }

            setGlobalMessage({
                type: "success",
                text: "Login successful! Redirecting...",
            });

            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 1000);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.";
            setGlobalMessage({ type: "error", text: message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 text-slate-900 min-h-screen flex items-center justify-center p-4 md:p-8 font-sans">
            <div className="w-full max-w-5xl rounded-[2rem] shadow-xl shadow-indigo-950/5 overflow-hidden grid md:grid-cols-12 min-h-[650px] border border-slate-200/80 bg-white/90 backdrop-blur-sm">
                <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute -top-20 -right-20 w-56 h-56 bg-indigo-400/20 rounded-full blur-3xl"></div>

                    <div className="z-10">
                        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                             AuraSpace
                        </h1>
                        <p className="text-indigo-200 mt-1 text-xs uppercase tracking-widest font-medium">
                            Next-Gen Rental Platform
                        </p>
                    </div>

                    <div className="z-10 my-auto space-y-6">
                        <h2 className="text-4xl font-black leading-tight tracking-tight">
                            Welcome <br />
                            <span className="text-emerald-400">Back</span> Home.
                        </h2>
                        <p className="text-indigo-100 text-sm leading-relaxed max-w-sm font-light">
                            Sign in to manage your bookings, explore premium
                            stays and continue your journey with AuraSpace.
                        </p>
                    </div>

                    <div className="z-10 text-xs text-indigo-300 font-medium">
                        © 2026 AuraSpace Inc. Secure Gateways Enabled.
                    </div>
                </div>

                <div className="col-span-12 md:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
                    <div className="w-full max-w-md mx-auto">
                        <div className="mb-7">
                            <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                                Sign in to your account
                            </h3>
                            <p className="text-sm mt-1.5 text-slate-500">
                                New to AuraSpace?{" "}
                                <a
                                    href="/register"
                                    className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition"
                                >
                                    Create an account
                                </a>
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 active:scale-[0.98]"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        fill="#EA4335"
                                        d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.103C18.22 1.45 15.48.5 12.24.5c-6.35 0-11.5 5.15-11.5 11.5s5.15 11.5 11.5 11.5c6.63 0 11.04-4.654 11.04-11.23 0-.754-.081-1.332-.181-1.985H12.24z"
                                    />
                                </svg>
                                Google
                            </button>

                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 active:scale-[0.98]"
                            >
                                <svg
                                    className="w-4 h-4 fill-[#1877F2]"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>

                        <div className="relative flex items-center justify-center my-5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <span className="relative px-3 text-[11px] uppercase tracking-wider font-semibold bg-white text-slate-400">
                                Or sign in with email
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-5">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin("guest")}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 active:scale-[0.98]"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                Demo Guest
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDemoLogin("host")}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 active:scale-[0.98]"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"
                                    />
                                </svg>
                                Demo Host
                            </button>
                        </div>

                        {globalMessage && (
                            <div
                                className={`p-3.5 mb-5 rounded-xl text-sm font-medium border transition-all ${
                                    globalMessage.type === "success"
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                                        : "bg-rose-500/10 border-rose-500/20 text-rose-600"
                                }`}
                            >
                                {globalMessage.text}
                            </div>
                        )}

                        <Form
                            className="flex flex-col gap-4"
                            render={(props) => <form {...props} noValidate />}
                            onSubmit={onSubmit}
                        >
                            <TextField
                                isRequired
                                name="email"
                                className="w-full"
                                value={email}
                                onChange={setEmail}
                                validate={(value: string) => {
                                    if (!value || !value.trim()) {
                                        return "Email address is required.";
                                    }
                                    if (
                                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                            value,
                                        )
                                    ) {
                                        return "Please enter a valid email address.";
                                    }
                                    return null;
                                }}
                            >
                                <Label className="text-xs font-bold uppercase tracking-wider mb-1 block text-slate-700">
                                    Email Address
                                </Label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                />
                                <FieldError className="text-xs text-rose-500 font-medium mt-1" />
                            </TextField>

                            <TextField
                                isRequired
                                name="password"
                                className="w-full"
                                value={password}
                                onChange={setPassword}
                                validate={(value: string) => {
                                    if (!value) {
                                        return "Password is required.";
                                    }
                                    if (value.length < 8) {
                                        return "Password must be at least 8 characters.";
                                    }
                                    return null;
                                }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <Label className="text-xs font-bold uppercase tracking-wider block text-slate-700">
                                        Password
                                    </Label>
                                    <a
                                        href="/forgot-password"
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative w-full">
                                    <Input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="••••••••"
                                        className="w-full rounded-xl text-sm pr-10 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-indigo-600 transition"
                                    >
                                        {showPassword ? (
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <FieldError className="text-xs text-rose-500 font-medium mt-1" />
                            </TextField>

                            <label className="flex items-center gap-2.5 cursor-pointer select-none mt-1">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-slate-600">
                                    Remember me for 30 days
                                </span>
                            </label>

                            <Button
                                type="submit"
                                className={`w-full py-3 h-11 mt-3 font-semibold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                                    isLoading
                                        ? "bg-indigo-400 cursor-not-allowed text-white shadow-none"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20 hover:shadow-indigo-600/30"
                                }`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            />
                                        </svg>
                                    </>
                                )}
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
