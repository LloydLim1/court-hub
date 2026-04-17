"use client";

import { create } from "zustand";

import type { BookingChannel, SportType } from "@courthub/domain";

import {
  activeScheduleDate,
  generateSlotChoices,
  getSportBundle,
} from "./facility-data";

type BookingField =
  | "sport"
  | "channel"
  | "customerName"
  | "phone"
  | "partySize"
  | "selectedBundleId"
  | "paymentProofReady"
  | "selectedDate"
  | "selectedCourtId"
  | "selectedStart"
  | "selectedEnd";

interface BookingWizardState {
  activeStep: number;
  sport: SportType;
  channel: BookingChannel;
  customerName: string;
  phone: string;
  partySize: number;
  selectedBundleId: string | null;
  selectedAddOnIds: string[];
  paymentProofReady: boolean;
  selectedDate: string;
  selectedCourtId: string | null;
  selectedStart: string | null;
  selectedEnd: string | null;
  setField: (key: BookingField, value: BookingWizardState[BookingField]) => void;
  setSport: (sport: SportType) => void;
  selectSchedule: (courtId: string, start: string, end: string) => void;
  toggleAddOn: (id: string) => void;
  next: () => void;
  previous: () => void;
  reset: () => void;
}

const defaultSlot = generateSlotChoices(activeScheduleDate, 60)[0];

const initialState = {
  activeStep: 0,
  sport: "pickleball" as SportType,
  channel: "facebook" as BookingChannel,
  customerName: "",
  phone: "",
  partySize: 4,
  selectedBundleId: getSportBundle("pickleball")?.id ?? null,
  selectedAddOnIds: [],
  paymentProofReady: false,
  selectedDate: activeScheduleDate,
  selectedCourtId: null,
  selectedStart: defaultSlot?.start ?? null,
  selectedEnd: defaultSlot?.end ?? null,
};

export const useBookingStore = create<BookingWizardState>((set) => ({
  ...initialState,
  setField: (key, value) => set(() => ({ [key]: value } as Pick<BookingWizardState, BookingField>)),
  setSport: (sport) =>
    set(() => ({
      sport,
      partySize: sport === "basketball" ? 10 : sport === "volleyball" ? 12 : 4,
      selectedBundleId: getSportBundle(sport)?.id ?? null,
      selectedAddOnIds: [],
      selectedCourtId: null,
    })),
  selectSchedule: (courtId, start, end) =>
    set(() => ({
      selectedCourtId: courtId,
      selectedStart: start,
      selectedEnd: end,
    })),
  toggleAddOn: (id) =>
    set((state) => ({
      selectedAddOnIds: state.selectedAddOnIds.includes(id)
        ? state.selectedAddOnIds.filter((entry) => entry !== id)
        : [...state.selectedAddOnIds, id],
    })),
  next: () => set((state) => ({ activeStep: Math.min(state.activeStep + 1, 4) })),
  previous: () => set((state) => ({ activeStep: Math.max(state.activeStep - 1, 0) })),
  reset: () => set(initialState),
}));
