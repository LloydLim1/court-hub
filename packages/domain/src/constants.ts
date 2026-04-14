import type {
  BookingRecord,
  DashboardKpi,
  DisplayView,
  EquipmentBundle,
  SportSpec,
  SportType,
} from "./types";

export const GRACE_PERIOD_MINUTES = 15;

export const SPORT_SPECS: Record<SportType, SportSpec> = {
  basketball: {
    sport: "basketball",
    label: "Basketball",
    basePrice: 1200,
    capacity: 10,
    courtType: "full",
    equipment: ["2 hoops", "3 balls", "scoreboard"],
  },
  volleyball: {
    sport: "volleyball",
    label: "Volleyball",
    basePrice: 1200,
    capacity: 12,
    courtType: "full",
    equipment: ["net (2.43m)", "2 balls", "antennae"],
  },
  pickleball: {
    sport: "pickleball",
    label: "Pickleball",
    basePrice: 450,
    capacity: 4,
    courtType: "divided",
    equipment: ["3 nets", "6 paddles", "9 balls"],
  },
  badminton: {
    sport: "badminton",
    label: "Badminton",
    basePrice: 400,
    capacity: 4,
    courtType: "divided",
    equipment: ["3 nets", "6 racquets", "shuttlecocks"],
  },
};

export const EQUIPMENT_BUNDLES: EquipmentBundle[] = [
  {
    id: "bundle-basketball",
    name: "Basketball Kit",
    sport: "basketball",
    includedItems: ["3 competition balls", "scoreboard remote", "coach whistle"],
    rentalPrice: 250,
  },
  {
    id: "bundle-volleyball",
    name: "Volleyball Kit",
    sport: "volleyball",
    includedItems: ["2 match balls", "antennae set", "line judge flags"],
    rentalPrice: 240,
  },
  {
    id: "bundle-pickleball",
    name: "Pickleball Kit",
    sport: "pickleball",
    includedItems: ["4 paddles", "6 training balls", "court markers"],
    rentalPrice: 180,
  },
  {
    id: "bundle-badminton",
    name: "Badminton Kit",
    sport: "badminton",
    includedItems: ["4 racquets", "2 shuttle tubes", "court brush"],
    rentalPrice: 150,
  },
];

export const DISPLAY_ROTATION_VIEWS: DisplayView[] = [
  {
    id: "overview",
    label: "Overview",
    summary: "Facility-wide availability and current sessions",
  },
  {
    id: "basketball",
    label: "Basketball",
    summary: "Full-court session availability and next booking",
  },
  {
    id: "volleyball",
    label: "Volleyball",
    summary: "Full-court turnaround and live match status",
  },
  {
    id: "pickleball",
    label: "Pickleball",
    summary: "Three-way split courts and queue activity",
  },
  {
    id: "badminton",
    label: "Badminton",
    summary: "Three-way split courts and shuttle rotation",
  },
  {
    id: "schedule",
    label: "Schedule",
    summary: "Upcoming court starts and no-show releases",
  },
];

export const EXECUTIVE_KPIS: DashboardKpi[] = [
  { id: "revenue", label: "Revenue Today", value: 84250, suffix: "PHP", trend: 12.6 },
  { id: "occupancy", label: "Occupancy", value: 87, suffix: "%", trend: 4.1 },
  { id: "equipment", label: "Equipment Utilization", value: 94, suffix: "%", trend: 3.4 },
  { id: "no-show", label: "No-Show Risk", value: 6, suffix: "%", trend: -1.3 },
];

export const SAMPLE_BOOKINGS: BookingRecord[] = [
  {
    id: "BK-2026-0414-001",
    customerId: "CUS-001",
    customerName: "Aira Santos",
    courtId: "COURT-PB-A",
    courtName: "Pickleball A",
    sport: "pickleball",
    staffId: "USR-frontdesk-01",
    channel: "facebook",
    status: "confirmed",
    checkInStatus: "not_arrived",
    noShowStatus: "warning",
    paymentStatus: "verified",
    totalAmount: 630,
    pricingSnapshot: {
      sport: "pickleball",
      bookedAt: "2026-04-14T14:10:00+08:00",
      baseRate: 450,
      peakMultiplier: 1.2,
      weekendMultiplier: 1,
      specialDayMultiplier: 1,
      minimumPrice: 450,
      appliedRules: ["peak-hour"],
      subtotal: 540,
      equipmentSubtotal: 90,
      total: 630,
    },
    timeline: {
      startTime: "2026-04-14T18:00:00+08:00",
      endTime: "2026-04-14T19:00:00+08:00",
      graceDeadline: "2026-04-14T18:15:00+08:00",
      bufferMinutes: 5,
    },
  },
  {
    id: "BK-2026-0414-002",
    customerId: "CUS-002",
    customerName: "Marco Villanueva",
    courtId: "COURT-BASKETBALL",
    courtName: "Basketball Full Court",
    sport: "basketball",
    staffId: "USR-frontdesk-02",
    channel: "walk_in",
    status: "checked_in",
    checkInStatus: "checked_in",
    noShowStatus: "clear",
    paymentStatus: "verified",
    totalAmount: 1450,
    pricingSnapshot: {
      sport: "basketball",
      bookedAt: "2026-04-14T12:30:00+08:00",
      baseRate: 1200,
      peakMultiplier: 1,
      weekendMultiplier: 1,
      specialDayMultiplier: 1,
      minimumPrice: 1200,
      appliedRules: [],
      subtotal: 1200,
      equipmentSubtotal: 250,
      total: 1450,
    },
    timeline: {
      startTime: "2026-04-14T17:00:00+08:00",
      endTime: "2026-04-14T18:00:00+08:00",
      graceDeadline: "2026-04-14T17:15:00+08:00",
      bufferMinutes: 15,
    },
  },
];

export const getCourtBufferMinutes = (currentSport: SportType, nextSport: SportType) =>
  currentSport === nextSport ? 5 : 15;

export const getNoShowDeadline = (startTime: string) => {
  const start = new Date(startTime);
  start.setMinutes(start.getMinutes() + GRACE_PERIOD_MINUTES);
  return start.toISOString();
};
