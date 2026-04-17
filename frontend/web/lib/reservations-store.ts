"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { BookingChannel, SportType } from "@courthub/domain";

import {
  getCourtById,
  initialReservations,
  overlapsReservationWindow,
  type FacilityReservation,
} from "./facility-data";

interface CreateReservationInput {
  customerName: string;
  sport: SportType;
  courtId: string;
  start: string;
  end: string;
  players: number;
  bundleId?: string | null;
  addOnIds: string[];
  source: BookingChannel;
}

interface ReservationsState {
  reservations: FacilityReservation[];
  createReservation: (input: CreateReservationInput) => FacilityReservation;
  updateReservationStatus: (id: string, status: FacilityReservation["status"]) => void;
  isCourtAvailable: (courtId: string, start: string, end: string) => boolean;
  resetReservations: () => void;
}

export const useReservationsStore = create<ReservationsState>()(
  persist(
    (set, get) => ({
      reservations: initialReservations,
      createReservation: (input) => {
        const court = getCourtById(input.courtId);
        if (!court) {
          throw new Error("Selected court was not found.");
        }

        if (!get().isCourtAvailable(input.courtId, input.start, input.end)) {
          throw new Error("Selected time slot overlaps with an existing reservation.");
        }

        const nextReservation: FacilityReservation = {
          id: `RES-${Date.now()}`,
          customerName: input.customerName,
          sport: input.sport,
          courtId: input.courtId,
          courtName: court.name,
          start: input.start,
          end: input.end,
          status: "confirmed",
          players: input.players,
          bundleId: input.bundleId ?? null,
          addOnIds: input.addOnIds,
          source: input.source,
        };

        set((state) => ({
          reservations: [...state.reservations, nextReservation].sort(
            (left, right) => new Date(left.start).getTime() - new Date(right.start).getTime(),
          ),
        }));

        return nextReservation;
      },
      updateReservationStatus: (id, status) =>
        set((state) => ({
          reservations: state.reservations.map((reservation) =>
            reservation.id === id ? { ...reservation, status } : reservation,
          ),
        })),
      isCourtAvailable: (courtId, start, end) =>
        !get().reservations.some((reservation) =>
          overlapsReservationWindow(reservation, courtId, start, end),
        ),
      resetReservations: () => set({ reservations: initialReservations }),
    }),
    {
      name: "courthub-reservations",
      partialize: (state) => ({ reservations: state.reservations }),
    },
  ),
);
