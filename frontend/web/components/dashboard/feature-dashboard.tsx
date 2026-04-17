"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { staggerContainer, staggerItem } from "../../lib/animations";
import { getSectionData, liveCourtStatus, transitionAlerts, type DashboardScope } from "../../lib/mock-data";
import { AnimatedPage } from "../motion/animated-page";
import { SkeletonCard } from "../ui/skeleton-card";
import { KanbanBoard } from "../staff/kanban-board";
import { CourtCard } from "./court-card";
import { KpiCard } from "./kpi-card";
import { RevenueChart } from "./revenue-chart";
import { SectionPanel } from "./section-panel";

export function FeatureDashboard({
  scope,
  section = "root",
}: {
  scope: DashboardScope;
  section?: string;
}) {
  const query = useQuery({
    queryKey: ["section", scope, section],
    queryFn: () => getSectionData(scope, section),
  });

  if (query.isLoading || !query.data) {
    return (
      <AnimatedPage className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard className="h-80" />
      </AnimatedPage>
    );
  }

  const data = query.data;

  return (
    <AnimatedPage className="space-y-6">
      <section className="glass-card rounded-[32px] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300">{data.eyebrow}</p>
        <h1 className="display-heading mt-4 max-w-4xl text-4xl font-semibold text-white md:text-5xl">
          {data.title}
        </h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">{data.description}</p>
      </section>

      <motion.section
        animate="visible"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        variants={staggerContainer}
      >
        {data.metrics.map((metric) => (
          <motion.div key={metric.id} variants={staggerItem}>
            <KpiCard label={metric.label} suffix={metric.suffix} trend={metric.trend} value={metric.value} />
          </motion.div>
        ))}
      </motion.section>

      {scope === "executive" ? <RevenueChart /> : null}

      {scope === "operations" ? (
        <div className="space-y-6">
          <section className="glass-card rounded-[28px] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Live Court Monitor</p>
                <h3 className="display-heading mt-2 text-2xl font-semibold text-white">
                  Court states update in real time
                </h3>
              </div>
              <motion.div
                animate={{
                  backgroundColor: [
                    "rgba(37,99,235,0.16)",
                    "rgba(14,165,233,0.36)",
                    "rgba(37,99,235,0.16)",
                  ],
                  transition: { duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 },
                }}
                className="rounded-full px-4 py-2 text-xs text-sky-200"
              >
                Live sync flash
              </motion.div>
            </div>
            <div className="mt-6 grid gap-4 xl:grid-cols-4">
              {liveCourtStatus.map((court) => (
                <CourtCard
                  countdown={court.countdown}
                  key={court.id}
                  name={court.name}
                  nextSlot={court.nextSlot}
                  sport={court.sport}
                  status={court.status}
                />
              ))}
            </div>
          </section>
          <section className="grid gap-4 lg:grid-cols-2">
            {transitionAlerts.map((alert) => (
              <motion.div
                animate={{ y: 0 }}
                className="glass-card rounded-[28px] border border-amber-400/30 p-5"
                initial={{ y: -50 }}
                key={alert.id}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Transition Alert</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{alert.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{alert.detail}</p>
              </motion.div>
            ))}
          </section>
        </div>
      ) : null}

      {scope === "staff" ? <KanbanBoard /> : null}

      <section className="grid gap-4 xl:grid-cols-2">
        {data.panels.map((panel) => (
          <SectionPanel
            description={panel.description}
            items={panel.items}
            key={panel.title}
            title={panel.title}
          />
        ))}
      </section>
    </AnimatedPage>
  );
}
