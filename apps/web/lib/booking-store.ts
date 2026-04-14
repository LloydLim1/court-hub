"use client";

import { create } from "zustand";

import type { BookingChannel, SportType } from "@courthub/domain";

type BookingFormField =
  | "sport"
  | "channel"
  | "customerName"
  | "phone"
  | "selectedBundleId"
  | "paymentProofReady";

interface BookingWizardState {
  activeStep: number;
  sport: SportType;
  channel: BookingChannel;
  customerName: string;
  phone: string;
  selectedBundleId: string | null;
  paymentProofReady: boolean;
  setField: (key: BookingFormField, value: BookingWizardState[BookingFormField]) => void;
  next: () => void;
  previous: () => void;
  reset: () => void;
}

const initialState = {
  activeStep: 0,
  sport: "pickleball" as SportType,
  channel: "facebook" as BookingChannel,
  customerName: "",
  phone: "",
  selectedBundleId: "bundle-pickleball",
  paymentProofReady: false,
};

export const useBookingStore = create<BookingWizardState>((set) => ({
  ...initialState,
  setField: (key, value) => set(() => ({ [key]: value } as Pick<BookingWizardState, BookingFormField>)),
  next: () => set((state) => ({ activeStep: Math.min(state.activeStep + 1, 4) })),
  previous: () => set((state) => ({ activeStep: Math.max(state.activeStep - 1, 0) })),
  reset: () => set(initialState),
}));
