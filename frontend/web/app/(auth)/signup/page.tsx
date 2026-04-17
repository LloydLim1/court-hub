import { AccessForm } from "../../../components/auth/access-form";

export default function SignupPage() {
  return (
    <div className="auth-shell">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hero-panel">
          <p className="eyebrow text-blue-700">Join CourtHub</p>
          <h2 className="display-heading mt-4 text-5xl font-semibold leading-tight text-slate-950">
            Create your player account and start booking courts the clean way.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Compare venues, pick open slots, and manage your sessions from a calmer, brighter sports interface.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <AccessForm mode="signup" />
        </div>
      </div>
    </div>
  );
}
