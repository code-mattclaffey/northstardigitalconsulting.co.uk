import type { HomepageContent } from "./homepage";

/** How many days before the contract ends the "available" highlight starts. */
export const AVAILABILITY_WINDOW_DAYS = 30;

export type AvailabilityState = "soon" | "now" | undefined;

export interface Availability {
  /** Contract end as YYYY-MM-DD, or undefined when the highlight is off. */
  endDate?: string;
  /** e.g. "31 January", for the "Available from" pill. */
  label: string;
  /** State at build time. The inline script in Layout re-checks in the browser. */
  state: AvailabilityState;
}

/**
 * Works out the availability highlight from the homepage entry. The highlight
 * only runs when `highlightAvailability` is on and an expiry date is set.
 */
export function getAvailability(
  homepage: Pick<
    HomepageContent,
    "currentContractExpiry" | "highlightAvailability"
  >,
  now = Date.now(),
): Availability {
  const { currentContractExpiry: expiry, highlightAvailability } = homepage;
  if (!expiry || highlightAvailability === false)
    return { label: "", state: undefined };

  const endDate = expiry.slice(0, 10);
  const end = new Date(`${endDate}T00:00:00Z`);
  if (Number.isNaN(end.getTime())) return { label: "", state: undefined };

  const label = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(end);
  const daysLeft = (end.getTime() - now) / 86_400_000;
  const state: AvailabilityState =
    daysLeft <= 0
      ? "now"
      : daysLeft <= AVAILABILITY_WINDOW_DAYS
        ? "soon"
        : undefined;

  return { endDate, label, state };
}
