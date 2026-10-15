import { useEffect, useMemo, useState } from "react";
import { MOCK_CALENDAR_SOURCES } from "../data/mockSources";
import { getCalendarPreferences, saveCalendarPreferences } from "../services/calendarPreferencesStorage";
import { loadCalendarSource } from "../services/calendarSourceLoader";
import {
  CalendarPreferences,
  CalendarSourceResult,
} from "../types/calendarTypes";

export function useCalendarEvents() {
  const [results, setResults] = useState<CalendarSourceResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<CalendarPreferences>(() => getCalendarPreferences());

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all(MOCK_CALENDAR_SOURCES.map((source) => loadCalendarSource(source))).then((nextResults) => {
      if (!isMounted) return;
      setResults(nextResults);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const districtSources = useMemo(
    () => MOCK_CALENDAR_SOURCES.filter((source) => source.group === "district"),
    [],
  );

  const statSources = useMemo(
    () => MOCK_CALENDAR_SOURCES.filter((source) => source.group === "stats"),
    [],
  );

  const selectedDistrict = useMemo(
    () => districtSources.find((source) => source.id === preferences.selectedDistrictId) ?? null,
    [districtSources, preferences.selectedDistrictId],
  );

  const activeProvinceCodes = useMemo(() => {
    const fromPreference = new Set(preferences.selectedProvinceCodes);
    if (selectedDistrict?.province) {
      fromPreference.add(selectedDistrict.province);
    }
    return Array.from(fromPreference);
  }, [preferences.selectedProvinceCodes, selectedDistrict]);

  const activeSourceIds = useMemo(() => {
    return MOCK_CALENDAR_SOURCES.filter((source) => {
      if (source.group === "district") return source.id === preferences.selectedDistrictId;
      if (source.group === "stats") return !!source.province && activeProvinceCodes.includes(source.province);
      return false;
    }).map((source) => source.id);
  }, [activeProvinceCodes, preferences.selectedDistrictId]);

  const events = useMemo(() => {
    return results
      .filter((result) => activeSourceIds.includes(result.source.id))
      .flatMap((result) => result.events)
      .sort((left, right) => {
        const byStart = new Date(left.start).getTime() - new Date(right.start).getTime();
        return byStart !== 0 ? byStart : left.title.localeCompare(right.title);
      });
  }, [activeSourceIds, results]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => event.visibleToParents);
  }, [events]);

  function updatePreferences(nextPreferences: CalendarPreferences) {
    setPreferences(saveCalendarPreferences(nextPreferences));
  }

  function setDistrict(districtId: string) {
    updatePreferences({
      ...preferences,
      selectedDistrictId: districtId,
    });
  }

  function toggleProvince(provinceCode: string) {
    const nextProvinceCodes = preferences.selectedProvinceCodes.includes(provinceCode)
      ? preferences.selectedProvinceCodes.filter((code) => code !== provinceCode)
      : [...preferences.selectedProvinceCodes, provinceCode];

    updatePreferences({
      ...preferences,
      selectedProvinceCodes: nextProvinceCodes,
    });
  }

  return {
    filteredEvents,
    isLoading,
    preferences,
    results,
    districtSources,
    statSources,
    selectedDistrict,
    activeProvinceCodes,
    setDistrict,
    toggleProvince,
  };
}
