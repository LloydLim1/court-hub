"use client";

import type { SportType } from "@courthub/domain";

const surfaceThemes: Record<SportType, { fill: string; stroke: string; accent: string }> = {
  basketball: { fill: "#b45309", stroke: "#fef3c7", accent: "#fb923c" },
  volleyball: { fill: "#166534", stroke: "#dcfce7", accent: "#4ade80" },
  pickleball: { fill: "#0f3b5f", stroke: "#dbeafe", accent: "#38bdf8" },
  badminton: { fill: "#4c1d95", stroke: "#f3e8ff", accent: "#c084fc" },
};

export function SportCourtVisual({
  sport,
  className = "",
}: {
  sport: SportType;
  className?: string;
}) {
  const theme = surfaceThemes[sport];

  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 200 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill={theme.fill} height="120" rx="18" width="200" />
      {sport === "basketball" ? (
        <>
          <rect height="108" rx="14" stroke={theme.stroke} strokeWidth="2" width="188" x="6" y="6" />
          <line stroke={theme.stroke} strokeWidth="2" x1="100" x2="100" y1="6" y2="114" />
          <circle cx="100" cy="60" r="16" stroke={theme.stroke} strokeWidth="2" />
          <rect height="46" rx="8" stroke={theme.stroke} strokeWidth="2" width="28" x="6" y="37" />
          <rect height="46" rx="8" stroke={theme.stroke} strokeWidth="2" width="28" x="166" y="37" />
          <path d="M34 32C55 32 61 45 61 60C61 75 55 88 34 88" stroke={theme.stroke} strokeWidth="2" />
          <path d="M166 32C145 32 139 45 139 60C139 75 145 88 166 88" stroke={theme.stroke} strokeWidth="2" />
          <circle cx="24" cy="60" fill={theme.accent} r="3" />
          <circle cx="176" cy="60" fill={theme.accent} r="3" />
        </>
      ) : null}
      {sport === "volleyball" ? (
        <>
          <rect height="108" rx="14" stroke={theme.stroke} strokeWidth="2" width="188" x="6" y="6" />
          <line stroke={theme.stroke} strokeWidth="2" x1="100" x2="100" y1="6" y2="114" />
          <line stroke={theme.stroke} strokeWidth="2" x1="65" x2="65" y1="6" y2="114" />
          <line stroke={theme.stroke} strokeWidth="2" x1="135" x2="135" y1="6" y2="114" />
          <line stroke={theme.accent} strokeDasharray="4 4" strokeWidth="3" x1="100" x2="100" y1="10" y2="110" />
          <circle cx="100" cy="60" fill={theme.accent} r="4" />
        </>
      ) : null}
      {sport === "pickleball" ? (
        <>
          <rect height="108" rx="14" stroke={theme.stroke} strokeWidth="2" width="188" x="6" y="6" />
          <line stroke={theme.stroke} strokeWidth="2" x1="100" x2="100" y1="6" y2="114" />
          <line stroke={theme.stroke} strokeWidth="2" x1="40" x2="160" y1="60" y2="60" />
          <line stroke={theme.stroke} strokeWidth="2" x1="60" x2="60" y1="24" y2="96" />
          <line stroke={theme.stroke} strokeWidth="2" x1="140" x2="140" y1="24" y2="96" />
          <line stroke={theme.accent} strokeWidth="3" x1="100" x2="100" y1="24" y2="96" />
          <rect fill={theme.accent} height="8" rx="4" width="52" x="74" y="56" />
        </>
      ) : null}
      {sport === "badminton" ? (
        <>
          <rect height="108" rx="14" stroke={theme.stroke} strokeWidth="2" width="188" x="6" y="6" />
          <line stroke={theme.stroke} strokeWidth="2" x1="100" x2="100" y1="6" y2="114" />
          <line stroke={theme.stroke} strokeWidth="2" x1="53" x2="147" y1="26" y2="26" />
          <line stroke={theme.stroke} strokeWidth="2" x1="53" x2="147" y1="94" y2="94" />
          <line stroke={theme.stroke} strokeWidth="2" x1="53" x2="147" y1="46" y2="46" />
          <line stroke={theme.stroke} strokeWidth="2" x1="53" x2="147" y1="74" y2="74" />
          <line stroke={theme.accent} strokeWidth="3" x1="100" x2="100" y1="20" y2="100" />
          <circle cx="100" cy="60" fill={theme.accent} r="4" />
        </>
      ) : null}
    </svg>
  );
}
