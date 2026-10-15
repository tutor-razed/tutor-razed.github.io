import { CalendarPreferences } from "../types/calendarTypes";

const STORAGE_KEY = "tutor-razed-calendar-preferences";

const defaultPreferences: CalendarPreferences = {
  selectedDistrictId: "",
  selectedProvinceCodes: [],
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getCalendarPreferences(): CalendarPreferences {
  if (!isBrowser()) return defaultPreferences;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultPreferences;

  try {
    return { ...defaultPreferences, ...JSON.parse(raw) } as CalendarPreferences;
  } catch {
    return defaultPreferences;
  }
}

export function saveCalendarPreferences(preferences: CalendarPreferences): CalendarPreferences {
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }
  return preferences;
}
