"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Clock3 } from "lucide-react";
import { io } from "socket.io-client";
import { useEffect, useMemo, useState } from "react";

import { getDisplayViews, displayTicker, liveCourtStatus } from "../../lib/mock-data";

const statusTheme = {
  available: "bg-emerald-500 text-emerald-950",
  reserved: "bg-amber-400 text-amber-950",
  in_use: "bg-rose-500 text-white",
  no_show: "bg-violet-500 text-white",
  grace_period: "bg-orange-400 text-orange-950",
  cleaning: "bg-sky-400 text-sky-950",
  maintenance: "bg-slate-400 text-slate-950",
};

export function DisplayBoard() {
  const query = useQuery({
    queryKey: ["display-views"],
    queryFn: getDisplayViews,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % 6), 30_000);
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(clock);
    };
  }, []);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_NOTIFICATION_URL;
    if (!url) return undefined;

    const socket = io(url, { transports: ["websocket"] });
    socket.on("court.status.updated", () => {
      setFlash(true);
      window.setTimeout(() => setFlash(false), 800);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const view = query.data?.[activeIndex];
  const filteredCourts = useMemo(() => {
    if (!view || view.id === "overview" || view.id === "schedule") return liveCourtStatus;
    return liveCourtStatus.filter((court) => court.sport === view.id);
  }, [view]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <motion.div
        animate={
          flash
            ? {
                backgroundColor: ["rgba(14,165,233,0.0)", "rgba(14,165,233,0.16)", "rgba(14,165,233,0.0)"],
                transition: { duration: 0.8 },
              }
            : {}
        }
        className="absolute inset-0"
      />
      <div className="relative z-10 flex min-h-screen flex-col px-8 py-8 md:px-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-lg uppercase tracking-[0.45em] text-sky-300">CourtHub Display</p>
            <h1 className="display-heading mt-3 text-5xl font-semibold">Live Court Availability</h1>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/70 px-6 py-3 text-xl">
            <Clock3 className="h-6 w-6 text-sky-300" />
            {now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.section
            animate={{ opacity: 1, x: 0 }}
            className="mt-10 flex-1"
            exit={{ opacity: 0, x: -100, transition: { duration: 0.5 } }}
            initial={{ opacity: 0, x: 100 }}
            key={view?.id ?? "loading"}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.4em] text-slate-400">{view?.label}</p>
              <h2 className="display-heading mt-3 text-4xl font-semibold">{view?.summary}</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {filteredCourts.map((court) => (
                <div className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-6" key={court.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg uppercase tracking-[0.25em] text-slate-500">{court.sport}</p>
                      <h3 className="display-heading mt-2 text-3xl font-semibold">{court.name}</h3>
                    </div>
                    <div className={`rounded-full px-4 py-2 text-sm font-semibold ${statusTheme[court.status]}`}>
                      {court.status.replace("_", " ")}
                    </div>
                  </div>
                  <p className="mt-8 text-lg text-slate-300">Next slot</p>
                  <p className="display-heading mt-2 text-4xl font-semibold">{court.nextSlot}</p>
                  <p className="mt-4 text-xl text-slate-400">{court.countdown}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </AnimatePresence>

        <div className="mt-8 overflow-hidden rounded-full border border-slate-800 bg-slate-900/70 py-4">
          <div className="ticker whitespace-nowrap text-lg text-slate-200">{displayTicker}</div>
        </div>
      </div>
    </div>
  );
}
