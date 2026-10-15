import { NormalizedCalendarEvent, SessionStatus } from "../types/calendarTypes";
import { addHours, differenceInHours, formatDateTime, isPast, toDate } from "./calendarDates";

export function calculateCancellationDeadline(
  session: NormalizedCalendarEvent,
  fallbackLeadHours = 24,
): string | undefined {
  if (!session.cancellationPolicyApplies) {
    return session.cancellationDeadline;
  }

  if (session.cancellationDeadline) {
    return session.cancellationDeadline;
  }

  return addHours(session.start, -(session.cancellationLeadHours ?? fallbackLeadHours)).toISOString();
}

export function isCancellationWindowOpen(
  session: NormalizedCalendarEvent,
  now = new Date(),
): boolean {
  const deadline = calculateCancellationDeadline(session);
  return deadline ? !isPast(deadline, now) : true;
}

export function getSessionStatus(
  session: NormalizedCalendarEvent,
  options: {
    hasHolidayConflict?: boolean;
    hasSchoolClosureConflict?: boolean;
    hasTutorUnavailableConflict?: boolean;
    now?: Date;
  } = {},
): SessionStatus {
  if (options.hasTutorUnavailableConflict) return "tutor-unavailable-conflict";
  if (options.hasSchoolClosureConflict) return "school-closure-conflict";
  if (options.hasHolidayConflict) return "holiday-conflict";

  const deadline = calculateCancellationDeadline(session);
  if (!deadline) return "normal";
  if (!isCancellationWindowOpen(session, options.now)) return "cancellation-closed";

  return differenceInHours(options.now ?? new Date(), deadline) <= 48 ? "upcoming-deadline" : "normal";
}

export function describeCancellationDeadline(session: NormalizedCalendarEvent): string {
  const deadline = calculateCancellationDeadline(session);
  return deadline ? formatDateTime(deadline) : "No cancellation deadline set";
}

export function isUpcomingSession(session: NormalizedCalendarEvent, now = new Date()): boolean {
  return toDate(session.end).getTime() >= now.getTime();
}
