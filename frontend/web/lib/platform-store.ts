"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  DEFAULT_DISCOVERY_DATE,
  createMarketplaceReservation,
  getCourtById,
  marketplaceCourts,
  overlapsRange,
  seedReservations,
  type MarketplaceCourt,
  type MarketplaceReservation,
  type MarketplaceSearchFilters,
  type ReservationLifecycle,
  type SportType,
} from "@courthub/domain";

interface ManagedCourtInput {
  vendorId: string;
  name: string;
  sport: SportType;
  pricePerHour: number;
  capacity: number;
}

interface ReservationInput {
  vendorId: string;
  courtId: string;
  userId: string;
  date: string;
  start: string;
  end: string;
  partySize: number;
  title?: string;
  status?: ReservationLifecycle;
}

interface PlatformState {
  courts: MarketplaceCourt[];
  reservations: MarketplaceReservation[];
  filters: MarketplaceSearchFilters;
  setFilters: (next: Partial<MarketplaceSearchFilters>) => void;
  createReservation: (input: ReservationInput) => MarketplaceReservation;
  updateReservationStatus: (id: string, status: ReservationLifecycle) => void;
  createManagedCourt: (input: ManagedCourtInput) => MarketplaceCourt;
  resetDemoData: () => void;
}

const initialFilters: MarketplaceSearchFilters = {
  sport: "pickleball",
  date: DEFAULT_DISCOVERY_DATE,
  durationMinutes: 60,
};

const initialState = {
  courts: marketplaceCourts,
  reservations: seedReservations,
  filters: initialFilters,
};

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setFilters: (next) =>
        set((state) => ({
          filters: {
            ...state.filters,
            ...next,
          },
        })),
      createReservation: (input) => {
        const court = getCourtById(input.courtId);
        if (!court) {
          throw new Error("The selected court no longer exists.");
        }

        const conflictingReservation = get().reservations.find((reservation) => {
          if (
            reservation.courtId !== input.courtId ||
            reservation.date !== input.date ||
            reservation.status === "completed"
          ) {
            return false;
          }

          return overlapsRange(reservation, { start: input.start, end: input.end }, court.bufferMinutes);
        });

        if (conflictingReservation) {
          throw new Error("That slot was just taken. Please choose another available time.");
        }

        const nextReservation = createMarketplaceReservation(input);
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
      createManagedCourt: (input) => {
        const createdCourt: MarketplaceCourt = {
          id: `court-${Date.now()}`,
          vendorId: input.vendorId,
          name: input.name,
          sport: input.sport,
          capacity: input.capacity,
          surface:
            input.sport === "basketball"
              ? "Hardwood maple"
              : input.sport === "volleyball"
                ? "Sport tile"
                : input.sport === "pickleball"
                  ? "Acrylic indoor"
                  : "PU performance floor",
          indoor: true,
          pricePerHour: input.pricePerHour,
          bufferMinutes: input.sport === "basketball" || input.sport === "volleyball" ? 15 : 10,
          openHour: 7,
          closeHour: 22,
          accent: "#2563eb",
          tags: ["New listing", "Admin created", "Flexible schedule"],
        };

        set((state) => ({
          courts: [...state.courts, createdCourt],
        }));

        return createdCourt;
      },
      resetDemoData: () => set(initialState),
    }),
    {
      name: "courthub-platform",
      partialize: (state) => ({
        courts: state.courts,
        reservations: state.reservations,
        filters: state.filters,
      }),
    },
  ),
);
