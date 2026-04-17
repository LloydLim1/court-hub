"use client";

import { useMemo } from "react";

import {
  formatCurrency,
  formatTimeRangeLabel,
  getCourtById,
  getVendorById,
  marketplaceVendors,
} from "@courthub/domain";

import { getDefaultDemoAccount } from "../../lib/auth";
import { usePlatformStore } from "../../lib/platform-store";
import { AvailabilityBrowser } from "../booking/availability-browser";

export function UserDashboard({ userName }: { userName: string }) {
  const reservations = usePlatformStore((state) => state.reservations);
  const upcomingReservations = useMemo(
    () =>
      reservations.filter((reservation) => reservation.userId === getDefaultDemoAccount("user").id).slice(0, 3),
    [reservations],
  );

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow text-blue-700">Player Dashboard</p>
        <h1 className="display-heading mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">
          {userName}, your next session starts with the best open slot.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          Review upcoming reservations, then search more venues without leaving the booking flow.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card p-6">
          <p className="eyebrow text-blue-700">Upcoming reservations</p>
          <div className="mt-5 grid gap-4">
            {upcomingReservations.map((reservation) => {
              const court = getCourtById(reservation.courtId);
              const vendor = getVendorById(reservation.vendorId);
              return (
                <div className="result-card" key={reservation.id}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-950">{court?.name ?? reservation.title}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {vendor?.name} • {formatTimeRangeLabel(reservation.start, reservation.end)}
                      </p>
                    </div>
                    <span className="pill-chip">{reservation.status.replace("_", " ")}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="soft-chip">{reservation.partySize} players</span>
                    <span className="soft-chip">{court?.sport ?? "sport"}</span>
                    <span className="soft-chip">
                      {court ? formatCurrency(court.pricePerHour) : formatCurrency(0)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="surface-card p-6">
          <p className="eyebrow text-blue-700">Trending venues</p>
          <div className="mt-5 space-y-4">
            {marketplaceVendors.map((vendor) => (
              <div className="rounded-3xl border border-slate-200 bg-white/90 p-5" key={vendor.id}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{vendor.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {vendor.city} • from {formatCurrency(vendor.startingPrice)}
                    </p>
                  </div>
                  <span className="pill-chip">{vendor.rating.toFixed(1)}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{vendor.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AvailabilityBrowser
        description="Choose a sport, compare venues, and reserve any slot still open after vendor buffers and existing bookings."
        mode="user"
        title="Book another court"
      />
    </div>
  );
}
