"use client";

import { motion } from "framer-motion";

import { hoverLift } from "../../lib/animations";

const statusTheme = {
  available: "bg-emerald-500/12 text-emerald-300",
  reserved: "bg-amber-500/12 text-amber-300",
  in_use: "bg-rose-500/12 text-rose-300",
  no_show: "bg-violet-500/12 text-violet-300",
  grace_period: "bg-orange-500/12 text-orange-300",
  cleaning: "bg-sky-500/12 text-sky-300",
  maintenance: "bg-slate-500/12 text-slate-300",
};

export function CourtCard({
  name,
  sport,
  status,
  nextSlot,
  countdown,
}: {
  name: string;
  sport: string;
  status: keyof typeof statusTheme;
  nextSlot: string;
  countdown: string;
}) {
  const countdownVariant =
    status === "grace_period"
      ? {
          animate: {
            scale: [1.1, 1],
            color: ["#ef4444", "#ffffff"],
            transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 },
          },
        }
      : undefined;

  return (
    <motion.article
      animate="rest"
      className={`glass-card rounded-[28px] p-5 ${status === "no_show" ? "bg-rose-950/60" : ""}`}
      initial="rest"
      variants={hoverLift}
      whileHover="hover"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{sport}</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{name}</h3>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs ${statusTheme[status]}`}>
          <motion.span
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
              transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
            }}
            className="mr-2 inline-block h-2 w-2 rounded-full bg-current"
          />
          {status.replace("_", " ")}
        </div>
      </div>
      <div className="mt-6 rounded-[24px] bg-slate-950/60 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Countdown</p>
        <motion.p className="display-heading mt-2 text-3xl font-semibold text-white" {...countdownVariant}>
          {countdown}
        </motion.p>
        <p className="mt-2 text-sm text-slate-400">Next slot: {nextSlot}</p>
      </div>
    </motion.article>
  );
}
