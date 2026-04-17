import type { SportType } from "./types";

export type PlatformRole = "user" | "admin";

export type ReservationLifecycle = "confirmed" | "pending" | "checked_in" | "blocked" | "completed";

export interface PlatformAccount {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  homeCity: string;
  favoriteSport: SportType;
  vendorId?: string;
}

export interface MarketplaceVendor {
  id: string;
  slug: string;
  name: string;
  city: string;
  district: string;
  description: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  sports: SportType[];
  amenities: string[];
  startingPrice: number;
}

export interface MarketplaceCourt {
  id: string;
  vendorId: string;
  name: string;
  sport: SportType;
  capacity: number;
  surface: string;
  indoor: boolean;
  pricePerHour: number;
  bufferMinutes: number;
  openHour: number;
  closeHour: number;
  accent: string;
  tags: string[];
}

export interface MarketplaceReservation {
  id: string;
  vendorId: string;
  courtId: string;
  userId: string;
  title: string;
  date: string;
  start: string;
  end: string;
  status: ReservationLifecycle;
  partySize: number;
}

export interface MarketplaceSearchFilters {
  sport: SportType;
  date: string;
  durationMinutes: number;
}

export interface SlotAvailability {
  start: string;
  end: string;
  label: string;
  available: boolean;
}

export interface CourtSearchResult {
  vendor: MarketplaceVendor;
  court: MarketplaceCourt;
  availableSlots: SlotAvailability[];
  nextOpenLabel: string | null;
}

export const DEFAULT_DISCOVERY_DATE = "2026-04-18";
export const MANILA_TIMEZONE_OFFSET = "+08:00";

const pad = (value: number) => String(value).padStart(2, "0");

export const buildDateTime = (date: string, hour: number, minute = 0) =>
  `${date}T${pad(hour)}:${pad(minute)}:00${MANILA_TIMEZONE_OFFSET}`;

export const toManilaOffsetISOString = (date: Date) => {
  const shifted = new Date(date.getTime() + 8 * 60 * 60_000);
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}T${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())}:${pad(shifted.getUTCSeconds())}${MANILA_TIMEZONE_OFFSET}`;
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);

export const formatTimeLabel = (dateTime: string) => {
  const hour24 = Number(dateTime.slice(11, 13));
  const minute = dateTime.slice(14, 16);
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const normalizedHour = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${normalizedHour}:${minute} ${suffix}`;
};

export const formatTimeRangeLabel = (start: string, end: string) =>
  `${formatTimeLabel(start)} - ${formatTimeLabel(end)}`;

export const demoAccounts: PlatformAccount[] = [
  {
    id: "USR-001",
    name: "Alya Reyes",
    email: "player@courthub.app",
    role: "user",
    homeCity: "Pasig",
    favoriteSport: "pickleball",
  },
  {
    id: "ADM-001",
    name: "Marco Dela Cruz",
    email: "admin@courthub.app",
    role: "admin",
    homeCity: "Quezon City",
    favoriteSport: "basketball",
    vendorId: "vendor-blue-stripe",
  },
];

export const marketplaceVendors: MarketplaceVendor[] = [
  {
    id: "vendor-blue-stripe",
    slug: "blue-stripe-arena",
    name: "Blue Stripe Arena",
    city: "Quezon City",
    district: "Tomas Morato",
    description:
      "Flagship multi-court venue for basketball, volleyball, and after-work leagues with premium lighting and recovery amenities.",
    tagline: "League-grade courts with easy evening access",
    rating: 4.9,
    reviewCount: 324,
    sports: ["basketball", "volleyball", "pickleball"],
    amenities: ["Parking", "Locker rooms", "Cafe", "Recovery lounge"],
    startingPrice: 450,
  },
  {
    id: "vendor-south-swing",
    slug: "south-swing-club",
    name: "South Swing Club",
    city: "Makati",
    district: "Chino Roces",
    description:
      "Indoor social-sport club designed for pickleball ladders, badminton clinics, and small group coaching.",
    tagline: "Fast bookings for weekday socials and coaching blocks",
    rating: 4.8,
    reviewCount: 211,
    sports: ["pickleball", "badminton"],
    amenities: ["Shower suites", "Stringing desk", "Retail wall"],
    startingPrice: 400,
  },
  {
    id: "vendor-north-harbor",
    slug: "north-harbor-courts",
    name: "North Harbor Courts",
    city: "Pasig",
    district: "Capitol Commons",
    description:
      "Modern family-friendly complex with flexible court dividers, spectator seating, and tournament-ready scheduling.",
    tagline: "Weekend-friendly availability for families and clubs",
    rating: 4.7,
    reviewCount: 188,
    sports: ["volleyball", "badminton", "pickleball"],
    amenities: ["Spectator deck", "Pro shop", "Team rooms"],
    startingPrice: 420,
  },
];

export const marketplaceCourts: MarketplaceCourt[] = [
  {
    id: "court-bsa-1",
    vendorId: "vendor-blue-stripe",
    name: "Championship Hardwood",
    sport: "basketball",
    capacity: 10,
    surface: "Hardwood maple",
    indoor: true,
    pricePerHour: 1600,
    bufferMinutes: 15,
    openHour: 7,
    closeHour: 23,
    accent: "#2563eb",
    tags: ["League", "Scoreboard", "Full court"],
  },
  {
    id: "court-bsa-2",
    vendorId: "vendor-blue-stripe",
    name: "Skyline Volleyball Hall",
    sport: "volleyball",
    capacity: 12,
    surface: "Sport tile",
    indoor: true,
    pricePerHour: 1300,
    bufferMinutes: 15,
    openHour: 7,
    closeHour: 23,
    accent: "#3b82f6",
    tags: ["Training", "Broadcast lights", "Full court"],
  },
  {
    id: "court-bsa-3",
    vendorId: "vendor-blue-stripe",
    name: "Pickleball Studio A",
    sport: "pickleball",
    capacity: 4,
    surface: "Acrylic indoor",
    indoor: true,
    pricePerHour: 520,
    bufferMinutes: 10,
    openHour: 7,
    closeHour: 23,
    accent: "#60a5fa",
    tags: ["Social play", "Coaching", "Beginner friendly"],
  },
  {
    id: "court-ssc-1",
    vendorId: "vendor-south-swing",
    name: "Club Pickle One",
    sport: "pickleball",
    capacity: 4,
    surface: "Pro-cushion acrylic",
    indoor: true,
    pricePerHour: 480,
    bufferMinutes: 10,
    openHour: 6,
    closeHour: 22,
    accent: "#1d4ed8",
    tags: ["Ladder night", "Premium paddles", "Indoor"],
  },
  {
    id: "court-ssc-2",
    vendorId: "vendor-south-swing",
    name: "Club Pickle Two",
    sport: "pickleball",
    capacity: 4,
    surface: "Pro-cushion acrylic",
    indoor: true,
    pricePerHour: 480,
    bufferMinutes: 10,
    openHour: 6,
    closeHour: 22,
    accent: "#2563eb",
    tags: ["Social play", "Prime time", "Indoor"],
  },
  {
    id: "court-ssc-3",
    vendorId: "vendor-south-swing",
    name: "Badminton Loft",
    sport: "badminton",
    capacity: 4,
    surface: "PU performance floor",
    indoor: true,
    pricePerHour: 430,
    bufferMinutes: 10,
    openHour: 6,
    closeHour: 22,
    accent: "#0f62fe",
    tags: ["Clinics", "Stringing", "Fast turnover"],
  },
  {
    id: "court-nhc-1",
    vendorId: "vendor-north-harbor",
    name: "Harbor Match Court",
    sport: "volleyball",
    capacity: 12,
    surface: "Floating sport floor",
    indoor: true,
    pricePerHour: 1180,
    bufferMinutes: 15,
    openHour: 8,
    closeHour: 22,
    accent: "#174ea6",
    tags: ["Weekend tournaments", "Team rooms", "Family zone"],
  },
  {
    id: "court-nhc-2",
    vendorId: "vendor-north-harbor",
    name: "Harbor Feather Court A",
    sport: "badminton",
    capacity: 4,
    surface: "PU performance floor",
    indoor: true,
    pricePerHour: 420,
    bufferMinutes: 10,
    openHour: 8,
    closeHour: 22,
    accent: "#2563eb",
    tags: ["Doubles", "Beginner classes", "Indoor"],
  },
  {
    id: "court-nhc-3",
    vendorId: "vendor-north-harbor",
    name: "Harbor Pickle Social",
    sport: "pickleball",
    capacity: 4,
    surface: "Textured acrylic",
    indoor: true,
    pricePerHour: 450,
    bufferMinutes: 10,
    openHour: 8,
    closeHour: 22,
    accent: "#3b82f6",
    tags: ["Families", "Social mixer", "Indoor"],
  },
];

export const seedReservations: MarketplaceReservation[] = [
  {
    id: "RSV-001",
    vendorId: "vendor-blue-stripe",
    courtId: "court-bsa-1",
    userId: "USR-001",
    title: "Corporate run",
    date: DEFAULT_DISCOVERY_DATE,
    start: buildDateTime(DEFAULT_DISCOVERY_DATE, 9, 0),
    end: buildDateTime(DEFAULT_DISCOVERY_DATE, 11, 0),
    status: "confirmed",
    partySize: 10,
  },
  {
    id: "RSV-002",
    vendorId: "vendor-blue-stripe",
    courtId: "court-bsa-3",
    userId: "USR-001",
    title: "Doubles match",
    date: DEFAULT_DISCOVERY_DATE,
    start: buildDateTime(DEFAULT_DISCOVERY_DATE, 17, 0),
    end: buildDateTime(DEFAULT_DISCOVERY_DATE, 18, 0),
    status: "confirmed",
    partySize: 4,
  },
  {
    id: "RSV-003",
    vendorId: "vendor-south-swing",
    courtId: "court-ssc-1",
    userId: "USR-001",
    title: "League ladder",
    date: DEFAULT_DISCOVERY_DATE,
    start: buildDateTime(DEFAULT_DISCOVERY_DATE, 18, 30),
    end: buildDateTime(DEFAULT_DISCOVERY_DATE, 20, 0),
    status: "checked_in",
    partySize: 4,
  },
  {
    id: "RSV-004",
    vendorId: "vendor-north-harbor",
    courtId: "court-nhc-1",
    userId: "USR-001",
    title: "School training block",
    date: DEFAULT_DISCOVERY_DATE,
    start: buildDateTime(DEFAULT_DISCOVERY_DATE, 14, 0),
    end: buildDateTime(DEFAULT_DISCOVERY_DATE, 16, 0),
    status: "blocked",
    partySize: 12,
  },
];

export const getVendorById = (vendorId: string) =>
  marketplaceVendors.find((vendor) => vendor.id === vendorId) ?? null;

export const getCourtById = (courtId: string) =>
  marketplaceCourts.find((court) => court.id === courtId) ?? null;

export const getVendorCourts = (vendorId: string) =>
  marketplaceCourts.filter((court) => court.vendorId === vendorId);

export const getReservationsForCourt = (
  reservations: MarketplaceReservation[],
  courtId: string,
  date: string,
) => reservations.filter((reservation) => reservation.courtId === courtId && reservation.date === date);

export const overlapsRange = (
  left: Pick<MarketplaceReservation, "start" | "end">,
  right: Pick<MarketplaceReservation, "start" | "end">,
  bufferMinutes = 0,
) => {
  const leftStart = new Date(left.start).getTime() - bufferMinutes * 60_000;
  const leftEnd = new Date(left.end).getTime() + bufferMinutes * 60_000;
  const rightStart = new Date(right.start).getTime();
  const rightEnd = new Date(right.end).getTime();

  return rightStart < leftEnd && rightEnd > leftStart;
};

export const buildSlotAvailability = (
  court: MarketplaceCourt,
  reservations: MarketplaceReservation[],
  date: string,
  durationMinutes: number,
) => {
  const result: SlotAvailability[] = [];
  for (let hour = court.openHour; hour < court.closeHour; hour += 1) {
    for (const minute of [0, 30]) {
      const start = buildDateTime(date, hour, minute);
      const endDate = new Date(start);
      endDate.setMinutes(endDate.getMinutes() + durationMinutes);
      const end = toManilaOffsetISOString(endDate);

      const endHour = Number(end.slice(11, 13));
      const endMinute = Number(end.slice(14, 16));
      if (endHour > court.closeHour || (endHour === court.closeHour && endMinute > 0)) {
        continue;
      }

      const available = reservations.every((reservation) => {
        if (reservation.status === "completed") return true;
        return !overlapsRange(reservation, { start, end }, court.bufferMinutes);
      });

      result.push({
        start,
        end,
        label: formatTimeRangeLabel(start, end),
        available,
      });
    }
  }

  return result;
};

export const getMarketplaceSearchResults = (
  filters: MarketplaceSearchFilters,
  reservations: MarketplaceReservation[],
) =>
  marketplaceCourts
    .filter((court) => court.sport === filters.sport)
    .map<CourtSearchResult>((court) => {
      const vendor = getVendorById(court.vendorId);
      if (!vendor) {
        throw new Error(`Vendor ${court.vendorId} not found.`);
      }

      const slots = buildSlotAvailability(
        court,
        getReservationsForCourt(reservations, court.id, filters.date),
        filters.date,
        filters.durationMinutes,
      );
      const nextOpen = slots.find((slot) => slot.available) ?? null;

      return {
        vendor,
        court,
        availableSlots: slots.filter((slot) => slot.available).slice(0, 6),
        nextOpenLabel: nextOpen?.label ?? null,
      };
    })
    .sort((left, right) => {
      const leftScore = left.availableSlots.length * 10 + left.vendor.rating;
      const rightScore = right.availableSlots.length * 10 + right.vendor.rating;
      return rightScore - leftScore;
    });

export const createMarketplaceReservation = (
  input: Pick<MarketplaceReservation, "vendorId" | "courtId" | "userId" | "date" | "start" | "end" | "partySize"> &
    Partial<Pick<MarketplaceReservation, "title" | "status">>,
) => ({
  id: `RSV-${Date.now()}`,
  title: input.title ?? "New Court Booking",
  status: input.status ?? "confirmed",
  ...input,
});
