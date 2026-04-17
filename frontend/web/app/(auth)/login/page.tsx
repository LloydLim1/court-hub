import Link from "next/link";

import { AccessForm } from "../../../components/auth/access-form";

export default function LoginPage() {
  return (
    <div className="auth-shell">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hero-panel">
          <p className="eyebrow text-blue-700">CourtHub access</p>
          <h2 className="display-heading mt-4 text-5xl font-semibold leading-tight text-slate-950">
            Move from discovery to confirmed bookings without the old ops-first friction.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Sign in as a player to book open courts or enter the admin workspace to manage a multi-vendor sports venue with cleaner scheduling.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="soft-chip">Live availability</span>
            <span className="soft-chip">Venue admin demo</span>
            <span className="soft-chip">Blue sports redesign</span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <AccessForm mode="login" />
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        Need help accessing your workspace?{" "}
        <Link className="text-blue-700 hover:text-blue-600" href="/forgot-password">
            Reset your password
          </Link>
      </p>
    </div>
  );
}
