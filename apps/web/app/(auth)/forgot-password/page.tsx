import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="glass-card w-full max-w-lg rounded-[32px] p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Recovery</p>
        <h1 className="display-heading mt-4 text-4xl font-semibold text-white">Reset staff access</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          In production, this flow connects to the Auth Service for email reset tokens and password rotation. For the current scaffold, return to login and use a manager or front desk account pattern.
        </p>
        <div className="mt-8 rounded-[24px] border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-400">
          Suggested accounts:
          <div className="mt-3 space-y-2">
            <div>`manager@courthub.local` routes to Executive</div>
            <div>`frontdesk@courthub.local` routes to Operations</div>
          </div>
        </div>
        <Link
          className="mt-8 inline-flex rounded-full bg-sky-400 px-5 py-3 font-medium text-slate-950"
          href="/login"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
