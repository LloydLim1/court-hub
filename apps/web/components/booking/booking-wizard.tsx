"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreditCard, QrCode, ShieldCheck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

import { SPORT_SPECS } from "@courthub/domain";

import { useBookingStore } from "../../lib/booking-store";
import { getBundlesBySport } from "../../lib/mock-data";
import { useUiStore } from "../../lib/ui-store";
import { currency } from "../../lib/utils";
import { SuccessCheckmark } from "./success-checkmark";

const steps = [
  { label: "Inquiry", icon: ShieldCheck },
  { label: "Details", icon: UserRound },
  { label: "Equipment", icon: ShieldCheck },
  { label: "Payment", icon: CreditCard },
  { label: "Confirmation", icon: QrCode },
];

export function BookingWizard() {
  const pushToast = useUiStore((state) => state.pushToast);
  const {
    activeStep,
    sport,
    channel,
    customerName,
    phone,
    selectedBundleId,
    paymentProofReady,
    setField,
    next,
    previous,
    reset,
  } = useBookingStore();
  const [shake, setShake] = useState(false);
  const bundleQuery = useQuery({
    queryKey: ["bundles", sport],
    queryFn: () => getBundlesBySport(sport),
  });

  const selectedSport = SPORT_SPECS[sport];
  const selectedBundle = bundleQuery.data?.find((bundle) => bundle.id === selectedBundleId) ?? null;
  const totalAmount = selectedSport.basePrice + (selectedBundle?.rentalPrice ?? 0);
  const progress = ((activeStep + 1) / steps.length) * 100;

  const qrReference = useMemo(() => `CH-${Date.now().toString().slice(-8)}`, [activeStep]);

  const continueFlow = () => {
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

    next();

    if (activeStep === 3) {
      pushToast({
        title: "Booking confirmed",
        description: "Entry QR code issued and ready to send or print.",
        tone: "success",
      });
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[32px] p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-300">Staff Booking Wizard</p>
            <h1 className="display-heading mt-4 text-4xl font-semibold text-white">Create a booking in five controlled steps</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              CourtHub only allows staff-assisted intake through social media or walk-in requests. Each step enforces conflict rules, equipment checks, and payment verification.
            </p>
          </div>
          <div className="glass-card rounded-[24px] px-4 py-3 text-sm text-slate-300">
            No-show release: 15 minutes after start
          </div>
        </div>

        <div className="mt-8">
          <div className="h-2 rounded-full bg-slate-900">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-2 rounded-full bg-sky-400"
              transition={{ duration: 0.35 }}
            />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const active = index === activeStep;
              return (
                <div className="rounded-[22px] border border-slate-800 bg-slate-950/50 p-4" key={step.label}>
                  <motion.div
                    animate={active ? { y: [0, -8, 0] } : { y: 0 }}
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-sky-400 text-slate-950" : "bg-slate-900 text-slate-300"}`}
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

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.85fr]">
        <div className={`glass-card rounded-[32px] p-6 ${shake ? "validation-shake" : ""}`}>
          {activeStep === 0 ? (
            <div className="space-y-5">
              <h2 className="display-heading text-3xl font-semibold text-white">1. Inquiry and availability</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.values(SPORT_SPECS).map((item) => (
                  <button
                    className={`rounded-[24px] border p-5 text-left ${
                      sport === item.sport
                        ? "border-sky-300 bg-sky-500/10"
                        : "border-slate-800 bg-slate-950/60"
                    }`}
                    key={item.sport}
                    onClick={() => setField("sport", item.sport)}
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{item.courtType}</p>
                    <h3 className="mt-3 text-xl font-semibold text-white">{item.label}</h3>
                    <p className="mt-2 text-sm text-slate-400">{currency(item.basePrice)} / hour</p>
                  </button>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
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
                <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
                  Auto buffer: {sport === "basketball" || sport === "volleyball" ? "15 min" : "5 min when same sport"}
                </div>
              </div>
            </div>
          ) : null}

          {activeStep === 1 ? (
            <div className="space-y-5">
              <h2 className="display-heading text-3xl font-semibold text-white">2. Customer details</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  className="input-base"
                  onChange={(event) => setField("customerName", event.target.value)}
                  placeholder="Customer name"
                  value={customerName}
                />
                <input
                  className="input-base"
                  onChange={(event) => setField("phone", event.target.value)}
                  placeholder="Phone number"
                  value={phone}
                />
              </div>
              <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
                High-risk customer handling is triggered after 3 no-shows and will require advance payment.
              </div>
            </div>
          ) : null}

          {activeStep === 2 ? (
            <div className="space-y-5">
              <h2 className="display-heading text-3xl font-semibold text-white">3. Equipment bundle allocation</h2>
              <div className="grid gap-4">
                {bundleQuery.data?.map((bundle) => (
                  <button
                    className={`rounded-[24px] border p-5 text-left ${
                      selectedBundleId === bundle.id
                        ? "border-emerald-300 bg-emerald-500/10"
                        : "border-slate-800 bg-slate-950/60"
                    }`}
                    key={bundle.id}
                    onClick={() => setField("selectedBundleId", bundle.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{bundle.name}</h3>
                        <p className="mt-2 text-sm text-slate-400">{bundle.includedItems.join(", ")}</p>
                      </div>
                      <p className="text-sm font-medium text-emerald-300">{currency(bundle.rentalPrice)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {activeStep === 3 ? (
            <div className="space-y-5">
              <h2 className="display-heading text-3xl font-semibold text-white">4. Payment and verification</h2>
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(56,189,248,0.12)",
                    "0 0 36px rgba(56,189,248,0.28)",
                    "0 0 0 rgba(56,189,248,0.12)",
                  ],
                  scale: [1, 1.03, 1],
                }}
                className="rounded-[28px] border border-sky-400/30 bg-sky-500/8 p-6"
                transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Generated payment QR</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{qrReference}</h3>
                    <p className="mt-2 text-sm text-slate-300">Use this unique reference for GCash, Maya, or bank transfer verification.</p>
                  </div>
                  <div className="rounded-[28px] border border-slate-800 bg-slate-950/70 p-5">
                    <QrCode className="h-24 w-24 text-sky-300" />
                  </div>
                </div>
              </motion.div>
              <label className="flex items-center gap-3 rounded-[22px] border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
                <input
                  checked={paymentProofReady}
                  onChange={(event) => setField("paymentProofReady", event.target.checked)}
                  type="checkbox"
                />
                Proof uploaded and OCR or manual verification completed
              </label>
            </div>
          ) : null}

          {activeStep === 4 ? (
            <div className="space-y-6">
              <SuccessCheckmark />
              <div className="text-center">
                <h2 className="display-heading text-3xl font-semibold text-white">5. Confirmation issued</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Booking status is now `CONFIRMED`, equipment is auto-reserved, and the entry QR can be sent by SMS, email, or print.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Entry Reference</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{qrReference}</p>
                </div>
                <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total Charge</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{currency(totalAmount)}</p>
                </div>
              </div>
              <button
                className="rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-200"
                onClick={() => {
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
                className="rounded-full bg-sky-400 px-5 py-3 text-sm font-medium text-slate-950"
                onClick={continueFlow}
              >
                Continue
              </button>
            ) : null}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="glass-card rounded-[32px] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Pricing Snapshot</p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Sport</span>
                <span>{selectedSport.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Base rate</span>
                <span>{currency(selectedSport.basePrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Bundle</span>
                <span>{selectedBundle ? currency(selectedBundle.rentalPrice) : "None"}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-base font-semibold text-white">
                <span>Total</span>
                <span>{currency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[32px] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Business Rules</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>Full courts allow only one booking at a time.</li>
              <li>Divided sports are capped at courts A, B, and C.</li>
              <li>Buffer is 15 minutes for different sports and 5 minutes for same sport.</li>
              <li>No-show auto-release happens after the grace window if check-in is missing.</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
