"use client";

import {
  DISPLAY_ROTATION_VIEWS,
  EQUIPMENT_BUNDLES,
  EXECUTIVE_KPIS,
  SAMPLE_BOOKINGS,
  SPORT_SPECS,
  type CourtStatus,
  type SportType,
} from "@courthub/domain";

export type DashboardScope = "executive" | "operations" | "inventory" | "pricing" | "staff";

export interface MetricStat {
  id: string;
  label: string;
  value: number | string;
  suffix?: string;
  trend?: number;
}

export interface InfoPanel {
  title: string;
  description: string;
  items: Array<{
    label: string;
    value: string;
    tone?: "neutral" | "info" | "warning" | "success" | "danger";
  }>;
}

export interface FeatureSectionData {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  metrics: MetricStat[];
  panels: InfoPanel[];
}

export const liveCourtStatus: Array<{
  id: string;
  name: string;
  sport: SportType;
  status: CourtStatus;
  nextSlot: string;
  countdown: string;
}> = [
  {
    id: "BASKETBALL-FULL",
    name: "Basketball Full Court",
    sport: "basketball",
    status: "in_use",
    nextSlot: "18:00",
    countdown: "00:18:21",
  },
  {
    id: "VOLLEYBALL-FULL",
    name: "Volleyball Full Court",
    sport: "volleyball",
    status: "grace_period",
    nextSlot: "18:30",
    countdown: "00:04:49",
  },
  {
    id: "PICKLEBALL-A",
    name: "Pickleball A",
    sport: "pickleball",
    status: "reserved",
    nextSlot: "18:00",
    countdown: "00:24:00",
  },
  {
    id: "PICKLEBALL-B",
    name: "Pickleball B",
    sport: "pickleball",
    status: "no_show",
    nextSlot: "Available now",
    countdown: "Released",
  },
  {
    id: "PICKLEBALL-C",
    name: "Pickleball C",
    sport: "pickleball",
    status: "available",
    nextSlot: "Available now",
    countdown: "Standby",
  },
  {
    id: "BADMINTON-A",
    name: "Badminton A",
    sport: "badminton",
    status: "reserved",
    nextSlot: "19:00",
    countdown: "00:32:05",
  },
  {
    id: "BADMINTON-B",
    name: "Badminton B",
    sport: "badminton",
    status: "cleaning",
    nextSlot: "18:20",
    countdown: "00:06:10",
  },
  {
    id: "BADMINTON-C",
    name: "Badminton C",
    sport: "badminton",
    status: "available",
    nextSlot: "Available now",
    countdown: "Standby",
  },
];

export const revenueSeries = [
  { hour: "08:00", revenue: 6400, bookings: 4 },
  { hour: "10:00", revenue: 9300, bookings: 7 },
  { hour: "12:00", revenue: 12500, bookings: 9 },
  { hour: "14:00", revenue: 17000, bookings: 11 },
  { hour: "16:00", revenue: 21800, bookings: 14 },
  { hour: "18:00", revenue: 24500, bookings: 16 },
  { hour: "20:00", revenue: 26750, bookings: 18 },
];

export const transitionAlerts = [
  {
    id: "TRANS-1",
    title: "Volleyball court grace warning",
    detail: "Front desk has 4:49 before auto no-show release.",
  },
  {
    id: "TRANS-2",
    title: "Badminton B cleaning handoff",
    detail: "Equipment wipe-down must finish before 18:20 restart.",
  },
];

export const kanbanColumns = {
  queued: [
    "Confirm walk-in basketball payment proof",
    "Review high-risk customer flag for CUS-103",
  ],
  active: [
    "Prepare pickleball bundle reservations",
    "Resolve volleyball transition alert",
  ],
  done: [
    "Checked in BK-2026-0414-002",
    "Updated external display ticker",
  ],
};

const sectionData: Record<DashboardScope, Record<string, FeatureSectionData>> = {
  executive: {
    root: {
      slug: "executive",
      eyebrow: "Executive Command",
      title: "Revenue, occupancy, and customer risk in one live control surface.",
      description:
        "Track same-day demand, watch no-show risk, and spot equipment-driven margin opportunities without leaving the operations feed.",
      metrics: EXECUTIVE_KPIS,
      panels: [
        {
          title: "Demand Forecast",
          description: "Projected peak loads for the next six hours based on recent booking velocity.",
          items: [
            { label: "18:00 surge", value: "Pickleball +22% expected", tone: "info" },
            { label: "20:00 spike", value: "Basketball waitlist likely", tone: "warning" },
            { label: "Staffing", value: "Keep 2 front desk staff online", tone: "success" },
          ],
        },
        {
          title: "High-Risk Customers",
          description: "Advance payment enforcement from the no-show counter.",
          items: [
            { label: "Flagged today", value: "4 customers", tone: "warning" },
            { label: "Escalations", value: "1 manager review pending", tone: "danger" },
            { label: "Recovered bookings", value: "2 converted to prepaid", tone: "success" },
          ],
        },
      ],
    },
    revenue: {
      slug: "revenue",
      eyebrow: "Executive / Revenue",
      title: "Revenue intelligence by hour, sport, and booking channel.",
      description:
        "Compare full-court versus divided-court contribution, monitor payment verification lag, and isolate equipment upsell performance.",
      metrics: [
        { id: "gross", label: "Gross Revenue", value: 126750, suffix: "PHP", trend: 11.9 },
        { id: "avg", label: "Average Booking", value: 905, suffix: "PHP", trend: 3.1 },
        { id: "walkin", label: "Walk-in Share", value: 34, suffix: "%", trend: -2.4 },
      ],
      panels: [
        {
          title: "Channel Mix",
          description: "Social media remains the dominant intake source.",
          items: [
            { label: "Facebook", value: "41 bookings", tone: "info" },
            { label: "Instagram", value: "24 bookings", tone: "neutral" },
            { label: "Viber", value: "15 bookings", tone: "neutral" },
            { label: "Walk-in", value: "19 bookings", tone: "success" },
          ],
        },
      ],
    },
    forecasting: {
      slug: "forecasting",
      eyebrow: "Executive / Forecasting",
      title: "Demand prediction tuned for peak slots and equipment constraints.",
      description:
        "Surface the hours most likely to require additional staffing, extra bundles, or tighter walk-in pacing.",
      metrics: [
        { id: "forecast", label: "Forecast Accuracy", value: 92.4, suffix: "%", trend: 1.9 },
        { id: "peak", label: "Peak Hour Multiplier", value: 1.25, suffix: "x", trend: 0.0 },
        { id: "buffer", label: "Average Buffer Use", value: 8.1, suffix: "min", trend: -0.5 },
      ],
      panels: [
        {
          title: "Tomorrow Watchlist",
          description: "Slots expected to fill first.",
          items: [
            { label: "17:00-19:00", value: "Basketball sold-out risk", tone: "warning" },
            { label: "18:00-20:00", value: "Badminton equipment pressure", tone: "info" },
          ],
        },
      ],
    },
    "equipment-revenue": {
      slug: "equipment-revenue",
      eyebrow: "Executive / Equipment Revenue",
      title: "Bundle attachment rate and rental recovery performance.",
      description:
        "Measure how often the staff adds equipment bundles and whether damage or shortages impact future bookings.",
      metrics: [
        { id: "attach", label: "Bundle Attach Rate", value: 72, suffix: "%", trend: 6.2 },
        { id: "rental", label: "Rental Revenue", value: 14850, suffix: "PHP", trend: 9.4 },
        { id: "damage", label: "Damage Incidents", value: 2, trend: -1.0 },
      ],
      panels: [
        {
          title: "Top Performing Bundle",
          description: "Best upsell package by revenue contribution.",
          items: [
            { label: "Pickleball Kit", value: "PHP 5,400 this week", tone: "success" },
            { label: "Stock Risk", value: "Paddle rotation needed tomorrow", tone: "warning" },
          ],
        },
      ],
    },
    customers: {
      slug: "customers",
      eyebrow: "Executive / Customers",
      title: "Customer health, repeat visits, and no-show risk scoring.",
      description:
        "Identify loyal groups, spot churn risk early, and enforce advance-payment policy where repeated no-shows appear.",
      metrics: [
        { id: "repeat", label: "Repeat Rate", value: 61, suffix: "%", trend: 2.7 },
        { id: "risk", label: "High-Risk Accounts", value: 12, trend: 1.0 },
        { id: "lifetime", label: "LTV Median", value: 9420, suffix: "PHP", trend: 8.3 },
      ],
      panels: [
        {
          title: "Customer Insight",
          description: "Segments needing attention today.",
          items: [
            { label: "Champions", value: "18 regular groups", tone: "success" },
            { label: "At risk", value: "6 first-timers with missed confirmations", tone: "warning" },
          ],
        },
      ],
    },
    reports: {
      slug: "reports",
      eyebrow: "Executive / Reports",
      title: "Exportable summaries for finance, operations, and partner reviews.",
      description:
        "Generate shift summaries, end-of-day billing recaps, and sport-specific occupancy reports from the same data model.",
      metrics: [
        { id: "reports", label: "Reports Generated", value: 28, trend: 4.0 },
        { id: "auto", label: "Auto-Scheduled", value: 9, trend: 1.0 },
        { id: "export", label: "Export Success", value: 100, suffix: "%", trend: 0.0 },
      ],
      panels: [
        {
          title: "Available Reports",
          description: "Most requested exports this week.",
          items: [
            { label: "End-of-day finance", value: "CSV + PDF", tone: "info" },
            { label: "No-show summary", value: "Manager email digest", tone: "neutral" },
          ],
        },
      ],
    },
  },
  operations: {
    root: {
      slug: "operations",
      eyebrow: "Operations Control",
      title: "Live court monitor with grace periods, transitions, and instant releases.",
      description:
        "Front desk staff can see every court state, check-in countdown, equipment lock, and no-show release without leaving the live board.",
      metrics: [
        { id: "live", label: "Live Sessions", value: 5, trend: 2.0 },
        { id: "grace", label: "Grace Period Courts", value: 1, trend: 0.0 },
        { id: "checkins", label: "Average Check-in", value: 4.3, suffix: "sec", trend: -0.7 },
      ],
      panels: [
        {
          title: "Immediate Actions",
          description: "What the shift lead needs to resolve next.",
          items: [
            { label: "Grace warning", value: "Volleyball release in 4:49", tone: "danger" },
            { label: "Transition", value: "Badminton B cleaning in progress", tone: "warning" },
          ],
        },
      ],
    },
    calendar: {
      slug: "calendar",
      eyebrow: "Operations / Calendar",
      title: "Smart booking calendar for staff-assisted inquiries and holds.",
      description:
        "Review availability, buffers, and same-sport transitions before turning inquiries into confirmed bookings.",
      metrics: [
        { id: "holds", label: "Pending Holds", value: 7, trend: 1.0 },
        { id: "fill", label: "Today Fill Rate", value: 88, suffix: "%", trend: 2.6 },
        { id: "conflicts", label: "Prevented Conflicts", value: 12, trend: 5.0 },
      ],
      panels: [
        {
          title: "Conflict Rules",
          description: "Applied before a booking is stored.",
          items: [
            { label: "Divided courts", value: "Exactly 3 child courts only", tone: "info" },
            { label: "Cross-sport changeover", value: "15-minute buffer enforced", tone: "warning" },
          ],
        },
      ],
    },
    transitions: {
      slug: "transitions",
      eyebrow: "Operations / Transitions",
      title: "T-15, T-5, and T+10 operational checkpoints.",
      description:
        "Standardize handoffs between outgoing and incoming sessions with alerting for cleaning, equipment return, and staff prep.",
      metrics: [
        { id: "t15", label: "T-15 Alerts", value: 9, trend: 2.0 },
        { id: "handoffs", label: "On-Time Handoffs", value: 96, suffix: "%", trend: 1.4 },
        { id: "overruns", label: "Session Overruns", value: 1, trend: -1.0 },
      ],
      panels: [
        {
          title: "Workflow Notes",
          description: "Current transition bottlenecks.",
          items: [
            { label: "Court wipe-down", value: "Badminton B requires extra 5 minutes", tone: "warning" },
            { label: "Net reset", value: "Volleyball antennae inspection complete", tone: "success" },
          ],
        },
      ],
    },
    "no-shows": {
      slug: "no-shows",
      eyebrow: "Operations / No-Shows",
      title: "Grace period tracking and instant court release workflow.",
      description:
        "Automatically release courts after the allowed grace window, update the public display, and increment customer risk counters.",
      metrics: [
        { id: "release", label: "Auto Releases", value: 3, trend: 1.0 },
        { id: "late", label: "Late Arrivals Allowed", value: 2, trend: 0.0 },
        { id: "risk", label: "Risk Flags Triggered", value: 1, trend: 1.0 },
      ],
      panels: [
        {
          title: "Policy Notes",
          description: "Late arrivals after release need escalation rules.",
          items: [
            { label: "Court free", value: "Allow check-in for remaining time only", tone: "success" },
            { label: "Court reassigned", value: "Escalate or deny entry", tone: "danger" },
          ],
        },
      ],
    },
    "check-in": {
      slug: "check-in",
      eyebrow: "Operations / Check-In",
      title: "QR scan speed, manual lookup, and live admission status.",
      description:
        "Handle arrival spikes with QR scanning, manual fallback lookup, and automatic grace period closure once a guest is admitted.",
      metrics: [
        { id: "scan", label: "QR Scan Time", value: 4.2, suffix: "sec", trend: -0.4 },
        { id: "manual", label: "Manual Lookups", value: 6, trend: 1.2 },
        { id: "success", label: "Scan Success", value: 99.4, suffix: "%", trend: 0.2 },
      ],
      panels: [
        {
          title: "Entry Methods",
          description: "Supported verification lanes.",
          items: [
            { label: "Primary", value: "Camera QR scanner", tone: "info" },
            { label: "Fallback", value: "Reference code or phone lookup", tone: "neutral" },
          ],
        },
      ],
    },
    today: {
      slug: "today",
      eyebrow: "Operations / Today",
      title: "The full day’s bookings, sorted for the current shift.",
      description:
        "Front desk staff can scan upcoming arrivals, monitor proof verification, and anticipate equipment handoff pressure.",
      metrics: [
        { id: "today", label: "Bookings Today", value: 38, trend: 4.0 },
        { id: "pending", label: "Pending Payments", value: 5, trend: -1.0 },
        { id: "equipment", label: "Equipment Locks", value: 19, trend: 3.0 },
      ],
      panels: [
        {
          title: "Top of Queue",
          description: "The next bookings needing staff attention.",
          items: SAMPLE_BOOKINGS.map((booking) => ({
            label: booking.customerName,
            value: `${booking.courtName} • ${booking.timeline.startTime.slice(11, 16)}`,
            tone: booking.noShowStatus === "warning" ? "warning" : "neutral",
          })),
        },
      ],
    },
  },
  inventory: {
    root: {
      slug: "inventory",
      eyebrow: "Inventory Control",
      title: "Equipment visibility from reservation through return and damage review.",
      description:
        "Keep bundles aligned with bookings, stop confirmation when inventory is short, and route damage cases before they break upcoming schedules.",
      metrics: [
        { id: "accuracy", label: "Equipment Accuracy", value: 100, suffix: "%", trend: 0.0 },
        { id: "reserved", label: "Reserved Items", value: 31, trend: 5.0 },
        { id: "damaged", label: "Damage Reports", value: 2, trend: 1.0 },
      ],
      panels: [
        {
          title: "Bundle Readiness",
          description: "Current stock by sport bundle.",
          items: EQUIPMENT_BUNDLES.map((bundle) => ({
            label: bundle.name,
            value: `Ready • PHP ${bundle.rentalPrice}`,
            tone: bundle.sport === "basketball" ? "warning" : "success",
          })),
        },
      ],
    },
    maintenance: {
      slug: "maintenance",
      eyebrow: "Inventory / Maintenance",
      title: "Preventive servicing for nets, racquets, paddles, and shared gear.",
      description:
        "Schedule recurring checks and keep upcoming sessions insulated from unexpected failures.",
      metrics: [
        { id: "due", label: "Due This Week", value: 8, trend: 2.0 },
        { id: "overdue", label: "Overdue", value: 1, trend: -1.0 },
        { id: "completed", label: "Completed Today", value: 4, trend: 2.0 },
      ],
      panels: [
        {
          title: "Priority Maintenance",
          description: "Items needing earliest attention.",
          items: [
            { label: "Badminton net set", value: "Fraying near center tape", tone: "warning" },
            { label: "Basketball scoreboard remote", value: "Battery replacement done", tone: "success" },
          ],
        },
      ],
    },
    damages: {
      slug: "damages",
      eyebrow: "Inventory / Damages",
      title: "Damage reporting tied to replacement impact and upcoming bookings.",
      description:
        "Escalate issues fast enough to reassign equipment before the next confirmed rental is affected.",
      metrics: [
        { id: "open", label: "Open Damage Cases", value: 2, trend: 1.0 },
        { id: "impact", label: "Bookings At Risk", value: 1, trend: 1.0 },
        { id: "resolved", label: "Resolved This Month", value: 11, trend: 3.0 },
      ],
      panels: [
        {
          title: "Escalation Flow",
          description: "Operational path when damaged equipment blocks availability.",
          items: [
            { label: "Reserve swap", value: "Pull from backup kit first", tone: "info" },
            { label: "No backup", value: "Pause confirmation and alert manager", tone: "danger" },
          ],
        },
      ],
    },
    "low-stock": {
      slug: "low-stock",
      eyebrow: "Inventory / Low Stock",
      title: "Critical low-stock alerts before bookings get blocked.",
      description:
        "Surface upcoming shortages so the team can reorder, rebalance, or adjust bundle defaults before staff reaches the counter.",
      metrics: [
        { id: "alerts", label: "Low Stock Alerts", value: 3, trend: 2.0 },
        { id: "reorder", label: "Reorders Pending", value: 2, trend: 1.0 },
        { id: "coverage", label: "Days of Coverage", value: 5, suffix: "days", trend: -1.0 },
      ],
      panels: [
        {
          title: "Watch List",
          description: "Items closest to booking impact.",
          items: [
            { label: "Pickleball balls", value: "9 usable, 12 needed tomorrow", tone: "warning" },
            { label: "Shuttle tubes", value: "Reorder triggered", tone: "danger" },
          ],
        },
      ],
    },
    history: {
      slug: "history",
      eyebrow: "Inventory / History",
      title: "Rental movement, return compliance, and issue history over time.",
      description:
        "Audit exactly when an item was reserved, checked out, returned, or flagged to support accountability and loss prevention.",
      metrics: [
        { id: "rentals", label: "Monthly Rentals", value: 312, trend: 18.0 },
        { id: "late", label: "Late Returns", value: 4, trend: -2.0 },
        { id: "audit", label: "Audit Coverage", value: 100, suffix: "%", trend: 0.0 },
      ],
      panels: [
        {
          title: "Latest Events",
          description: "Recent equipment lifecycle activity.",
          items: [
            { label: "Basketball Kit", value: "Returned 17:12 with all items", tone: "success" },
            { label: "Badminton Kit", value: "Inspection opened after racquet crack", tone: "warning" },
          ],
        },
      ],
    },
  },
  pricing: {
    root: {
      slug: "pricing",
      eyebrow: "Pricing Engine",
      title: "Price governance with immutable booking snapshots and audit trails.",
      description:
        "Managers can tune base rates and multipliers without rewriting historical charges because every booking stores its own pricing snapshot.",
      metrics: [
        { id: "rules", label: "Active Rules", value: 14, trend: 2.0 },
        { id: "minimum", label: "Min Price Compliance", value: 100, suffix: "%", trend: 0.0 },
        { id: "changes", label: "Changes This Month", value: 6, trend: 1.0 },
      ],
      panels: [
        {
          title: "Base Rate Coverage",
          description: "Current starting prices by sport.",
          items: Object.values(SPORT_SPECS).map((sport) => ({
            label: sport.label,
            value: `PHP ${sport.basePrice}/hr`,
            tone: "info",
          })),
        },
      ],
    },
    "peak-hours": {
      slug: "peak-hours",
      eyebrow: "Pricing / Peak Hours",
      title: "Configure peak multipliers without breaking minimum sport pricing.",
      description:
        "Apply premium pricing to the busiest windows while keeping snapshots immutable once a booking is created.",
      metrics: [
        { id: "peak", label: "Peak Slots", value: 17, trend: 3.0 },
        { id: "uplift", label: "Average Uplift", value: 18, suffix: "%", trend: 4.0 },
        { id: "override", label: "Manual Overrides", value: 1, trend: -1.0 },
      ],
      panels: [
        {
          title: "Current Windows",
          description: "Peak times used in the simulator and booking engine.",
          items: [
            { label: "Weekdays", value: "17:00-21:00", tone: "info" },
            { label: "Weekends", value: "09:00-21:00", tone: "neutral" },
          ],
        },
      ],
    },
    "special-days": {
      slug: "special-days",
      eyebrow: "Pricing / Special Days",
      title: "Holiday and event pricing with explicit date-bound rules.",
      description:
        "Special-day pricing layers on top of peak and weekend settings while preserving a full audit of the decision path.",
      metrics: [
        { id: "holiday", label: "Special Dates", value: 5, trend: 1.0 },
        { id: "impact", label: "Projected Lift", value: 14, suffix: "%", trend: 2.0 },
        { id: "coverage", label: "Holiday Coverage", value: 100, suffix: "%", trend: 0.0 },
      ],
      panels: [
        {
          title: "Upcoming Dates",
          description: "Next event-based pricing changes.",
          items: [
            { label: "Labor Day", value: "1.3x all courts", tone: "warning" },
            { label: "City Sports Fest", value: "Basketball 1.4x", tone: "info" },
          ],
        },
      ],
    },
    history: {
      slug: "history",
      eyebrow: "Pricing / History",
      title: "Full audit trail of pricing rule changes and approvals.",
      description:
        "Every base rate change, multiplier update, and special-day edit is stored with user, timestamp, and before/after values.",
      metrics: [
        { id: "logs", label: "Audit Entries", value: 124, trend: 11.0 },
        { id: "approvals", label: "Manager Approvals", value: 19, trend: 3.0 },
        { id: "rollback", label: "Rollbacks", value: 1, trend: 0.0 },
      ],
      panels: [
        {
          title: "Most Recent Change",
          description: "Latest committed pricing modification.",
          items: [
            { label: "Changed by", value: "Lloyd Reyes", tone: "neutral" },
            { label: "Update", value: "Pickleball peak multiplier 1.15 -> 1.2", tone: "info" },
          ],
        },
      ],
    },
    simulator: {
      slug: "simulator",
      eyebrow: "Pricing / Simulator",
      title: "Simulate any booking price before staff sends payment instructions.",
      description:
        "Model the exact rate outcome for a date, time, sport, and equipment combination using the same logic as the booking engine.",
      metrics: [
        { id: "queries", label: "Simulations Today", value: 44, trend: 12.0 },
        { id: "match", label: "Engine Match Rate", value: 100, suffix: "%", trend: 0.0 },
        { id: "savings", label: "Pricing Errors Prevented", value: 7, trend: 2.0 },
      ],
      panels: [
        {
          title: "Sample Outcome",
          description: "Thursday 18:00 pickleball with bundle.",
          items: [
            { label: "Base", value: "PHP 450", tone: "neutral" },
            { label: "Peak", value: "x1.2", tone: "info" },
            { label: "Bundle", value: "+PHP 180", tone: "success" },
            { label: "Total", value: "PHP 720", tone: "warning" },
          ],
        },
      ],
    },
  },
  staff: {
    root: {
      slug: "staff",
      eyebrow: "Staff Board",
      title: "Kanban-driven shift execution for bookings, messages, incidents, and handovers.",
      description:
        "Give each front desk teammate a live queue of what to do next, with movement between queues visible to the whole shift.",
      metrics: [
        { id: "tasks", label: "Open Tasks", value: 8, trend: 2.0 },
        { id: "handover", label: "Handover Notes", value: 3, trend: 0.0 },
        { id: "sla", label: "Task SLA", value: 97, suffix: "%", trend: 1.0 },
      ],
      panels: [
        {
          title: "Shift Focus",
          description: "What this team must clear before the next rotation.",
          items: [
            { label: "Top priority", value: "Resolve grace period and confirm walk-ins", tone: "warning" },
            { label: "Secondary", value: "Bundle prep for 18:00 wave", tone: "info" },
          ],
        },
      ],
    },
    messages: {
      slug: "messages",
      eyebrow: "Staff / Messages",
      title: "Internal messaging for floor coordination and escalations.",
      description:
        "Pass operational context between the desk, floor runners, and managers without leaving the booking workspace.",
      metrics: [
        { id: "threads", label: "Active Threads", value: 6, trend: 1.0 },
        { id: "response", label: "Response Median", value: 1.4, suffix: "min", trend: -0.1 },
        { id: "urgent", label: "Urgent Notes", value: 2, trend: 0.0 },
      ],
      panels: [
        {
          title: "Latest Messages",
          description: "Cross-team coordination this shift.",
          items: [
            { label: "Manager", value: "Approve late arrival override?", tone: "warning" },
            { label: "Floor Staff", value: "Badminton B ready in 6 minutes", tone: "success" },
          ],
        },
      ],
    },
    "shift-logs": {
      slug: "shift-logs",
      eyebrow: "Staff / Shift Logs",
      title: "Structured shift handovers with unresolved issues preserved.",
      description:
        "Keep open problems visible between teams so no-show flags, payment reviews, and damage cases survive shift changes.",
      metrics: [
        { id: "logs", label: "Logs This Week", value: 18, trend: 2.0 },
        { id: "carry", label: "Carryovers", value: 3, trend: -1.0 },
        { id: "resolved", label: "Resolved on Next Shift", value: 89, suffix: "%", trend: 4.0 },
      ],
      panels: [
        {
          title: "Current Handover",
          description: "Items the night shift inherits.",
          items: [
            { label: "Follow-up", value: "Verify replacement for damaged racquet", tone: "warning" },
            { label: "Monitor", value: "Customer CUS-045 on advance-payment watch", tone: "danger" },
          ],
        },
      ],
    },
    incidents: {
      slug: "incidents",
      eyebrow: "Staff / Incidents",
      title: "Incident reporting tied to courts, customers, and equipment.",
      description:
        "Capture issues fast enough to protect service quality, legal clarity, and downstream bookings.",
      metrics: [
        { id: "incidents", label: "Open Incidents", value: 2, trend: 0.0 },
        { id: "safety", label: "Safety Reviews", value: 1, trend: 1.0 },
        { id: "closure", label: "Closure Time", value: 3.6, suffix: "hrs", trend: -0.5 },
      ],
      panels: [
        {
          title: "Incident Queue",
          description: "Most recent reports.",
          items: [
            { label: "Court spill", value: "Volleyball sideline mopped and cleared", tone: "success" },
            { label: "Equipment crack", value: "Badminton racquet quarantined", tone: "warning" },
          ],
        },
      ],
    },
    schedule: {
      slug: "schedule",
      eyebrow: "Staff / Schedule",
      title: "Personal shift planning with visibility into busy booking windows.",
      description:
        "Align staffing with forecasted demand so the team is strongest during high check-in and payment verification periods.",
      metrics: [
        { id: "coverage", label: "Coverage Today", value: 100, suffix: "%", trend: 0.0 },
        { id: "peak", label: "Peak Staffing Slots", value: 3, trend: 1.0 },
        { id: "ot", label: "Overtime Hours", value: 2, suffix: "hrs", trend: -0.5 },
      ],
      panels: [
        {
          title: "Next Shift Plan",
          description: "Upcoming scheduling adjustments.",
          items: [
            { label: "18:00-21:00", value: "Two desk staff + one floor runner", tone: "info" },
            { label: "21:00-close", value: "Single desk staff acceptable", tone: "neutral" },
          ],
        },
      ],
    },
  },
};

export const displayTicker =
  "CourtHub live updates: Pickleball B released after no-show • Volleyball grace period warning active • Basketball full court next slot at 18:00 • QR check-in average 4.3 seconds";

export const getSectionData = async (scope: DashboardScope, section = "root") => {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return sectionData[scope][section] ?? null;
};

export const getBundlesBySport = async (sport: SportType) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return EQUIPMENT_BUNDLES.filter((bundle) => bundle.sport === sport);
};

export const getDisplayViews = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return DISPLAY_ROTATION_VIEWS;
};
