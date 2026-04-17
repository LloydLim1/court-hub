"use client";

import { motion } from "framer-motion";
import { CalendarRange, CreditCard, QrCode, ShieldCheck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

import { SPORT_SPECS } from "@courthub/domain";

import { ReservationCalendar } from "../calendar/reservation-calendar";
import { SportCourtVisual } from "../courts/sport-court-visual";
import {
  activeScheduleDate,
  getReservationWindowLabel,
  getSportAddOns,
  getSportBundle,
  getSportCourts,
} from "../../lib/facility-data";
import { useBookingStore } from "../../lib/booking-store";
import { useReservationsStore } from "../../lib/reservations-store";
import { useUiStore } from "../../lib/ui-store";
import { currency } from "../../lib/utils";
import { SuccessCheckmark } from "./success-checkmark";

const steps = [
  { label: "Inquiry", icon: ShieldCheck },
  { label: "Details", icon: UserRound },
  { label: "Equipment", icon: CalendarRange },
  { label: "Payment", icon: CreditCard },
  { label: "Confirmation", icon: QrCode },
];

export function BookingWizard() {
  const pushToast = useUiStore((state) => state.pushToast);
  const reservations = useReservationsStore((state) => state.reservations);
  const createReservation = useReservationsStore((state) => state.createReservation);
  const {
    activeStep,
    sport,
    channel,
    customerName,
    phone,
    partySize,
    selectedBundleId,
    selectedAddOnIds,
    paymentProofReady,
    selectedCourtId,
    selectedStart,
    selectedEnd,
    setField,
    setSport,
    selectSchedule,
    toggleAddOn,
    next,
    previous,
    reset,
  } = useBookingStore();
  const [shake, setShake] = useState(false);
  const [createdReservationId, setCreatedReservationId] = useState<string | null>(null);

  const selectedSport = SPORT_SPECS[sport];
  const sportBundle = getSportBundle(sport);
  const selectedBundle = selectedBundleId === sportBundle?.id ? sportBundle : null;
  const sportAddOns = getSportAddOns(sport);
  const selectedCourt = getSportCourts(sport).find((court) => court.id === selectedCourtId) ?? null;
  const selectedReservation = reservations.find((reservation) => reservation.id === createdReservationId) ?? null;
  const addOnTotal = sportAddOns
    .filter((item) => selectedAddOnIds.includes(item.id))
    .reduce((total, item) => total + item.price, 0);
  const totalAmount = selectedSport.basePrice + (selectedBundle?.rentalPrice ?? 0) + addOnTotal;
  const progress = ((activeStep + 1) / steps.length) * 100;

  const qrReference = useMemo(
    () => `CH-${Date.now().toString().slice(-8)}`,
    [activeStep, createdReservationId],
  );

  const continueFlow = () => {
    if (activeStep === 0 && (!selectedCourtId || !selectedStart || !selectedEnd)) {
      setShake(true);
      pushToast({
        title: "Pick a court and time first",
        description: "Select an available slot on the reservation calendar before continuing.",
        tone: "warning",
      });
      setTimeout(() => setShake(false), 350);
      return;
    }

    if (activeStep === 1 && (!customerName || !phone)) {
      setShake(true);
      pushToast({
        title: "Customer details incomplete",
        description: "Customer name and phone are required before continuing.",
        tone: "warning",
      });
      setTimeout(() => setShake(false), 350);
      return;
    }

    if (activeStep === 3 && !paymentProofReady) {
      pushToast({
        title: "Payment proof pending",
        description: "Mark the payment proof as received or manually verified first.",
        tone: "warning",
      });
      return;
    }

    if (activeStep === 3 && selectedCourtId && selectedStart && selectedEnd) {
      try {
        const reservation = createReservation({
          customerName,
          sport,
          courtId: selectedCourtId,
          start: selectedStart,
          end: selectedEnd,
          players: partySize,
          bundleId: selectedBundle?.id ?? null,
          addOnIds: selectedAddOnIds,
          source: channel,
        });
        setCreatedReservationId(reservation.id);
        pushToast({
          title: "Reservation added to calendar",
          description: `${reservation.courtName} is now booked for ${reservation.customerName}.`,
          tone: "success",
        });
      } catch (error) {
        pushToast({
          title: "Slot no longer available",
          description: error instanceof Error ? error.message : "Please choose another slot.",
          tone: "danger",
        });
        return;
      }
    }

    next();
  };

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[36px] p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Staff Booking Wizard</p>
            <h1 className="display-heading mt-4 max-w-4xl text-4xl font-semibold text-white md:text-5xl">
              Build a reservation from the real court schedule
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Choose a sport, reserve an actual time slot, add equipment and add-ons, then confirm the booking so it appears in the live operations calendar.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-100">
              Staff-assisted only
            </div>
            <div className="rounded-[24px] border border-sky-400/20 bg-sky-500/10 px-4 py-4 text-sm text-sky-100">
              No-show release at 15 minutes
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="h-2 rounded-full bg-slate-950/80">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-orange-400"
              transition={{ duration: 0.35 }}
            />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const active = index === activeStep;
              return (
                <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-4" key={step.label}>
                  <motion.div
                    animate={active ? { y: [0, -8, 0] } : { y: 0 }}
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${active ? "bg-emerald-300 text-slate-950" : "bg-slate-900 text-slate-300"}`}
                    transition={{ duration: 0.45 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>
                  <p className="mt-3 text-sm font-medium text-white">{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.55fr_0.85fr]">
        <div className={`glass-card rounded-[36px] p-6 md:p-8 ${shake ? "validation-shake" : ""}`}>
          {activeStep === 0 ? (
            <div className="space-y-8">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Step 1</p>
                <h2 className="display-heading mt-3 text-3xl font-semibold text-white">Choose the sport and the actual slot</h2>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                {Object.values(SPORT_SPECS).map((item) => (
                  <button
                    className={`rounded-[28px] border p-5 text-left transition ${
                      sport === item.sport
                        ? "border-emerald-300 bg-emerald-500/10 shadow-[0_24px_60px_rgba(34,197,94,0.12)]"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                    }`}
                    key={item.sport}
                    onClick={() => setSport(item.sport)}
                  >
                    <div className="grid gap-4 md:grid-cols-[1fr_132px] md:items-center">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.courtType} court</p>
                        <h3 className="mt-3 text-2xl font-semibold text-white">{item.label}</h3>
                        <p className="mt-2 text-sm text-slate-400">{currency(item.basePrice)} / hour • capacity {item.capacity}</p>
                      </div>
                      <SportCourtVisual className="h-28 w-full" sport={item.sport} />
                    </div>
                  </button>
                ))}
              </div>

              <ReservationCalendar
                onSelectSlot={({ courtId, start, end }) => selectSchedule(courtId, start, end)}
                reservations={reservations}
                selectable
                selectedCourtId={selectedCourtId}
                selectedEnd={selectedEnd}
                selectedStart={selectedStart}
              />
            </div>
          ) : null}

          {activeStep === 1 ? (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Step 2</p>
                <h2 className="display-heading mt-3 text-3xl font-semibold text-white">Capture customer and group details</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="input-base"
                  onChange={(event) => setField("customerName", event.target.value)}
                  placeholder="Customer or group name"
                  value={customerName}
                />
                <input
                  className="input-base"
                  onChange={(event) => setField("phone", event.target.value)}
                  placeholder="Phone number"
                  value={phone}
                />
                <select
                  className="input-base"
                  onChange={(event) => setField("channel", event.target.value as typeof channel)}
                  value={channel}
                >
                  <option value="facebook">Facebook inquiry</option>
                  <option value="instagram">Instagram inquiry</option>
                  <option value="viber">Viber inquiry</option>
                  <option value="walk_in">Walk-in</option>
                </select>
                <input
                  className="input-base"
                  max={selectedSport.capacity}
                  min={1}
                  onChange={(event) => setField("partySize", Number(event.target.value))}
                  type="number"
                  value={partySize}
                />
              </div>
              <div className="rounded-[26px] border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-300">
                Customers flagged with 3 or more no-shows should be pushed to advance payment before confirmation.
              </div>
            </div>
          ) : null}

          {activeStep === 2 ? (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Step 3</p>
                <h2 className="display-heading mt-3 text-3xl font-semibold text-white">Choose bundle, equipment, and add-ons</h2>
              </div>
              {selectedBundle ? (
                <button
                  className="w-full rounded-[28px] border border-emerald-300 bg-emerald-500/10 p-5 text-left"
                  onClick={() => setField("selectedBundleId", selectedBundle.id)}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{selectedBundle.name}</h3>
                      <p className="mt-2 text-sm text-slate-300">{selectedBundle.includedItems.join(", ")}</p>
                    </div>
                    <p className="text-base font-semibold text-emerald-200">{currency(selectedBundle.rentalPrice)}</p>
                  </div>
                </button>
              ) : null}

              <div className="grid gap-4 xl:grid-cols-2">
                {sportAddOns.map((item) => {
                  const active = selectedAddOnIds.includes(item.id);
                  return (
                    <button
                      className={`rounded-[26px] border p-5 text-left transition ${
                        active
                          ? "border-sky-300 bg-sky-500/10"
                          : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                      }`}
                      key={item.id}
                      onClick={() => toggleAddOn(item.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                        </div>
                        <span className="rounded-full bg-slate-950/80 px-3 py-1 text-sm text-slate-200">
                          {currency(item.price)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {activeStep === 3 ? (
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Step 4</p>
                <h2 className="display-heading mt-3 text-3xl font-semibold text-white">Generate payment and verify proof</h2>
              </div>
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(56,189,248,0.12)",
                    "0 0 36px rgba(56,189,248,0.28)",
                    "0 0 0 rgba(56,189,248,0.12)",
                  ],
                  scale: [1, 1.03, 1],
                }}
                className="rounded-[30px] border border-sky-400/30 bg-sky-500/8 p-6"
                transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_132px] lg:items-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Generated payment QR</p>
                    <h3 className="mt-3 text-3xl font-semibold text-white">{qrReference}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Staff can send this reference via GCash, Maya, or bank transfer and verify the uploaded proof before final confirmation.
                    </p>
                  </div>
                  <div className="rounded-[28px] border border-slate-800 bg-slate-950/70 p-5">
                    <QrCode className="h-24 w-24 text-sky-300" />
                  </div>
                </div>
              </motion.div>
              <label className="flex items-center gap-3 rounded-[24px] border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
                <input
                  checked={paymentProofReady}
                  onChange={(event) => setField("paymentProofReady", event.target.checked)}
                  type="checkbox"
                />
                Payment proof uploaded and verified by OCR or staff review
              </label>
            </div>
          ) : null}

          {activeStep === 4 ? (
            <div className="space-y-6">
              <SuccessCheckmark />
              <div className="text-center">
                <h2 className="display-heading text-3xl font-semibold text-white">Reservation confirmed and added to the board</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  The booking is now visible in the shared calendar, the selected court is blocked for the chosen time, and the front desk can continue with check-in and equipment handoff.
                </p>
              </div>
              {selectedReservation ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Court</p>
                    <p className="mt-3 text-xl font-semibold text-white">{selectedReservation.courtName}</p>
                  </div>
                  <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Window</p>
                    <p className="mt-3 text-xl font-semibold text-white">{getReservationWindowLabel(selectedReservation)}</p>
                  </div>
                  <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total</p>
                    <p className="mt-3 text-xl font-semibold text-white">{currency(totalAmount)}</p>
                  </div>
                </div>
              ) : null}
              <button
                className="rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-200"
                onClick={() => {
                  setCreatedReservationId(null);
                  reset();
                  pushToast({
                    title: "Wizard reset",
                    description: "Ready for the next booking intake.",
                    tone: "info",
                  });
                }}
              >
                Start another booking
              </button>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              className="rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-200"
              disabled={activeStep === 0}
              onClick={previous}
            >
              Back
            </button>
            {activeStep < 4 ? (
              <button
                className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-medium text-slate-950"
                onClick={continueFlow}
              >
                Continue
              </button>
            ) : null}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="glass-card rounded-[32px] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Reservation Snapshot</p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Sport</span>
                <span>{selectedSport.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Court</span>
                <span>{selectedCourt?.name ?? "Select a slot"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>When</span>
                <span>{selectedStart && selectedEnd ? `${new Date(selectedStart).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" })} - ${new Date(selectedEnd).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" })}` : "Select a slot"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Bundle</span>
                <span>{selectedBundle ? currency(selectedBundle.rentalPrice) : "None"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Add-ons</span>
                <span>{selectedAddOnIds.length}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-base font-semibold text-white">
                <span>Total</span>
                <span>{currency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[32px] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Selected Sport Visual</p>
            <SportCourtVisual className="mt-4 h-44 w-full" sport={sport} />
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {selectedSport.label} bookings use the {selectedSport.courtType} configuration, pricing, and equipment rules for this sport.
            </p>
          </div>

          <div className="glass-card rounded-[32px] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Business Rules</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>Bookings are only accepted through staff-assisted intake.</li>
              <li>Full courts allow a single reservation; divided sports use courts A, B, and C.</li>
              <li>Calendar selection prevents overlapping court reservations.</li>
              <li>No-show release happens automatically if check-in never occurs within the grace window.</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
