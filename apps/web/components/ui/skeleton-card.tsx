export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-card animate-pulse rounded-[28px] p-5 ${className}`}>
      <div className="h-3 w-24 rounded-full bg-slate-700/70" />
      <div className="mt-4 h-8 w-2/3 rounded-full bg-slate-700/70" />
      <div className="mt-6 h-20 rounded-[20px] bg-slate-800/80" />
    </div>
  );
}
