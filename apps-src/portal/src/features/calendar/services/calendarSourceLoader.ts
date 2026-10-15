import { normalizeIcsEvents, normalizeJsonEvents } from "../utils/normalizeCalendarEvents";
import {
  CalendarSourceDefinition,
  CalendarSourceResult,
  RawIcsCalendarEvent,
  RawJsonCalendarEvent,
} from "../types/calendarTypes";

function withBasePath(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function unfoldIcs(content: string): string[] {
  return content.replace(/\r\n[ \t]/g, "").split(/\r?\n/);
}

function parseIcsDate(value: string): { iso: string; allDay: boolean } {
  if (/^\d{8}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    return { iso: new Date(`${year}-${month}-${day}T00:00:00`).toISOString(), allDay: true };
  }

  if (/^\d{8}T\d{6}Z$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    const hour = value.slice(9, 11);
    const minute = value.slice(11, 13);
    const second = value.slice(13, 15);
    return {
      iso: new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`).toISOString(),
      allDay: false,
    };
  }

  if (/^\d{8}T\d{6}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    const hour = value.slice(9, 11);
    const minute = value.slice(11, 13);
    const second = value.slice(13, 15);
    return {
      iso: new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).toISOString(),
      allDay: false,
    };
  }

  return { iso: new Date(value).toISOString(), allDay: false };
}

function parseIcs(content: string): RawIcsCalendarEvent[] {
  const lines = unfoldIcs(content);
  const events: RawIcsCalendarEvent[] = [];
  let active: Partial<RawIcsCalendarEvent> | null = null;

  lines.forEach((line) => {
    if (line === "BEGIN:VEVENT") {
      active = {};
      return;
    }

    if (line === "END:VEVENT") {
      if (active?.dtstart) {
        events.push(active as RawIcsCalendarEvent);
      }
      active = null;
      return;
    }

    if (!active) return;

    const separator = line.indexOf(":");
    if (separator < 0) return;

    const rawKey = line.slice(0, separator);
    const value = line.slice(separator + 1);
    const key = rawKey.split(";")[0];

    switch (key) {
      case "UID":
        active.uid = value;
        break;
      case "SUMMARY":
        active.summary = value;
        break;
      case "DESCRIPTION":
        active.description = value.replace(/\\n/g, "\n");
        break;
      case "LOCATION":
        active.location = value;
        break;
      case "DTSTART": {
        const parsed = parseIcsDate(value);
        active.dtstart = parsed.iso;
        active.allDay = parsed.allDay;
        break;
      }
      case "DTEND":
        active.dtend = parseIcsDate(value).iso;
        break;
      default:
        break;
    }
  });

  return events;
}

async function fetchJson(path: string): Promise<RawJsonCalendarEvent[]> {
  const response = await fetch(withBasePath(path));
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as RawJsonCalendarEvent[];
}

async function fetchIcs(source: CalendarSourceDefinition): Promise<RawIcsCalendarEvent[]> {
  const target = source.url ?? source.path;
  if (!target) {
    throw new Error("ICS source is missing a URL or path.");
  }

  const url = target.startsWith("http") ? target : withBasePath(target);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return parseIcs(await response.text());
}

export async function loadCalendarSource(source: CalendarSourceDefinition): Promise<CalendarSourceResult> {
  if (!source.enabled) {
    return { source, status: "idle", events: [] };
  }

  try {
    if (source.type === "json" || source.type === "ics-json") {
      const events = await fetchJson(source.path ?? "");
      return { source, status: "ready", events: normalizeJsonEvents(source, events) };
    }

    if (source.type === "ics") {
      const events = await fetchIcs(source);
      return { source, status: "ready", events: normalizeIcsEvents(source, events) };
    }

    return { source, status: "ready", events: [] };
  } catch (error) {
    return {
      source,
      status: "error",
      events: [],
      error: error instanceof Error ? error.message : "Unknown calendar load error",
    };
  }
}
