"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import type { SportType } from "@courthub/domain";

import {
  activeScheduleDate,
  facilityCourts,
  formatTimelineTime,
  getReservationWindowLabel,
  timelineHours,
  type FacilityReservation,
} from "../../lib/facility-data";
import { cn } from "../../lib/utils";

const hourWidth = 108;
const leftRail = 180;

const statusStyles = {
  confirmed: "bg-sky-500/18 border-sky-300/35 text-sky-100",
  checked_in: "bg-emerald-500/18 border-emerald-300/35 text-emerald-100",
  grace_period: "bg-amber-500/18 border-amber-300/35 text-amber-100",
  no_show: "bg-rose-500/18 border-rose-300/35 text-rose-100",
  pending: "bg-slate-500/18 border-slate-300/35 text-slate-100",
};

export function ReservationCalendar({
  reservations,
  selectable = false,
  selectedCourtId,
  selectedStart,
  selectedEnd,
  onSelectSlot,
}: {
  reservations: FacilityReservation[];
  selectable?: boolean;
  selectedCourtId?: string | null;
  selectedStart?: string | null;
  selectedEnd?: string | null;
  onSelectSlot?: (payload: { courtId: string; start: string; end: string }) => void;
}) {
  const [sportFilter, setSportFilter] = useState<SportType | "all">("all");
  const filteredCourts = useMemo(
    () => facilityCourts.filter((court) => sportFilter === "all" || court.sport === sportFilter),
    [sportFilter],
  );

  const startBoundary = timelineHours[0] * 60;

  return (
    <div className="glass-card rounded-[32px] p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-sky-300">Reservation Calendar</p>
          <h2 className="display-heading mt-3 text-3xl font-semibold text-white">Live day view by court</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Every confirmed reservation appears on the timeline, and available slots can be selected directly for new bookings.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "basketball", "volleyball", "pickleball", "badminton"] as const).map((filter) => (
            <button
              className={cn(
                "rounded-full px-4 py-2 text-sm transition",
                sportFilter === filter
                  ? "bg-sky-400 text-slate-950"
                  : "border border-slate-700 bg-slate-950/70 text-slate-300",
              )}
              key={filter}
              onClick={() => setSportFilter(filter)}
            >
              {filter === "all" ? "All courts" : filter}
            </button>
          ))}
        </div>
      </div>

      <div className="soft-scroll mt-8 overflow-x-auto pb-2">
        <div style={{ minWidth: leftRail + timelineHours.length * hourWidth }}>
          <div className="mb-3 flex items-center">
            <div className="pr-4 text-xs uppercase tracking-[0.3em] text-slate-500" style={{ width: leftRail }}>
              Courts
            </div>
            {timelineHours.map((hour) => (
              <div className="px-2 text-xs uppercase tracking-[0.25em] text-slate-500" key={hour} style={{ width: hourWidth }}>
                {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {filteredCourts.map((court) => {
              const courtReservations = reservations.filter((reservation) => reservation.courtId === court.id);
              return (
                <div className="flex gap-4" key={court.id}>
                  <div className="rounded-[24px] border border-slate-800 bg-slate-950/70 p-4" style={{ width: leftRail }}>
                    <p className="text-sm font-semibold text-white">{court.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">{court.label}</p>
                  </div>

                  <div className="relative rounded-[26px] border border-slate-800 bg-slate-950/60" style={{ width: timelineHours.length * hourWidth }}>
                    <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${timelineHours.length}, ${hourWidth}px)` }}>
                      {timelineHours.map((hour) => (
                        <div className="border-l border-slate-800/80 first:border-l-0" key={`${court.id}-${hour}`}>
                          <div className="h-full bg-[linear-gradient(180deg,rgba(15,23,42,0.22),rgba(15,23,42,0.06))]" />
                        </div>
                      ))}
                    </div>

                    {selectable ? (
                      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${timelineHours.length * 2}, ${hourWidth / 2}px)` }}>
                        {timelineHours.flatMap((hour) =>
                          [0, 30].map((minute) => {
                            const start = new Date(`${activeScheduleDate}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+08:00`);
                            const end = new Date(start.getTime() + 60 * 60_000);
                            const startIso = start.toISOString();
                            const endIso = end.toISOString();
                            const occupied = reservations.some(
                              (reservation) =>
                                reservation.courtId === court.id &&
                                new Date(startIso).getTime() < new Date(reservation.end).getTime() &&
                                new Date(endIso).getTime() > new Date(reservation.start).getTime(),
                            );
                            const isSelected =
                              selectedCourtId === court.id &&
                              selectedStart === startIso &&
                              selectedEnd === endIso;

                            return (
                              <button
                                className={cn(
                                  "relative border-l border-slate-900/40 first:border-l-0 transition",
                                  occupied ? "cursor-not-allowed bg-transparent" : "hover:bg-sky-500/8",
                                  isSelected ? "bg-sky-400/12" : "",
                                )}
                                disabled={occupied}
                                key={`${court.id}-${hour}-${minute}`}
                                onClick={() => onSelectSlot?.({ courtId: court.id, start: startIso, end: endIso })}
                              >
                                {isSelected ? (
                                  <motion.div
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-1 rounded-[18px] border border-sky-300/40"
                                    initial={{ opacity: 0, scale: 0.94 }}
                                  />
                                ) : null}
                              </button>
                            );
                          }),
                        )}
                      </div>
                    ) : null}

                    <div className="relative h-[112px]">
                      {courtReservations.map((reservation) => {
                        const start = new Date(reservation.start);
                        const end = new Date(reservation.end);
                        const minutesFromStart = start.getHours() * 60 + start.getMinutes() - startBoundary;
                        const durationMinutes = (end.getTime() - start.getTime()) / 60_000;
                        const left = (minutesFromStart / 60) * hourWidth;
                        const width = (durationMinutes / 60) * hourWidth;

                        return (
                          <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "absolute top-3 overflow-hidden rounded-[22px] border px-4 py-3 text-left shadow-[0_16px_32px_rgba(2,6,23,0.24)]",
                              statusStyles[reservation.status],
                            )}
                            initial={{ opacity: 0, y: 10 }}
                            key={reservation.id}
                            style={{ left, width: Math.max(width, 112) }}
                          >
                            <p className="text-sm font-semibold">{reservation.customerName}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] opacity-80">
                              {getReservationWindowLabel(reservation)}
                            </p>
                            <p className="mt-2 text-xs opacity-80">
                              {reservation.players} players • {reservation.status.replace("_", " ")}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedCourtId && selectedStart && selectedEnd ? (
        <div className="mt-6 rounded-[24px] border border-sky-400/30 bg-sky-500/10 px-5 py-4 text-sm text-sky-100">
          Selected slot: {facilityCourts.find((court) => court.id === selectedCourtId)?.name} •{" "}
          {formatTimelineTime(selectedStart)} - {formatTimelineTime(selectedEnd)}
        </div>
      ) : null}
    </div>
  );
}
