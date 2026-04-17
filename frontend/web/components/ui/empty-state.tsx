import { Sparkles } from "lucide-react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card flex h-full min-h-56 flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-700 px-6 text-center">
      <div className="rounded-full bg-sky-400/12 p-4 text-sky-300">
        <Sparkles className="h-8 w-8" />
      </div>
      <h3 className="display-heading mt-5 text-2xl font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
    </div>
  );
}
