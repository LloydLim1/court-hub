"use client";

import { motion } from "framer-motion";

export function SuccessCheckmark() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ scale: 1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/12"
        initial={{ scale: 0.7 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
      >
        <svg fill="none" height="42" viewBox="0 0 52 52" width="42">
          <motion.circle
            animate={{ pathLength: 1 }}
            cx="26"
            cy="26"
            initial={{ pathLength: 0 }}
            r="24"
            stroke="#4ade80"
            strokeWidth="3"
          />
          <motion.path
            animate={{ pathLength: 1 }}
            d="M14 27.5L22 35L38 18"
            initial={{ pathLength: 0 }}
            stroke="#4ade80"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            transition={{ delay: 0.15, duration: 0.45 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
