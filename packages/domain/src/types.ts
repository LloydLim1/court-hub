export type UserRole = "manager" | "front_desk";

export type BookingChannel =
  | "facebook"
  | "instagram"
  | "viber"
  | "walk_in";

export type SportType =
  | "basketball"
  | "volleyball"
  | "pickleball"
  | "badminton";

export type CourtType = "full" | "divided" | "child";

export type CourtStatus =
  | "available"
  | "reserved"
  | "in_use"
  | "no_show"
  | "grace_period"
  | "cleaning"
  | "maintenance";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "cancelled"
  | "no_show";

export type CheckInStatus = "not_arrived" | "checked_in" | "late_arrival";

export type NoShowStatus = "clear" | "warning" | "released";

export type PaymentStatus =
  | "pending"
  | "proof_uploaded"
  | "verified"
  | "rejected"
  | "refunded";

export type VerificationStatus = "pending" | "ocr_verified" | "manual_verified" | "rejected";

export type EquipmentState =
  | "available"
  | "reserved"
  | "in_use"
  | "returned"
  | "damaged"
  | "maintenance";

export type TransitionCheckpoint = "t_minus_15" | "t_minus_5" | "t_plus_10";

export interface SportSpec {
  sport: SportType;
  label: string;
  basePrice: number;
  capacity: number;
  courtType: "full" | "divided";
  equipment: string[];
}

export interface PricingSnapshot {
  sport: SportType;
  bookedAt: string;
  baseRate: number;
  peakMultiplier: number;
  weekendMultiplier: number;
  specialDayMultiplier: number;
  minimumPrice: number;
  appliedRules: string[];
  subtotal: number;
  equipmentSubtotal: number;
  total: number;
}

export interface CourtNode {
  id: string;
  name: string;
  sport: SportType;
  type: CourtType;
  parentCourtId?: string | null;
  status: CourtStatus;
  capacity: number;
  basePrice: number;
}

export interface BookingTimeline {
  startTime: string;
  endTime: string;
  graceDeadline: string;
  bufferMinutes: number;
}

export interface BookingRecord {
  id: string;
  customerId: string;
  customerName: string;
  courtId: string;
  courtName: string;
  sport: SportType;
  staffId: string;
  channel: BookingChannel;
  status: BookingStatus;
  checkInStatus: CheckInStatus;
  noShowStatus: NoShowStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  pricingSnapshot: PricingSnapshot;
  timeline: BookingTimeline;
}

export interface BookingRequest {
  sport: SportType;
  courtId: string;
  startTime: string;
  endTime: string;
  equipmentCategoryIds: string[];
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  socialMediaSource?: BookingChannel | null;
  totalBookings: number;
  noShowCount: number;
  isHighRisk: boolean;
}

export interface EquipmentBundle {
  id: string;
  name: string;
  sport: SportType;
  includedItems: string[];
  rentalPrice: number;
}

export interface DashboardKpi {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  trend: number;
}

export interface DisplayView {
  id: string;
  label: string;
  summary: string;
}

export interface NotificationEvent<TPayload = Record<string, unknown>> {
  type:
    | "court.status.updated"
    | "booking.created"
    | "booking.grace_warning"
    | "booking.no_show"
    | "transition.alert"
    | "equipment.status.updated";
  payload: TPayload;
  createdAt: string;
}
