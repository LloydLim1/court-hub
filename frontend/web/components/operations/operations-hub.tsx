"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Route } from "next";
import { CalendarClock, ClipboardList, FlagTriangleRight, Zap } from "lucide-react";

import { AnimatedPage } from "../motion/animated-page";
import { SportCourtVisual } from "../courts/sport-court-visual";
import { ReservationCalendar } from "../calendar/reservation-calendar";
import {
  facilityCourts,
  getReservationWindowLabel,
} from "../../lib/facility-data";
import { useReservationsStore } from "../../lib/reservations-store";
import { currency } from "../../lib/utils";

const statusPill = {
  confirmed: "bg-sky-500/12 text-sky-200",
  checked_in: "bg-emerald-500/12 text-emerald-200",
  grace_period: "bg-amber-500/12 text-amber-200",
  no_show: "bg-rose-500/12 text-rose-200",
  pending: "bg-slate-500/12 text-slate-200",
};

export function OperationsHub() {
  const reservations = useReservationsStore((state) => state.reservations);
  const liveSessions = reservations.filter((reservation) =>
    ["checked_in", "grace_period"].includes(reservation.status),
  ).length;
  const pendingSessions = reservations.filter((reservation) => reservation.status === "pending").length;
  const noShowRisk = reservations.filter((reservation) => reservation.status === "grace_period").length;
  const totalRevenue = reservations.reduce((total, reservation) => {
    const court = facilityCourts.find((item) => item.id === reservation.courtId);
    return total + (court?.basePrice ?? 0);
  }, 0);

  return (
    <AnimatedPage className="space-y-8">
      <section className="scoreboard-panel rounded-[36px] p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Operations Arena</p>
            <h1 className="display-heading mt-4 max-w-4xl text-4xl font-semibold text-white md:text-5xl">
              Run every court like a live matchday control room
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Track reservations by court, react to grace-period risk, and jump into scheduling without leaving the floor operations view.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100">
              Live control active
            </div>
            <div className="rounded-[24px] border border-sky-400/20 bg-sky-500/10 px-4 py-4 text-sm text-sky-100">
              Court-aware schedule
            </div>
            <div className="rounded-[24px] border border-amber-400/20 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
              Grace period alerts ready
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Projected Revenue", value: currency(totalRevenue), accent: "emerald" },
          { label: "Live / Grace Sessions", value: `${liveSessions}`, accent: "sky" },
          { label: "Pending Bookings", value: `${pendingSessions}`, accent: "amber" },
          { label: "No-Show Watch", value: `${noShowRisk}`, accent: "rose" },
        ].map((card) => (
          <div className="glass-card rounded-[30px] p-5" key={card.label}>
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="display-heading mt-5 text-4xl font-semibold text-white">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card rounded-[34px] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-sky-300">Quick Actions</p>
              <h2 className="display-heading mt-3 text-3xl font-semibold text-white">Move straight into the shift flow</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { href: "/bookings/new", icon: Zap, title: "Create Booking", text: "Reserve a slot, add gear, and confirm payment." },
              { href: "/operations/calendar", icon: CalendarClock, title: "Open Calendar", text: "See every reservation across the court timeline." },
              { href: "/operations/check-in", icon: FlagTriangleRight, title: "Check-In Flow", text: "Handle arrivals and grace-period escalations." },
              { href: "/operations/today", icon: ClipboardList, title: "Today’s List", text: "Review the full shift queue and payment status." },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  className="rounded-[28px] border border-slate-800 bg-slate-950/60 p-5 transition hover:border-slate-700"
                  href={action.href as Route}
                  key={action.title}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-sky-500/12 p-3 text-sky-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{action.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{action.text}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-[34px] p-6">
          <p className="text-xs uppercase tracking-[0.32em] text-amber-300">Live Activity</p>
          <div className="mt-5 space-y-3">
            {reservations.slice(-5).reverse().map((reservation) => (
              <motion.div
                animate={{
                  backgroundColor:
                    reservation.status === "grace_period"
                      ? ["rgba(127,29,29,0.30)", "rgba(153,27,27,0.50)", "rgba(127,29,29,0.30)"]
                      : "rgba(2,6,23,0.55)",
                }}
                className="rounded-[24px] border border-slate-800 p-4"
                key={reservation.id}
                transition={reservation.status === "grace_period" ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY } : undefined}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{reservation.customerName}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {reservation.courtName} • {getReservationWindowLabel(reservation)}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs ${statusPill[reservation.status]}`}>
                    {reservation.status.replace("_", " ")}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {facilityCourts.map((court) => {
          const courtReservations = reservations.filter((reservation) => reservation.courtId === court.id);
          const nextReservation = courtReservations[0];
          return (
            <div className="glass-card rounded-[34px] p-5" key={court.id}>
              <div className="grid gap-4 lg:grid-cols-[1.2fr_180px] lg:items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-slate-500">{court.surface}</p>
                  <h3 className="display-heading mt-2 text-2xl font-semibold text-white">{court.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {nextReservation
                      ? `${nextReservation.customerName} is on the board for ${getReservationWindowLabel(nextReservation)}.`
                      : "No confirmed booking yet. This court is open for new reservations."}
                  </p>
                </div>
                <SportCourtVisual className="h-32 w-full" sport={court.sport} />
              </div>
            </div>
          );
        })}
      </section>

      <ReservationCalendar reservations={reservations} />
    </AnimatedPage>
  );
}
