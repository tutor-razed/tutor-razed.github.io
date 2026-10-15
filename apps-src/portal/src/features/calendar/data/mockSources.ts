import { CalendarSourceDefinition, EventCategory } from "../types/calendarTypes";
import { GENERATED_CALENDAR_SOURCES, GENERATED_PROVINCE_LABELS } from "./generatedSources";

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  session: "Tutoring session",
  holiday: "Stat holiday",
  "school-closure": "School closure",
  "school-break": "School break",
  "tutor-unavailable": "Tutor unavailable",
  custom: "Custom event",
  cancellation: "Cancellation reminder",
};

export const CATEGORY_STYLES: Record<EventCategory, { bg: string; text: string; dot: string }> = {
  session: { bg: "bg-sky-100", text: "text-sky-900", dot: "bg-sky-500" },
  holiday: { bg: "bg-rose-100", text: "text-rose-900", dot: "bg-rose-500" },
  "school-closure": { bg: "bg-amber-100", text: "text-amber-900", dot: "bg-amber-500" },
  "school-break": { bg: "bg-orange-100", text: "text-orange-900", dot: "bg-orange-500" },
  "tutor-unavailable": { bg: "bg-violet-100", text: "text-violet-900", dot: "bg-violet-500" },
  custom: { bg: "bg-emerald-100", text: "text-emerald-900", dot: "bg-emerald-500" },
  cancellation: { bg: "bg-stone-200", text: "text-stone-900", dot: "bg-stone-500" },
};

export const PROVINCE_LABELS: Record<string, string> = GENERATED_PROVINCE_LABELS;

export const MOCK_CALENDAR_SOURCES: CalendarSourceDefinition[] = GENERATED_CALENDAR_SOURCES;
