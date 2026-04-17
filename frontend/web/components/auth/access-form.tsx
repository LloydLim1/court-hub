"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { PlatformRole } from "@courthub/domain";

import { getDefaultDemoAccount } from "../../lib/auth";
import { useUiStore } from "../../lib/ui-store";

export function AccessForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const pushToast = useUiStore((state) => state.pushToast);
  const [role, setRole] = useState<PlatformRole>("user");
  const [name, setName] = useState(mode === "signup" ? "Alya Reyes" : "");
  const [email, setEmail] = useState(
    mode === "login" ? getDefaultDemoAccount("user").email : "player@courthub.app",
  );
  const [password, setPassword] = useState("courthub123");
  const [loading, setLoading] = useState(false);

  const fillDemo = (nextRole: PlatformRole) => {
    const account = getDefaultDemoAccount(nextRole);
    setRole(nextRole);
    setName(account.name);
    setEmail(account.email);
    setPassword("courthub123");
  };

  const submit = async () => {
    if (!email || !password || (mode === "signup" && !name)) {
      pushToast({
        title: "Complete the form",
        description:
          mode === "signup"
            ? "Name, email, and password are required before you continue."
            : "Email and password are required before you continue.",
        tone: "warning",
      });
      return;
    }

    setLoading(true);
    const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        mode === "login"
          ? {
              email,
              role,
            }
          : {
              email,
              name,
            },
      ),
    });

    const payload = (await response.json()) as { home: string };
    pushToast({
      title: mode === "login" ? "Signed in" : "Account created",
      description:
        mode === "login"
          ? "Your CourtHub workspace is ready."
          : "You can now browse venues and reserve open slots.",
      tone: "success",
    });
    router.push(payload.home as Route);
    router.refresh();
    setLoading(false);
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="surface-card w-full max-w-lg p-8 md:p-10"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.28 }}
    >
      <p className="eyebrow text-blue-700">{mode === "login" ? "Welcome back" : "Join CourtHub"}</p>
      <h1 className="display-heading mt-3 text-4xl font-semibold text-slate-950">
        {mode === "login" ? "Sign in as a player or venue admin" : "Create your player account"}
      </h1>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        {mode === "login"
          ? "Use the player flow for bookings or the admin flow to manage a vendor and its courts."
          : "Public signup is for players. Venue admin access is still demo-only while the invite flow is being refined."}
      </p>

      {mode === "login" ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            className={role === "user" ? "role-card role-card-active" : "role-card"}
            onClick={() => fillDemo("user")}
          >
            <span>Player</span>
            <strong>Book available courts</strong>
          </button>
          <button
            className={role === "admin" ? "role-card role-card-active" : "role-card"}
            onClick={() => fillDemo("admin")}
          >
            <span>Venue Admin</span>
            <strong>Manage courts and schedules</strong>
          </button>
        </div>
      ) : null}

      <div className="mt-8 space-y-4">
        {mode === "signup" ? (
          <div>
            <label className="field-label">Full name</label>
            <input
              className="field-input"
              onChange={(event) => setName(event.target.value)}
              placeholder="Alya Reyes"
              value={name}
            />
          </div>
        ) : null}
        <div>
          <label className="field-label">Email</label>
          <input
            className="field-input"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="player@courthub.app"
            value={email}
          />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input
            className="field-input"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="courthub123"
            type="password"
            value={password}
          />
        </div>
      </div>

      <button className="primary-button mt-8 w-full justify-center" disabled={loading} onClick={submit}>
        {loading ? "Please wait..." : mode === "login" ? "Continue to CourtHub" : "Create account"}
      </button>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <Link
          className="text-blue-700 hover:text-blue-600"
          href={(mode === "login" ? "/signup" : "/login") as Route}
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </Link>
        {mode === "login" ? (
          <Link className="text-blue-700 hover:text-blue-600" href="/forgot-password">
            Forgot password?
          </Link>
        ) : (
          <span>Demo admin: admin@courthub.app / courthub123</span>
        )}
      </div>
    </motion.div>
  );
}
