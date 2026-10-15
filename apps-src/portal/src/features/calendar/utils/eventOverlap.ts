import { NormalizedCalendarEvent, SessionWarning } from "../types/calendarTypes";
import { rangesOverlap } from "./calendarDates";

export function findOverlappingEvents(
  session: NormalizedCalendarEvent,
  events: NormalizedCalendarEvent[],
): NormalizedCalendarEvent[] {
  return events.filter((event) => event.id !== session.id && rangesOverlap(session.start, session.end, event.start, event.end));
}

export function buildSessionWarnings(
  session: NormalizedCalendarEvent,
  overlappingEvents: NormalizedCalendarEvent[],
  cancellationDeadline?: string,
): SessionWarning[] {
  const warnings: SessionWarning[] = [];

  if (cancellationDeadline) {
    warnings.push({
      kind: "deadline",
      message: `Cancel before ${new Date(cancellationDeadline).toLocaleString("en-CA", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}.`,
      relatedEventId: session.id,
    });
  }

  overlappingEvents.forEach((event) => {
    if (event.category === "holiday") {
      warnings.push({ kind: "holiday", message: `Overlaps with ${event.title}.`, relatedEventId: event.id });
    }

    if (event.category === "school-closure" || event.category === "school-break") {
      warnings.push({
        kind: event.category === "school-closure" ? "school-closure" : "school-break",
        message: `Falls during ${event.title}.`,
        relatedEventId: event.id,
      });
    }

    if (event.category === "tutor-unavailable") {
      warnings.push({
        kind: "tutor-unavailable",
        message: `Tutor unavailable: ${event.title}.`,
        relatedEventId: event.id,
      });
    }
  });

  return warnings;
}
