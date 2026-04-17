import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="auth-shell">
      <div className="surface-card w-full max-w-lg p-8">
        <p className="eyebrow text-blue-700">Recovery</p>
        <h1 className="display-heading mt-4 text-4xl font-semibold text-slate-950">Reset your access</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          The production flow will connect to the Auth Service for reset links and password rotation. For this demo, head back to login and use one of the dummy accounts below.
        </p>
        <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-600">
          Suggested accounts:
          <div className="mt-3 space-y-2">
            <div>`admin@courthub.app` for the venue admin dashboard</div>
            <div>`player@courthub.app` for the player booking dashboard</div>
          </div>
        </div>
        <Link className="primary-button mt-8" href="/login">
          Back to login
        </Link>
      </div>
    </div>
  );
}
