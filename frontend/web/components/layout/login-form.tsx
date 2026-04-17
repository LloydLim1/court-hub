"use client";

import { motion } from "framer-motion";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { getRoleHome } from "../../lib/auth";
import { useUiStore } from "../../lib/ui-store";

export function LoginForm() {
  const router = useRouter();
  const pushToast = useUiStore((state) => state.pushToast);
  const [email, setEmail] = useState("player@courthub.app");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      setShake(true);
      pushToast({
        title: "Credentials required",
        description: "Enter both email and password to continue.",
        tone: "warning",
      });
      setTimeout(() => setShake(false), 350);
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = (await response.json()) as { role: string };

    pushToast({
      title: "Access granted",
      description: "Routing you into the live facility workspace.",
      tone: "success",
    });
    router.push(getRoleHome(payload.role) as Route);
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="glass-card w-full max-w-md rounded-[32px] p-8"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300">CourtHub Access</p>
      <h1 className="display-heading mt-4 text-4xl font-semibold text-white">SportCenter control room</h1>
      <p className="mt-4 text-sm leading-6 text-slate-300">
        Staff-assisted operations for basketball, volleyball, pickleball, and badminton bookings.
      </p>

      <div className="mt-8 space-y-4">
        <div className={shake ? "validation-shake" : ""}>
          <label className="mb-2 block text-sm text-slate-400">Email</label>
          <input
            className="input-base"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="player@courthub.app"
            value={email}
          />
        </div>
        <div className={shake ? "validation-shake" : ""}>
          <label className="mb-2 block text-sm text-slate-400">Password</label>
          <input
            className="input-base"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            type="password"
            value={password}
          />
        </div>
      </div>

      <button
        className="mt-8 w-full rounded-full bg-sky-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-sky-300"
        disabled={loading}
        onClick={submit}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </motion.div>
  );
}
