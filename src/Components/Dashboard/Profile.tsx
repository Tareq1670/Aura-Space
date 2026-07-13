"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { userAPI } from "@/lib/api/Guest/api";
import { imageUploader } from "@/lib/imageUploader";
import { AlertDialog, Button } from "@heroui/react";
import { Toaster, toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <div
      className={`${className} border-2 border-current border-t-transparent rounded-full animate-spin`}
    />
  );
}

function PasswordHint({ met, text }: { met: boolean; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-2 text-xs font-medium ${
        met ? "text-emerald-600" : "text-slate-400"
      }`}
    >
      <motion.div
        animate={{ scale: met ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        {met ? (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        ) : (
          <div className="w-3.5 h-3.5 rounded-full border border-current" />
        )}
      </motion.div>
      {text}
    </motion.div>
  );
}

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
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
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePw, setShowDeletePw] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsPageLoading(true);
        const res = await userAPI.getProfile();
        setProfile(res.data);
        setEditName(res.data.name);
      } catch (error: any) {
        toast.error(error.message || "Failed to load profile.");
        if (
          error.message?.includes("Login") ||
          error.message?.includes("token")
        ) {
          router.push("/login?redirect=/dashboard/profile");
        }
      } finally {
        setIsPageLoading(false);
      }
    })();
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return void toast.error("Please select a valid image.");
    if (file.size > 5 * 1024 * 1024)
      return void toast.error("Image must be under 5MB.");

    setIsUploadingImage(true);
    try {
      const uploaded = await imageUploader(file);
      const imageUrl = uploaded.display_url;
      await userAPI.updateProfileImage(imageUrl);
      setProfile((prev) => (prev ? { ...prev, image: imageUrl } : prev));
      toast.success("Profile photo updated!");
    } catch (error: any) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async () => {
    setIsUploadingImage(true);
    try {
      await userAPI.updateProfile({ image: "" });
      setProfile((prev) => (prev ? { ...prev, image: null } : prev));
      toast.success("Photo removed.");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove photo.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    const trimmed = editName.trim();
    if (!trimmed) return void toast.error("Name cannot be empty.");
    if (trimmed.length < 3) return void toast.error("Name needs 3+ characters.");
    if (trimmed === profile?.name) {
      setIsEditing(false);
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await userAPI.updateProfile({ name: trimmed });
      setProfile(res.data);
      setEditName(res.data.name);
      setIsEditing(false);
      toast.success("Name updated!");
    } catch (error: any) {
      toast.error(error.message || "Update failed.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) return void toast.error("Current password required.");
    if (!newPassword) return void toast.error("New password required.");
    if (newPassword.length < 8)
      return void toast.error("Password needs 8+ characters.");
    if (!/[A-Z]/.test(newPassword))
      return void toast.error("Password needs an uppercase letter.");
    if (!/[0-9]/.test(newPassword))
      return void toast.error("Password needs a number.");
    if (newPassword !== confirmNewPassword)
      return void toast.error("Passwords do not match.");
    if (currentPassword === newPassword)
      return void toast.error("New password must be different.");

    setIsChangingPassword(true);
    try {
      await userAPI.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowPasswordSection(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return void toast.error("Password required.");

    setIsDeletingAccount(true);
    try {
      await userAPI.deleteAccount(deletePassword);
      toast.success("Account deleted. Redirecting...");
      await authClient.signOut();
      setTimeout(() => window.location.replace("/"), 1500);
    } catch (error: any) {
      toast.error(error.message || "Deletion failed.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getRoleBadgeClass = (role: string) => {
    if (role === "admin")
      return "bg-gradient-to-r from-rose-500 to-red-500 text-white";
    if (role === "host")
      return "bg-gradient-to-r from-indigo-500 to-purple-600 text-white";
    return "bg-gradient-to-r from-emerald-500 to-teal-600 text-white";
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Spinner className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">
            Loading your profile...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
            },
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-rose-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Could not load profile
          </h2>
          <button
            onClick={() => router.push("/login?redirect=/dashboard/profile")}
            className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 500,
          },
          success: {
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            },
          },
          error: {
            style: {
              background: "#fff1f2",
              color: "#9f1239",
              border: "1px solid #fecdd3",
            },
          },
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      >
        <motion.div variants={cardVariants} className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal information and account settings.
          </p>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl shadow-indigo-950/5 border border-slate-200/60 overflow-hidden mb-6"
        >
          <div className="h-32 sm:h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 relative overflow-hidden">
            <motion.div
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]"
            />
            <motion.div
              animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -bottom-16 -right-16 w-52 h-52 bg-pink-400/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -top-16 -left-16 w-52 h-52 bg-cyan-400/30 rounded-full blur-3xl"
            />
          </div>

          <div className="px-4 sm:px-8 pb-6 sm:pb-8 -mt-16 sm:-mt-20 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.3,
                }}
                className="relative shrink-0"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-slate-100">
                  {profile.image ? (
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-400">
                      <svg
                        className="w-14 h-14"
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

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="absolute -bottom-1 -right-1 w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 disabled:opacity-60"
                >
                  {isUploadingImage ? (
                    <Spinner className="w-4 h-4" />
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
                        d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                      />
                    </svg>
                  )}
                </motion.button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </motion.div>

              {profile.image && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleRemoveImage}
                  disabled={isUploadingImage}
                  className="mb-2 self-start sm:self-end text-xs text-slate-500 hover:text-rose-500 transition font-semibold"
                >
                  Remove photo
                </motion.button>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2"
            >
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 break-all">
                {profile.name}
              </h2>
              <span
                className={`px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-md ${getRoleBadgeClass(
                  profile.role
                )}`}
              >
                {profile.role}
              </span>
              {profile.emailVerified && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  Verified
                </motion.span>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-500"
            >
              <span className="flex items-center gap-1.5 break-all">
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                Joined {formatDate(profile.createdAt)}
              </span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover={{ y: -2 }}
          className="bg-white rounded-3xl shadow-lg shadow-indigo-950/5 border border-slate-200/60 p-5 sm:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </motion.div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Personal Information
                </h3>
                <p className="text-xs text-slate-500">Update your display name</p>
              </div>
            </div>
            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
              >
                Edit
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your full name"
                    disabled={isSavingProfile}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50/50 text-sm text-slate-400 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Email cannot be changed.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSavingProfile ? (
                      <>
                        <Spinner className="w-4 h-4" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(profile.name);
                    }}
                    disabled={isSavingProfile}
                    className="px-5 py-2.5 border-2 border-slate-200 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid sm:grid-cols-2 gap-3 sm:gap-4"
              >
                {[
                  { label: "Full Name", value: profile.name },
                  { label: "Email Address", value: profile.email },
                  {
                    label: "Account Role",
                    value:
                      profile.role.charAt(0).toUpperCase() +
                      profile.role.slice(1),
                  },
                  {
                    label: "Member Since",
                    value: formatDate(profile.createdAt),
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ scale: 1.02, borderColor: "#a5b4fc" }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-50/50 border-2 border-slate-100 transition"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 break-all">
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover={{ y: -2 }}
          className="bg-white rounded-3xl shadow-lg shadow-indigo-950/5 border border-slate-200/60 p-5 sm:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </motion.div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Password & Security
                </h3>
                <p className="text-xs text-slate-500">Keep your account secure</p>
              </div>
            </div>
            {!showPasswordSection && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPasswordSection(true)}
                className="px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50 rounded-xl transition"
              >
                Change
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {showPasswordSection ? (
              <motion.div
                key="pw-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {[
                  {
                    label: "Current Password",
                    value: currentPassword,
                    setValue: setCurrentPassword,
                    show: showCurrentPw,
                    setShow: setShowCurrentPw,
                  },
                  {
                    label: "New Password",
                    value: newPassword,
                    setValue: setNewPassword,
                    show: showNewPw,
                    setShow: setShowNewPw,
                    hints: true,
                  },
                  {
                    label: "Confirm New Password",
                    value: confirmNewPassword,
                    setValue: setConfirmNewPassword,
                    show: showConfirmPw,
                    setShow: setShowConfirmPw,
                    confirm: true,
                  },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type={field.show ? "text" : "password"}
                        value={field.value}
                        onChange={(e) => field.setValue(e.target.value)}
                        placeholder="••••••••"
                        disabled={isChangingPassword}
                        className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => field.setShow(!field.show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <EyeIcon show={field.show} />
                      </button>
                    </div>
                    {field.hints && newPassword && (
                      <div className="mt-2.5 space-y-1.5">
                        <PasswordHint
                          met={newPassword.length >= 8}
                          text="At least 8 characters"
                        />
                        <PasswordHint
                          met={/[A-Z]/.test(newPassword)}
                          text="One uppercase letter"
                        />
                        <PasswordHint
                          met={/[0-9]/.test(newPassword)}
                          text="One number"
                        />
                      </div>
                    )}
                    {field.confirm && confirmNewPassword && (
                      <div className="mt-2">
                        <PasswordHint
                          met={newPassword === confirmNewPassword}
                          text="Passwords match"
                        />
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isChangingPassword ? (
                      <>
                        <Spinner className="w-4 h-4" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowPasswordSection(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                    }}
                    disabled={isChangingPassword}
                    className="px-5 py-2.5 border-2 border-slate-200 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="pw-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border-2 border-emerald-100"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">
                    Password is set
                  </p>
                  <p className="text-xs text-slate-500">
                    Last updated {formatDate(profile.updatedAt)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          variants={cardVariants}
          whileHover={{ y: -2 }}
          className="bg-white rounded-3xl shadow-lg shadow-rose-950/5 border-2 border-rose-200/60 p-5 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/30"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </motion.div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Danger Zone
              </h3>
              <p className="text-xs text-slate-500">Irreversible account actions</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50/50 border-2 border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Delete your account permanently
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                All data, bookings and history will be removed forever.
              </p>
            </div>

            <AlertDialog>
              <Button
                variant="danger"
                className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30"
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
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Delete Account
              </Button>
              <AlertDialog.Backdrop>
                <AlertDialog.Container>
                  <AlertDialog.Dialog className="sm:max-w-[440px]">
                    <AlertDialog.CloseTrigger />
                    <AlertDialog.Header>
                      <AlertDialog.Icon status="danger" />
                      <AlertDialog.Heading>
                        Delete your account permanently?
                      </AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                      <div className="space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          This is{" "}
                          <strong className="text-rose-600">
                            permanent and irreversible
                          </strong>
                          . All your data, bookings, and history will be gone
                          forever.
                        </p>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                            Confirm your password
                          </label>
                          <div className="relative">
                            <input
                              type={showDeletePw ? "text" : "password"}
                              value={deletePassword}
                              onChange={(e) => setDeletePassword(e.target.value)}
                              placeholder="Enter your password"
                              disabled={isDeletingAccount}
                              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowDeletePw(!showDeletePw)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              <EyeIcon show={showDeletePw} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button
                        slot="close"
                        variant="tertiary"
                        onPress={() => {
                          setDeletePassword("");
                          setShowDeletePw(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="danger"
                        isDisabled={!deletePassword || isDeletingAccount}
                        onPress={handleDeleteAccount}
                      >
                        {isDeletingAccount ? (
                          <span className="flex items-center gap-2">
                            <Spinner className="w-4 h-4" />
                            Deleting...
                          </span>
                        ) : (
                          "Delete Forever"
                        )}
                      </Button>
                    </AlertDialog.Footer>
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
          </div>
        </motion.div>

        <div className="h-10" />
      </motion.div>
    </div>
  );
}