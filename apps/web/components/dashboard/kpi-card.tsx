"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

import { hoverLift } from "../../lib/animations";

export function KpiCard({
  label,
  value,
  suffix,
  trend,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  trend?: number;
}) {
  const numericValue = typeof value === "number" ? value : null;
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    if (numericValue === null) return undefined;
    const controls = animate(motionValue, numericValue, { duration: 1.5 });
    return () => controls.stop();
  }, [motionValue, numericValue]);

  return (
    <motion.div
      animate="rest"
      className="glass-card rounded-[28px] p-5"
      initial="rest"
      variants={hoverLift}
      whileHover="hover"
    >
      <p className="text-sm text-slate-400">{label}</p>
      <div className="mt-6 flex items-end justify-between gap-3">
        <div className="display-heading text-4xl font-semibold text-white">
          {numericValue === null ? value : <motion.span>{rounded}</motion.span>}
          {suffix ? <span className="ml-2 text-lg text-slate-400">{suffix}</span> : null}
        </div>
        {typeof trend === "number" ? (
          <div
            className={`rounded-full px-3 py-1 text-xs ${
              trend >= 0 ? "bg-emerald-500/12 text-emerald-300" : "bg-rose-500/12 text-rose-300"
            }`}
          >
            {trend >= 0 ? "+" : ""}
            {trend}%
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
