"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import ModalPortal from "@/lib/modal-portal";

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
    gradient: "from-red-500 to-red-600",
    iconBg: "bg-red-50",
    iconBorder: "border-red-100",
    shadow: "shadow-red-500/20",
  },
  warning: {
    gradient: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-50",
    iconBorder: "border-amber-100",
    shadow: "shadow-amber-500/20",
  },
  info: {
    gradient: "from-violet-500 to-indigo-600",
    iconBg: "bg-violet-50",
    iconBorder: "border-violet-100",
    shadow: "shadow-violet-500/20",
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
    <ModalPortal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100"
          >
            {icon && (
              <div
                className={`w-14 h-14 rounded-2xl ${v.iconBg} border ${v.iconBorder} flex items-center justify-center mx-auto mb-5 text-3xl`}
              >
                {icon}
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              {title}
            </h3>

            <div className="text-sm text-gray-500 text-center leading-relaxed mb-7">
              {message}
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 px-5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-600 text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {cancelText}
              </motion.button>

              <motion.button
                whileHover={!loading ? { scale: 1.01 } : {}}
                whileTap={!loading ? { scale: 0.99 } : {}}
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 py-2.5 px-5 bg-gradient-to-r ${v.gradient} rounded-xl text-white text-sm font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-lg ${v.shadow} flex items-center justify-center gap-2 transition-all`}
              >
                {loading && (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                )}
                {confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </ModalPortal>
  );
}