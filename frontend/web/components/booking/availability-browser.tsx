"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, TimerReset } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import {
  formatCurrency,
  getMarketplaceSearchResults,
  type PlatformRole,
  type SportType,
} from "@courthub/domain";

import { getDefaultDemoAccount } from "../../lib/auth";
import { usePlatformStore } from "../../lib/platform-store";
import { useUiStore } from "../../lib/ui-store";

const durationOptions = [60, 90, 120];

export function AvailabilityBrowser({
  description,
  mode,
  title,
}: {
  title: string;
  description: string;
  mode: "public" | PlatformRole;
}) {
  const router = useRouter();
  const pushToast = useUiStore((state) => state.pushToast);
  const { filters, reservations, setFilters, createReservation } = usePlatformStore();

  const results = useMemo(
    () => getMarketplaceSearchResults(filters, reservations),
    [filters, reservations],
  );

  const reserveSlot = (payload: {
    vendorId: string;
    courtId: string;
    start: string;
    end: string;
    partySize: number;
  }) => {
    if (mode === "public") {
      pushToast({
        title: "Log in to finish the reservation",
        description: "You can browse all open slots first, then sign in when you are ready to confirm.",
        tone: "info",
      });
      router.push("/login" as Route);
      return;
    }

    try {
      createReservation({
        ...payload,
        userId: getDefaultDemoAccount(mode).id,
        date: filters.date,
        title: mode === "admin" ? "Admin schedule hold" : "Court booking",
        status: mode === "admin" ? "blocked" : "confirmed",
      });
      pushToast({
        title: mode === "admin" ? "Schedule hold created" : "Reservation confirmed",
        description:
          mode === "admin"
            ? "The slot is now blocked in the live venue schedule."
            : "The slot has been added to your dashboard.",
        tone: "success",
      });
      if (mode === "user") {
        router.push("/dashboard" as Route);
      }
    } catch (error) {
      pushToast({
        title: "That slot is no longer available",
        description: error instanceof Error ? error.message : "Please choose another slot.",
        tone: "danger",
      });
    }
  };

  return (
    <section className="surface-card p-6 md:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="eyebrow text-blue-700">Live availability</p>
          <h2 className="display-heading mt-3 text-3xl font-semibold text-slate-950 md:text-4xl">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
        </div>
        <div className="rounded-3xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-900">
          Search stays synced to vendor hours, court buffers, and existing reservations.
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[1.1fr_0.9fr_0.8fr]">
        <div>
          <label className="field-label">Sport</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["basketball", "volleyball", "pickleball", "badminton"] as SportType[]).map((sport) => (
              <button
                className={filters.sport === sport ? "pill-chip pill-chip-active" : "pill-chip"}
                key={sport}
                onClick={() => setFilters({ sport })}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="field-label">Date</label>
          <input
            className="field-input mt-2"
            onChange={(event) => setFilters({ date: event.target.value })}
            type="date"
            value={filters.date}
          />
        </div>
        <div>
          <label className="field-label">Duration</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {durationOptions.map((minutes) => (
              <button
                className={filters.durationMinutes === minutes ? "pill-chip pill-chip-active" : "pill-chip"}
                key={minutes}
                onClick={() => setFilters({ durationMinutes: minutes })}
              >
                {minutes} min
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {results.map((result, index) => (
          <motion.article
            animate={{ opacity: 1, y: 0 }}
            className="result-card"
            initial={{ opacity: 0, y: 16 }}
            key={result.court.id}
            transition={{ delay: index * 0.04, duration: 0.24 }}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="soft-chip">{result.court.sport}</span>
                  <span className="soft-chip">{result.court.capacity} players</span>
                  <span className="soft-chip">{result.vendor.rating.toFixed(1)} stars</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-slate-950">{result.court.name}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {result.vendor.name} • {result.vendor.city}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {result.vendor.tagline}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <TimerReset className="h-4 w-4" />
                    {result.court.bufferMinutes} min buffer
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{result.vendor.description}</p>
              </div>

              <div className="w-full rounded-3xl border border-slate-200 bg-slate-50/80 p-5 lg:max-w-sm">
                <p className="text-sm font-semibold text-slate-950">
                  {formatCurrency(result.court.pricePerHour)} / hour
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Next open: {result.nextOpenLabel ?? "No clean slot left today"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.availableSlots.length ? (
                    result.availableSlots.map((slot) => (
                      <button
                        className="slot-chip"
                        key={`${result.court.id}-${slot.start}`}
                        onClick={() =>
                          reserveSlot({
                            vendorId: result.vendor.id,
                            courtId: result.court.id,
                            start: slot.start,
                            end: slot.end,
                            partySize: result.court.capacity,
                          })
                        }
                      >
                        {slot.label}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No clean slot remains for this search. Try another duration.</p>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
