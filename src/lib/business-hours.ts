import type { DayHours } from "@/lib/directory-data";

/**
 * Business hours utilities — compute open/closed status from weekly hours.
 *
 * Time format in data: "9:00 AM", "11:00 PM", "12:00 AM" (midnight), etc.
 * Day format: "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
 */

/** Convert "9:00 AM" → minutes since midnight (540). Returns null if invalid. */
export function parseTimeToMinutes(time: string): number | null {
  if (!time) return null;
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let [, h, m, period] = match;
  let hour = parseInt(h, 10);
  const min = parseInt(m, 10);
  if (period.toUpperCase() === "PM" && hour < 12) hour += 12;
  if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
  return hour * 60 + min;
}

/** Get current day as "Mon", "Tue", etc. */
export function getCurrentDay(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "short" });
}

/** Get current time in minutes since midnight. */
export function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Check if a business is currently open based on its weekly hours.
 *
 * Handles overnight ranges (e.g., "Open 24 hours" stored as 12:00 AM – 11:59 PM).
 * Returns true only if today's hours include the current time.
 */
export function isBusinessOpen(weeklyHours: DayHours[]): boolean {
  const today = getCurrentDay();
  const nowMin = getCurrentMinutes();

  const todayHours = weeklyHours.find((h) => h.day === today);
  if (!todayHours || todayHours.closed) return false;

  const openMin = parseTimeToMinutes(todayHours.open);
  const closeMin = parseTimeToMinutes(todayHours.close);

  if (openMin === null || closeMin === null) return false;

  // Handle 24-hour businesses (12:00 AM – 11:59 PM = 0 – 1439)
  if (openMin === 0 && closeMin >= 1439) return true;

  // Handle overnight ranges (close < open, e.g., 9 PM – 2 AM)
  if (closeMin < openMin) {
    return nowMin >= openMin || nowMin <= closeMin;
  }

  return nowMin >= openMin && nowMin <= closeMin;
}

/**
 * Get a human-readable "open until" or "opens at" label.
 *
 * Examples:
 *   "Open until 9:00 PM"
 *   "Opens at 9:00 AM tomorrow"
 *   "Closed"
 */
export function getOpenStatus(weeklyHours: DayHours[]): {
  isOpen: boolean;
  label: string;
} {
  const isOpen = isBusinessOpen(weeklyHours);
  const today = getCurrentDay();
  const todayHours = weeklyHours.find((h) => h.day === today);

  if (!todayHours || todayHours.closed) {
    // Find next open day
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const todayIdx = days.indexOf(today);
    for (let i = 1; i <= 7; i++) {
      const nextDay = days[(todayIdx + i) % 7];
      const nextHours = weeklyHours.find((h) => h.day === nextDay);
      if (nextHours && !nextHours.closed) {
        const dayLabel = i === 1 ? "tomorrow" : `on ${nextDay}`;
        return { isOpen: false, label: `Opens ${dayLabel} at ${nextHours.open}` };
      }
    }
    return { isOpen: false, label: "Closed" };
  }

  if (isOpen) {
    return { isOpen: true, label: `Open until ${todayHours.close}` };
  }

  // Closed today but has hours — check if it opens later today
  const nowMin = getCurrentMinutes();
  const openMin = parseTimeToMinutes(todayHours.open);
  if (openMin !== null && nowMin < openMin) {
    return { isOpen: false, label: `Opens at ${todayHours.open}` };
  }

  // Closed for the day
  return { isOpen: false, label: "Closed" };
}
