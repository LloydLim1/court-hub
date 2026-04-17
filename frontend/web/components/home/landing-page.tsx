import Link from "next/link";
import type { Route } from "next";

import { formatCurrency, marketplaceVendors } from "@courthub/domain";

import { getRoleHome } from "../../lib/auth";
import { AvailabilityBrowser } from "../booking/availability-browser";

export function LandingPage({
  role,
  userName,
}: {
  role: string | null;
  userName: string | null;
}) {
  return (
    <div className="page-shell">
      <section className="hero-panel overflow-hidden">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow text-blue-700">CourtHub Marketplace</p>
            <h1 className="display-heading mt-4 text-5xl font-semibold leading-tight text-slate-950 md:text-6xl">
              Book sports courts with live availability and venue-grade scheduling.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              CourtHub now works like a real marketplace: players discover venues and reserve open slots,
              while admins manage their courts from a cleaner operations view.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="primary-button" href={(role ? getRoleHome(role) : "/signup") as Route}>
                {role ? `Continue as ${userName ?? "guest"}` : "Create account"}
              </Link>
              <Link className="secondary-button" href={(role ? getRoleHome(role) : "/login") as Route}>
                {role ? "Open dashboard" : "Log in"}
              </Link>
            </div>
          </div>

          <div className="grid w-full gap-4 md:grid-cols-3 lg:max-w-xl">
            <div className="stat-card">
              <span>Multi-vendor</span>
              <strong>3 live demos</strong>
              <p>Venue operators can manage independent courts inside one shared system.</p>
            </div>
            <div className="stat-card">
              <span>Buffers</span>
              <strong>10-15 min</strong>
              <p>Availability respects changeover logic instead of fake empty slots.</p>
            </div>
            <div className="stat-card">
              <span>Starting at</span>
              <strong>{formatCurrency(400)}</strong>
              <p>Social and club sessions across pickleball, badminton, volleyball, and basketball.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <AvailabilityBrowser
          mode="public"
          title="Search available schedules"
          description="Pick a sport, compare vendors, and see which slots are still genuinely open after court buffers and active reservations."
        />

        <div className="space-y-6">
          <div className="surface-card p-6">
            <p className="eyebrow text-blue-700">What changed</p>
            <h2 className="display-heading mt-3 text-3xl font-semibold text-slate-950">
              Better logic. Better structure. Better product feel.
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
              <li>Frontend, backend, mobile, and shared TypeScript are now being split more clearly.</li>
              <li>The app now has real user and admin entry points instead of a login wall first.</li>
              <li>Booking focuses on live availability search instead of forcing everyone into an ops wizard.</li>
            </ul>
          </div>

          <div className="surface-card p-6">
            <p className="eyebrow text-blue-700">Featured venues</p>
            <div className="mt-5 space-y-4">
              {marketplaceVendors.map((vendor) => (
                <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5" key={vendor.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">{vendor.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {vendor.city} • {vendor.district}
                      </p>
                    </div>
                    <span className="pill-chip">{vendor.rating.toFixed(1)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{vendor.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {vendor.amenities.slice(0, 3).map((amenity) => (
                      <span className="soft-chip" key={amenity}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
