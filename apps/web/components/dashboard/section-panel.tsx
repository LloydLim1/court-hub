import { cn } from "../../lib/utils";

const toneClass = {
  neutral: "bg-slate-900/80 text-slate-200",
  info: "bg-sky-500/10 text-sky-200",
  warning: "bg-amber-500/10 text-amber-200",
  success: "bg-emerald-500/10 text-emerald-200",
  danger: "bg-rose-500/10 text-rose-200",
};

export function SectionPanel({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Array<{ label: string; value: string; tone?: keyof typeof toneClass }>;
}) {
  return (
    <section className="glass-card rounded-[28px] p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-sky-300">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div className="rounded-[22px] border border-slate-800 bg-slate-950/50 p-4" key={`${item.label}-${item.value}`}>
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-medium text-white">{item.label}</p>
              <span className={cn("rounded-full px-3 py-1 text-xs", toneClass[item.tone ?? "neutral"])}>
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
