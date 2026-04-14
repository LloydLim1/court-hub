import Link from "next/link";

import { LoginForm } from "../../../components/layout/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_34%)]" />
      <div className="relative w-full max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-center">
            <p className="text-sm uppercase tracking-[0.4em] text-sky-300">CourtHub</p>
            <h2 className="display-heading mt-5 max-w-3xl text-5xl font-semibold leading-tight text-white lg:text-6xl">
              Staff-first booking orchestration for every court shift.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Real-time court control, no-show automation, equipment rentals, QR check-ins, and display-ready scheduling in one command center.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
              <span className="glass-card rounded-full px-4 py-2">Zero booking conflicts</span>
              <span className="glass-card rounded-full px-4 py-2">GCash + Maya proof verification</span>
              <span className="glass-card rounded-full px-4 py-2">Grace period automation</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <LoginForm />
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-slate-400">
          Need help accessing your shift workspace?{" "}
          <Link className="text-sky-300 hover:text-sky-200" href="/forgot-password">
            Reset your password
          </Link>
        </p>
      </div>
    </div>
  );
}
