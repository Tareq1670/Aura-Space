"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    loading?: boolean;
    icon?: ReactNode;
}

const variants = {
    danger: {
        gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
        glow: "rgba(239, 68, 68, 0.3)",
        bg: "rgba(239, 68, 68, 0.05)",
        border: "rgba(239, 68, 68, 0.2)",
    },
    warning: {
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        glow: "rgba(245, 158, 11, 0.3)",
        bg: "rgba(245, 158, 11, 0.05)",
        border: "rgba(245, 158, 11, 0.2)",
    },
    info: {
        gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
        glow: "rgba(59, 130, 246, 0.3)",
        bg: "rgba(59, 130, 246, 0.05)",
        border: "rgba(59, 130, 246, 0.2)",
    },
};

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    loading = false,
    icon,
}: ConfirmModalProps) {
    const v = variants[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0, 0, 0, 0.6)",
                        backdropFilter: "blur(4px)",
                        padding: 16,
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "rgba(15, 15, 25, 0.95)",
                            border: `1px solid ${v.border}`,
                            borderRadius: 20,
                            padding: "32px",
                            maxWidth: 420,
                            width: "100%",
                            backdropFilter: "blur(20px)",
                            boxShadow: `0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px ${v.glow}`,
                        }}
                    >
                        {/* Icon */}
                        {icon && (
                            <div
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 16,
                                    background: v.bg,
                                    border: `1px solid ${v.border}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 20px",
                                    fontSize: 28,
                                }}
                            >
                                {icon}
                            </div>
                        )}

                        {/* Title */}
                        <h3
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: "#f1f5f9",
                                textAlign: "center",
                                marginBottom: 12,
                            }}
                        >
                            {title}
                        </h3>

                        {/* Message */}
                        <div
                            style={{
                                fontSize: 14,
                                color: "#94a3b8",
                                textAlign: "center",
                                lineHeight: 1.6,
                                marginBottom: 28,
                            }}
                        >
                            {message}
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: 12 }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: "12px 20px",
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: 12,
                                    color: "#94a3b8",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: loading ? "not-allowed" : "pointer",
                                    opacity: loading ? 0.5 : 1,
                                    transition: "all 0.15s",
                                }}
                            >
                                {cancelText}
                            </motion.button>

                            <motion.button
                                whileHover={
                                    !loading ? { scale: 1.02 } : undefined
                                }
                                whileTap={
                                    !loading ? { scale: 0.98 } : undefined
                                }
                                onClick={onConfirm}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: "12px 20px",
                                    background: v.gradient,
                                    border: "none",
                                    borderRadius: 12,
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: loading ? "not-allowed" : "pointer",
                                    opacity: loading ? 0.7 : 1,
                                    boxShadow: `0 4px 20px ${v.glow}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    transition: "all 0.15s",
                                }}
                            >
                                {loading && (
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        style={{
                                            display: "inline-block",
                                            width: 16,
                                            height: 16,
                                            border: "2px solid rgba(255,255,255,0.3)",
                                            borderTopColor: "#fff",
                                            borderRadius: "50%",
                                        }}
                                    />
                                )}
                                {confirmText}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
