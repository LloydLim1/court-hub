"use client";

import { EQUIPMENT_BUNDLES, SPORT_SPECS, type SportType } from "@courthub/domain";

export type ReservationStatus = "confirmed" | "checked_in" | "grace_period" | "no_show" | "pending";

export interface FacilityCourt {
  id: string;
  sport: SportType;
  name: string;
  label: string;
  surface: string;
  accent: string;
  type: "full" | "divided";
  capacity: number;
  basePrice: number;
}

export interface AddOnOption {
  id: string;
  sport: SportType;
  name: string;
  description: string;
  price: number;
}

export interface FacilityReservation {
  id: string;
  customerName: string;
  sport: SportType;
  courtId: string;
  courtName: string;
  start: string;
  end: string;
  status: ReservationStatus;
  players: number;
  bundleId?: string | null;
  addOnIds: string[];
  source: "facebook" | "instagram" | "viber" | "walk_in";
}

export const activeScheduleDate = "2026-04-15";

export const facilityCourts: FacilityCourt[] = [
  {
    id: "basketball-full",
    sport: "basketball",
    name: "Basketball Full Court",
    label: "Arena Hardwood",
    surface: "Hardwood maple",
    accent: "#f97316",
    type: "full",
    capacity: SPORT_SPECS.basketball.capacity,
    basePrice: SPORT_SPECS.basketball.basePrice,
  },
  {
    id: "volleyball-full",
    sport: "volleyball",
    name: "Volleyball Full Court",
    label: "Competition Court",
    surface: "Synthetic sport tile",
    accent: "#22c55e",
    type: "full",
    capacity: SPORT_SPECS.volleyball.capacity,
    basePrice: SPORT_SPECS.volleyball.basePrice,
  },
  {
    id: "pickleball-a",
    sport: "pickleball",
    name: "Pickleball A",
    label: "North Split Court",
    surface: "Textured acrylic",
    accent: "#38bdf8",
    type: "divided",
    capacity: SPORT_SPECS.pickleball.capacity,
    basePrice: SPORT_SPECS.pickleball.basePrice,
  },
  {
    id: "pickleball-b",
    sport: "pickleball",
    name: "Pickleball B",
    label: "Center Split Court",
    surface: "Textured acrylic",
    accent: "#38bdf8",
    type: "divided",
    capacity: SPORT_SPECS.pickleball.capacity,
    basePrice: SPORT_SPECS.pickleball.basePrice,
  },
  {
    id: "pickleball-c",
    sport: "pickleball",
    name: "Pickleball C",
    label: "South Split Court",
    surface: "Textured acrylic",
    accent: "#38bdf8",
    type: "divided",
    capacity: SPORT_SPECS.pickleball.capacity,
    basePrice: SPORT_SPECS.pickleball.basePrice,
  },
  {
    id: "badminton-a",
    sport: "badminton",
    name: "Badminton A",
    label: "North Feather Court",
    surface: "PU performance flooring",
    accent: "#a855f7",
    type: "divided",
    capacity: SPORT_SPECS.badminton.capacity,
    basePrice: SPORT_SPECS.badminton.basePrice,
  },
  {
    id: "badminton-b",
    sport: "badminton",
    name: "Badminton B",
    label: "Center Feather Court",
    surface: "PU performance flooring",
    accent: "#a855f7",
    type: "divided",
    capacity: SPORT_SPECS.badminton.capacity,
    basePrice: SPORT_SPECS.badminton.basePrice,
  },
  {
    id: "badminton-c",
    sport: "badminton",
    name: "Badminton C",
    label: "South Feather Court",
    surface: "PU performance flooring",
    accent: "#a855f7",
    type: "divided",
    capacity: SPORT_SPECS.badminton.capacity,
    basePrice: SPORT_SPECS.badminton.basePrice,
  },
];

export const addOnOptions: AddOnOption[] = [
  {
    id: "basketball-scorekeeper",
    sport: "basketball",
    name: "Scorekeeper Station",
    description: "Desk, tablet, and scoreboard operator support",
    price: 180,
  },
  {
    id: "basketball-rebound-net",
    sport: "basketball",
    name: "Rebound Net Setup",
    description: "Warm-up rebound frame for team drills",
    price: 120,
  },
  {
    id: "volleyball-referee-stand",
    sport: "volleyball",
    name: "Referee Stand",
    description: "Competition stand and score flip board",
    price: 160,
  },
  {
    id: "volleyball-recovery-kit",
    sport: "volleyball",
    name: "Recovery Ice Kit",
    description: "Cold packs and towels for long sessions",
    price: 70,
  },
  {
    id: "pickleball-paddle-upgrade",
    sport: "pickleball",
    name: "Paddle Upgrade Set",
    description: "Tournament-grade paddle pack for four players",
    price: 140,
  },
  {
    id: "pickleball-ball-refill",
    sport: "pickleball",
    name: "Ball Refill Tube",
    description: "Fresh outdoor ball tube for fast-paced rallies",
    price: 85,
  },
  {
    id: "badminton-shuttle-refill",
    sport: "badminton",
    name: "Shuttle Refill Tube",
    description: "Premium shuttle tube for competitive play",
    price: 95,
  },
  {
    id: "badminton-grip-wrap",
    sport: "badminton",
    name: "Grip Wrap Set",
    description: "Fresh wraps for racquet comfort and traction",
    price: 60,
  },
];

const scheduleBase = `${activeScheduleDate}T`;

export const initialReservations: FacilityReservation[] = [
  {
    id: "RES-001",
    customerName: "Aira Santos",
    sport: "pickleball",
    courtId: "pickleball-a",
    courtName: "Pickleball A",
    start: `${scheduleBase}09:00:00+08:00`,
    end: `${scheduleBase}10:00:00+08:00`,
    status: "checked_in",
    players: 4,
    bundleId: EQUIPMENT_BUNDLES.find((bundle) => bundle.sport === "pickleball")?.id,
    addOnIds: ["pickleball-ball-refill"],
    source: "facebook",
  },
  {
    id: "RES-002",
    customerName: "Marco Villanueva",
    sport: "basketball",
    courtId: "basketball-full",
    courtName: "Basketball Full Court",
    start: `${scheduleBase}11:00:00+08:00`,
    end: `${scheduleBase}13:00:00+08:00`,
    status: "confirmed",
    players: 10,
    bundleId: EQUIPMENT_BUNDLES.find((bundle) => bundle.sport === "basketball")?.id,
    addOnIds: ["basketball-scorekeeper"],
    source: "walk_in",
  },
  {
    id: "RES-003",
    customerName: "Rina Flores",
    sport: "volleyball",
    courtId: "volleyball-full",
    courtName: "Volleyball Full Court",
    start: `${scheduleBase}14:00:00+08:00`,
    end: `${scheduleBase}16:00:00+08:00`,
    status: "grace_period",
    players: 12,
    bundleId: EQUIPMENT_BUNDLES.find((bundle) => bundle.sport === "volleyball")?.id,
    addOnIds: ["volleyball-referee-stand"],
    source: "instagram",
  },
  {
    id: "RES-004",
    customerName: "Drew Martinez",
    sport: "badminton",
    courtId: "badminton-b",
    courtName: "Badminton B",
    start: `${scheduleBase}15:30:00+08:00`,
    end: `${scheduleBase}17:00:00+08:00`,
    status: "confirmed",
    players: 4,
    bundleId: EQUIPMENT_BUNDLES.find((bundle) => bundle.sport === "badminton")?.id,
    addOnIds: ["badminton-shuttle-refill"],
    source: "viber",
  },
  {
    id: "RES-005",
    customerName: "Kei Ramos",
    sport: "pickleball",
    courtId: "pickleball-c",
    courtName: "Pickleball C",
    start: `${scheduleBase}18:00:00+08:00`,
    end: `${scheduleBase}19:30:00+08:00`,
    status: "pending",
    players: 4,
    bundleId: null,
    addOnIds: [],
    source: "facebook",
  },
];

export const timelineHours = Array.from({ length: 15 }, (_, index) => 8 + index);

export const getCourtById = (courtId: string) =>
  facilityCourts.find((court) => court.id === courtId) ?? null;

export const getSportCourts = (sport: SportType) =>
  facilityCourts.filter((court) => court.sport === sport);

export const getSportAddOns = (sport: SportType) =>
  addOnOptions.filter((item) => item.sport === sport);

export const getSportBundle = (sport: SportType) =>
  EQUIPMENT_BUNDLES.find((bundle) => bundle.sport === sport) ?? null;

export const formatTimelineTime = (dateTime: string) =>
  new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateTime));

export const getReservationWindowLabel = (reservation: Pick<FacilityReservation, "start" | "end">) =>
  `${formatTimelineTime(reservation.start)} - ${formatTimelineTime(reservation.end)}`;

export const overlapsReservationWindow = (
  reservation: Pick<FacilityReservation, "start" | "end" | "courtId">,
  courtId: string,
  start: string,
  end: string,
) => {
  if (reservation.courtId !== courtId) return false;
  const nextStart = new Date(start).getTime();
  const nextEnd = new Date(end).getTime();
  const existingStart = new Date(reservation.start).getTime();
  const existingEnd = new Date(reservation.end).getTime();
  return nextStart < existingEnd && nextEnd > existingStart;
};

export const generateSlotChoices = (date = activeScheduleDate, durationMinutes = 60) => {
  const slots: Array<{ start: string; end: string; label: string }> = [];
  for (let hour = 8; hour < 22; hour += 1) {
    for (const minute of [0, 30]) {
      const start = new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+08:00`);
      const end = new Date(start.getTime() + durationMinutes * 60_000);
      if (end.getHours() > 22 || (end.getHours() === 22 && end.getMinutes() > 0)) continue;
      slots.push({
        start: start.toISOString(),
        end: end.toISOString(),
        label: `${formatTimelineTime(start.toISOString())} - ${formatTimelineTime(end.toISOString())}`,
      });
    }
  }
  return slots;
};
