import {
  CalendarSourceDefinition,
  EventAudience,
  NormalizedCalendarEvent,
  RawIcsCalendarEvent,
  RawJsonCalendarEvent,
} from "../types/calendarTypes";
import { endOfDay, toDate } from "./calendarDates";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildId(prefix: string, title: string, start: string, index: number): string {
  return `${prefix}-${slugify(title)}-${start}-${index + 1}`;
}

function normalizeAudience(value?: EventAudience): EventAudience {
  return value ?? "both";
}

function normalizeEnd(start: string, end?: string, allDay?: boolean): string {
  if (end) {
    return new Date(end).toISOString();
  }

  if (allDay) {
    return endOfDay(start).toISOString();
  }

  return new Date(toDate(start).getTime() + 60 * 60 * 1000).toISOString();
}

export function normalizeJsonEvents(
  source: CalendarSourceDefinition,
  events: RawJsonCalendarEvent[],
): NormalizedCalendarEvent[] {
  return events.map((event, index) => {
    const start = new Date(event.start).toISOString();
    const end = normalizeEnd(start, event.end, event.allDay);

    return {
      id: event.id ?? buildId(source.id, event.title, start, index),
      title: event.title,
      description: event.description ?? "",
      start,
      end,
      allDay: event.allDay ?? false,
      sourceId: source.id,
      sourceLabel: source.label,
      sourceType: source.type,
      category: event.category ?? source.category,
      audience: normalizeAudience(event.audience ?? source.audience),
      location: event.location ?? "",
      notes: event.notes ?? "",
      affectsSessions: event.affectsSessions ?? false,
      cancellationPolicyApplies: event.cancellationPolicyApplies ?? source.category === "session",
      cancellationDeadline: event.cancellationDeadline,
      cancellationLeadHours: event.cancellationLeadHours,
      visibleToParents: event.visibleToParents ?? source.visibility.visibleToParents,
      visibleToAdmins: event.visibleToAdmins ?? source.visibility.visibleToAdmins,
    };
  });
}

export function normalizeIcsEvents(
  source: CalendarSourceDefinition,
  events: RawIcsCalendarEvent[],
): NormalizedCalendarEvent[] {
  return events.map((event, index) => {
    const start = new Date(event.dtstart).toISOString();
    const end = normalizeEnd(start, event.dtend, event.allDay);

    return {
      id: event.uid ?? buildId(source.id, event.summary ?? "calendar-event", start, index),
      title: event.summary ?? source.label,
      description: event.description ?? "",
      start,
      end,
      allDay: event.allDay ?? false,
      sourceId: source.id,
      sourceLabel: source.label,
      sourceType: source.type,
      category: source.category,
      audience: normalizeAudience(source.audience),
      location: event.location ?? "",
      notes: "",
      affectsSessions: source.category !== "session",
      cancellationPolicyApplies: false,
      visibleToParents: source.visibility.visibleToParents,
      visibleToAdmins: source.visibility.visibleToAdmins,
    };
  });
}
