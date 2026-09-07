"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { API_BASE_URL } from "@/services";

/** Surfaces backend failures once, instead of leaving screens mysteriously empty. */
export function ApiStatusBanner() {
  const { error, clearError } = useStore();

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:pt-20"
        >
          <div className="glass-strong flex w-full max-w-xl items-start gap-3 rounded-2xl border border-brand-400/30 px-4 py-3 text-sm text-brand-100">
            <span aria-hidden>⚠️</span>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 break-words">{error}</p>
              <p className="mt-0.5 truncate text-xs text-white/40">API: {API_BASE_URL}</p>
            </div>
            <button
              onClick={clearError}
              className="-mr-1 shrink-0 text-white/50 transition hover:text-white"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
