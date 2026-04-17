"use client";

import { useMemo, useState } from "react";

import {
  buildSlotAvailability,
  formatTimeRangeLabel,
  getVendorById,
  type SportType,
} from "@courthub/domain";

import { usePlatformStore } from "../../lib/platform-store";
import { useUiStore } from "../../lib/ui-store";

export function AdminScheduleBoard({ vendorId }: { vendorId: string }) {
  const pushToast = useUiStore((state) => state.pushToast);
  const { courts, reservations, filters, updateReservationStatus, createManagedCourt } = usePlatformStore();
  const [name, setName] = useState("");
  const [sport, setSport] = useState<SportType>("pickleball");
  const [pricePerHour, setPricePerHour] = useState(500);
  const [capacity, setCapacity] = useState(4);

  const vendor = getVendorById(vendorId);
  const managedCourts = useMemo(
    () => courts.filter((court) => court.vendorId === vendorId),
    [courts, vendorId],
  );
  const managedReservations = useMemo(
    () => reservations.filter((reservation) => reservation.vendorId === vendorId && reservation.date === filters.date),
    [filters.date, reservations, vendorId],
  );

  const createCourt = () => {
    if (!name.trim()) {
      pushToast({
        title: "Court name required",
        description: "Give the managed court a name before saving it.",
        tone: "warning",
      });
      return;
    }

    createManagedCourt({
      vendorId,
      name,
      sport,
      pricePerHour,
      capacity,
    });
    pushToast({
      title: "Court created",
      description: "The new managed court is now part of this vendor workspace.",
      tone: "success",
    });
    setName("");
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="surface-card p-6">
        <p className="eyebrow text-blue-700">Venue schedule</p>
        <h2 className="display-heading mt-3 text-3xl font-semibold text-slate-950">
          {vendor?.name ?? "Managed venue"} on {filters.date}
        </h2>
        <div className="mt-6 grid gap-4">
          {managedCourts.map((court) => {
            const courtReservations = managedReservations.filter((reservation) => reservation.courtId === court.id);
            const openSlots = buildSlotAvailability(court, courtReservations, filters.date, filters.durationMinutes)
              .filter((slot) => slot.available)
              .slice(0, 4);

            return (
              <div className="result-card" key={court.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{court.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {court.sport} • {court.capacity} players • PHP {court.pricePerHour}/hr
                    </p>
                  </div>
                  <span className="pill-chip">{courtReservations.length} bookings</span>
                </div>

                <div className="mt-4 grid gap-3">
                  {courtReservations.length ? (
                    courtReservations.map((reservation) => (
                      <div className="rounded-3xl border border-slate-200 bg-white/90 p-4" key={reservation.id}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-950">{reservation.title}</p>
                            <p className="mt-1 text-sm text-slate-500">
                              {formatTimeRangeLabel(reservation.start, reservation.end)}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="soft-chip"
                              onClick={() => updateReservationStatus(reservation.id, "checked_in")}
                            >
                              Check in
                            </button>
                            <button
                              className="soft-chip"
                              onClick={() => updateReservationStatus(reservation.id, "completed")}
                            >
                              Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No bookings yet for this court on the selected date.</p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {openSlots.map((slot) => (
                    <span className="slot-chip slot-chip-static" key={slot.start}>
                      {slot.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <div className="surface-card p-6">
          <p className="eyebrow text-blue-700">Overview</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="stat-card">
              <span>Courts</span>
              <strong>{managedCourts.length}</strong>
              <p>Actively managed in this vendor workspace.</p>
            </div>
            <div className="stat-card">
              <span>Bookings today</span>
              <strong>{managedReservations.length}</strong>
              <p>Live reservations and schedule holds on the selected day.</p>
            </div>
          </div>
        </div>

        <div className="surface-card p-6">
          <p className="eyebrow text-blue-700">Add a managed court</p>
          <div className="mt-5 space-y-4">
            <div>
              <label className="field-label">Court name</label>
              <input className="field-input" onChange={(event) => setName(event.target.value)} value={name} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Sport</label>
                <select
                  className="field-input"
                  onChange={(event) => setSport(event.target.value as SportType)}
                  value={sport}
                >
                  <option value="basketball">Basketball</option>
                  <option value="volleyball">Volleyball</option>
                  <option value="pickleball">Pickleball</option>
                  <option value="badminton">Badminton</option>
                </select>
              </div>
              <div>
                <label className="field-label">Capacity</label>
                <input
                  className="field-input"
                  onChange={(event) => setCapacity(Number(event.target.value))}
                  type="number"
                  value={capacity}
                />
              </div>
            </div>
            <div>
              <label className="field-label">Price per hour</label>
              <input
                className="field-input"
                onChange={(event) => setPricePerHour(Number(event.target.value))}
                type="number"
                value={pricePerHour}
              />
            </div>
            <button className="primary-button w-full justify-center" onClick={createCourt}>
              Save managed court
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
