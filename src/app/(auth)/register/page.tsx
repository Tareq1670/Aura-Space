"use client";

import React, { useState, useRef, Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Form,
    TextField,
    Label,
    Input,
    FieldError,
    Select,
    ListBox,
} from "@heroui/react";
import Button from "@/Components/ui/Button";
import { imageUploader } from "@/lib/imageUploader";
import { authClient } from "@/lib/auth-client";
import { validatePasswordServer } from "@/lib/actions/auth";
import Image from "next/image";

interface RegisterFormData {
    name: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
}

interface GlobalMessage {
    type: "success" | "error";
    text: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function buildAuthHref(basePath: string, redirectParam: string | null) {
    if (!redirectParam) return basePath;
    return `${basePath}?redirect=${encodeURIComponent(redirectParam)}`;
}

function RegisterForm() {
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [globalMessage, setGlobalMessage] = useState<GlobalMessage | null>(
        null,
    );

    const router = useRouter();
    const redirectParam = searchParams.get("redirect");
    const loginHref = buildAuthHref("/login", redirectParam);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setGlobalMessage({
                type: "error",
                text: "Please select a valid image file (JPG, PNG, WEBP).",
            });
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setGlobalMessage({
                type: "error",
                text: "Image size must be less than 5MB.",
            });
            return;
        }

        setGlobalMessage(null);
        setProfileImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = (): void => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setProfileImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateFormData = (data: RegisterFormData): string | null => {
        if (!data.name) return "Full name is required!";
        if (data.name.length < 3)
            return "Full name must be at least 3 characters.";
        if (!data.email) return "Email address is required!";
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email))
            return "Please enter a valid email address.";
        if (!data.role) return "Please select a role (Guest or Host).";
        if (!data.password) return "Password is required!";
        if (data.password.length < 8)
            return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(data.password))
            return "Password must include at least one uppercase letter.";
        if (!/[0-9]/.test(data.password))
            return "Password must include at least one number.";
        if (!data.confirmPassword) return "Please confirm your password!";
        if (data.password !== data.confirmPassword)
            return "Passwords do not match!";
        return null;
    };

    const onSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();
        setGlobalMessage(null);

        const formData = new FormData(e.currentTarget);

        const data: RegisterFormData = {
            name: (formData.get("name") as string | null)?.trim() ?? "",
            email: (formData.get("email") as string | null)?.trim() ?? "",
            role: selectedRole,
            password: (formData.get("password") as string | null) ?? "",
            confirmPassword:
                (formData.get("confirmPassword") as string | null) ?? "",
        };

        const validationError = validateFormData(data);
        if (validationError) {
            setGlobalMessage({ type: "error", text: validationError });
            return;
        }

        const serverValidation = await validatePasswordServer(data.password);
        if (!serverValidation.valid) {
            setGlobalMessage({ type: "error", text: serverValidation.error! });
            return;
        }

        setIsLoading(true);

        try {
            let imageUrl: string | undefined = undefined;

            if (profileImage) {
                const uploadedImage = await imageUploader(profileImage);
                imageUrl = uploadedImage.display_url;
            }

            document.cookie = `pending_role=${data.role}; path=/; max-age=300; SameSite=Lax`;

            await new Promise((resolve) => setTimeout(resolve, 100));

            const { error } = await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
                image: imageUrl,
            });

            if (error) {
                document.cookie =
                    "pending_role=; path=/; max-age=0; SameSite=Lax";
                setGlobalMessage({
                    type: "error",
                    text:
                        error.message ??
                        "Registration failed. Please try again.",
                });
                return;
            }

            await authClient.signOut();

            document.cookie =
                "pending_role=; path=/; max-age=0; SameSite=Lax";

            setGlobalMessage({
                type: "success",
                text: "Registration successful! Redirecting to login...",
            });

            setTimeout(() => {
                router.replace(loginHref);
            }, 1500);
        } catch (err) {
            document.cookie =
                "pending_role=; path=/; max-age=0; SameSite=Lax";
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
            <div className="w-full max-w-5xl rounded-[2rem] shadow-card overflow-hidden grid md:grid-cols-12 min-h-[680px] border border-slate-200/80 bg-white/90 backdrop-blur-sm">
                <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute -top-20 -right-20 w-56 h-56 bg-indigo-400/20 rounded-full blur-3xl"></div>

                    <div className="z-10">
                        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                            <span className="text-emerald-400">✦</span>{" "}
                            AuraSpace
                        </h1>
                        <p className="text-indigo-200 mt-1 text-xs uppercase tracking-widest font-medium">
                            Next-Gen Rental Platform
                        </p>
                    </div>

                    <div className="z-10 my-auto space-y-6">
                        <h2 className="text-4xl font-black leading-tight tracking-tight">
                            Find Your <br />
                            <span className="text-emerald-400">
                                Perfect
                            </span>{" "}
                            Sanctuary.
                        </h2>
                        <p className="text-indigo-100 text-sm leading-relaxed max-w-sm font-light">
                            Join our global network of verified hosts and
                            premium properties tailored exactly to your unique
                            journey.
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
                                Create an account
                            </h3>
                            <p className="text-sm mt-1.5 text-slate-500">
                                Already a member?{" "}
                                <Link
                                    href={loginHref}
                                    className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition"
                                >
                                    Sign in
                                </Link>
                            </p>
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
                            onReset={() => {
                                setGlobalMessage(null);
                                setShowPassword(false);
                                setShowConfirmPassword(false);
                                handleRemoveImage();
                            }}
                        >
                            <div className="w-full">
                                <label
                                    htmlFor="profile-image-input"
                                    className="text-xs font-bold uppercase tracking-wider mb-2 block text-slate-700"
                                >
                                    Profile Photo
                                </label>
                                <div className="flex items-center gap-4 p-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
                                    <div className="relative shrink-0">
                                        {imagePreview ? (
                                            <>
                                                <Image
                                                    height={140}
                                                    width={140}
                                                    src={imagePreview}
                                                    alt="Profile preview"
                                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-indigo-500/20"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    aria-label="Remove profile photo"
                                                    className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow transition active:scale-90"
                                                >
                                                    <svg
                                                        className="w-3 h-3"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </>
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-white border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shadow-sm">
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="profile-image-input"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-slate-600 shadow-sm active:scale-[0.98]"
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
                                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                                />
                                            </svg>
                                            {profileImage
                                                ? profileImage.name.length > 22
                                                    ? profileImage.name.slice(
                                                          0,
                                                          22,
                                                      ) + "..."
                                                    : profileImage.name
                                                : "Choose photo"}
                                        </button>
                                        <p className="text-xs text-slate-400 mt-1 font-medium">
                                            JPG, PNG or WEBP — Max 5MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <TextField
                                isRequired
                                name="name"
                                type="text"
                                className="w-full"
                                validate={(value: string) => {
                                    if (!value || !value.trim()) {
                                        return "Full name is required.";
                                    }
                                    if (value.trim().length < 3) {
                                        return "Full name must be at least 3 characters.";
                                    }
                                    return null;
                                }}
                            >
                                <Label className="text-xs font-bold uppercase tracking-wider mb-1 block text-slate-700">
                                    Full Name
                                </Label>
                                <Input
                                    placeholder="John Doe"
                                    className="w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                />
                                <FieldError className="text-xs text-rose-500 font-medium mt-1" />
                            </TextField>

                            <TextField
                                isRequired
                                name="email"
                                type="email"
                                className="w-full"
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
                                    placeholder="john@example.com"
                                    className="w-full rounded-xl text-sm bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                />
                                <FieldError className="text-xs text-rose-500 font-medium mt-1" />
                            </TextField>

                            <Select
                                isRequired
                                name="role"
                                placeholder="Select your role"
                                className="w-full"
                                selectedKey={selectedRole || undefined}
                                onSelectionChange={(key) => {
                                    setSelectedRole((key as string) || "");
                                }}
                            >
                                <Label className="text-xs font-bold uppercase tracking-wider mb-1 block text-slate-700">
                                    Join As
                                </Label>
                                <Select.Trigger className="w-full flex items-center justify-between px-3 py-2.5 border rounded-xl text-sm font-medium cursor-pointer transition bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 data-[placeholder]:text-slate-400">
                                    <Select.Value className="truncate" />
                                    <Select.Indicator className="text-slate-400 shrink-0 ml-2" />
                                </Select.Trigger>
                                <Select.Popover className="w-[var(--trigger-width)] bg-white border border-slate-200 rounded-xl shadow-overlay p-1.5 overflow-hidden">
                                    <ListBox className="outline-none">
                                        <ListBox.Item
                                            id="guest"
                                            textValue="Guest (To Browse & Book)"
                                            className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer outline-none transition text-slate-700 data-[hovered]:bg-indigo-50 data-[hovered]:text-indigo-700 data-[focused]:bg-indigo-50 data-[focused]:text-indigo-700 data-[selected]:bg-indigo-500/10 data-[selected]:text-indigo-700"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <svg
                                                    className="w-4 h-4 shrink-0"
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
                                                Guest (To Browse & Book)
                                            </div>
                                            <ListBox.ItemIndicator className="text-indigo-600" />
                                        </ListBox.Item>
                                        <ListBox.Item
                                            id="host"
                                            textValue="Host (To List Properties)"
                                            className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer outline-none transition text-slate-700 data-[hovered]:bg-indigo-50 data-[hovered]:text-indigo-700 data-[focused]:bg-indigo-50 data-[focused]:text-indigo-700 data-[selected]:bg-indigo-500/10 data-[selected]:text-indigo-700"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <svg
                                                    className="w-4 h-4 shrink-0"
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
                                                Host (To List Properties)
                                            </div>
                                            <ListBox.ItemIndicator className="text-indigo-600" />
                                        </ListBox.Item>
                                    </ListBox>
                                </Select.Popover>
                                <FieldError className="text-xs text-rose-500 font-medium mt-1" />
                            </Select>

                            <TextField
                                isRequired
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="w-full"
                                validate={(value: string) => {
                                    if (!value) {
                                        return "Password is required.";
                                    }
                                    if (value.length < 8) {
                                        return "Password must be at least 8 characters.";
                                    }
                                    if (!/[A-Z]/.test(value)) {
                                        return "Include at least one uppercase letter.";
                                    }
                                    if (!/[0-9]/.test(value)) {
                                        return "Include at least one number.";
                                    }
                                    return null;
                                }}
                            >
                                <Label className="text-xs font-bold uppercase tracking-wider mb-1 block text-slate-700">
                                    Password
                                </Label>
                                <div className="relative w-full">
                                    <Input
                                        placeholder="••••••••"
                                        className="w-full rounded-xl text-sm pr-10 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        aria-pressed={showPassword}
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

                            <TextField
                                isRequired
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full"
                                validate={(value: string) => {
                                    if (!value) {
                                        return "Please confirm your password.";
                                    }
                                    return null;
                                }}
                            >
                                <Label className="text-xs font-bold uppercase tracking-wider mb-1 block text-slate-700">
                                    Confirm Password
                                </Label>
                                <div className="relative w-full">
                                    <Input
                                        placeholder="••••••••"
                                        className="w-full rounded-xl text-sm pr-10 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        aria-pressed={showConfirmPassword}
                                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-indigo-600 transition"
                                    >
                                        {showConfirmPassword ? (
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

                            <div className="flex gap-3 mt-2">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    isLoading={isLoading}
                                    loadingText="Registering..."
                                    fullWidth
                                    rightIcon={
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
                                    }
                                >
                                    Register Account
                                </Button>

                                <Button type="reset" variant="secondary">
                                    Reset
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RegisterFallback() {
    return (
        <div className="bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<RegisterFallback />}>
            <RegisterForm />
        </Suspense>
    );
}