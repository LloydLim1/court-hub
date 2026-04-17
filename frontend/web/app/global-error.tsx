"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="app-surface flex min-h-screen items-center justify-center px-6">
        <div className="glass-card w-full max-w-xl rounded-[32px] p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">CourtHub Recovery</p>
          <h1 className="display-heading mt-3 text-3xl font-semibold text-white">
            Something interrupted the control room.
          </h1>
          <p className="mt-4 text-sm text-slate-300">{error.message}</p>
          <button
            className="mt-6 rounded-full bg-sky-400 px-5 py-3 font-medium text-slate-950"
            onClick={() => reset()}
          >
            Reload the workspace
          </button>
        </div>
      </body>
    </html>
  );
}
