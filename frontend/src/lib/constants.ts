// src/lib/constants.ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// canonical source keys
export const REVIEW_SOURCES = {
  airbnb: "airbnb",
  booking: "booking",
  google: "google",
  hostaway: "hostaway",
  manual: "manual",
  unknown: "unknown",
} as const;

// styles & emoji icons for each canonical key
export const SOURCE_STYLES: Record<string, { color: string; icon: string; label: string }> = {
  [REVIEW_SOURCES.airbnb]: {
    color: "from-pink-500 to-rose-500",
    icon: "🏠",
    label: "Airbnb",
  },
  [REVIEW_SOURCES.booking]: {
    color: "from-blue-500 to-cyan-500",
    icon: "🌐",
    label: "Booking.com",
  },
  [REVIEW_SOURCES.google]: {
    color: "from-yellow-500 to-orange-500",
    icon: "⭐",
    label: "Google",
  },
  [REVIEW_SOURCES.hostaway]: {
    color: "from-purple-500 to-indigo-500",
    icon: "🛎️",
    label: "Hostaway",
  },
  [REVIEW_SOURCES.manual]: {
    color: "from-green-500 to-emerald-500",
    icon: "✍️",
    label: "Manual",
  },
  [REVIEW_SOURCES.unknown]: {
    color: "from-gray-500 to-gray-400",
    icon: "❓",
    label: "Unknown",
  },
};

export const REVIEW_SOURCE_LABELS: Record<string, string> = {
  [REVIEW_SOURCES.airbnb]: "Airbnb",
  [REVIEW_SOURCES.booking]: "Booking.com",
  [REVIEW_SOURCES.google]: "Google",
  [REVIEW_SOURCES.hostaway]: "Hostaway",
  [REVIEW_SOURCES.manual]: "Manual",
  [REVIEW_SOURCES.unknown]: "Unknown",
};

// statuses (kept same)
export const REVIEW_STATUSES = {
  approved: "approved",
  pending: "pending",
  rejected: "rejected",
} as const;

export const REVIEW_STATUS_LABELS: Record<string, string> = {
  [REVIEW_STATUSES.approved]: "Approved",
  [REVIEW_STATUSES.pending]: "Pending",
  [REVIEW_STATUSES.rejected]: "Rejected",
};
