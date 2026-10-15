import { useEffect, useMemo, useState } from "react";
import { CalendarSourceDefinition, NormalizedCalendarEvent, RawJsonCalendarEvent } from "../types/calendarTypes";
import { normalizeJsonEvents } from "../utils/normalizeCalendarEvents";

const tutoringSource: CalendarSourceDefinition = {
  id: "tutoring-sessions",
  label: "Tutoring sessions",
  type: "json",
  group: "sessions",
  path: "/calendar-sources/tutoring-sessions.json",
  enabled: true,
  category: "session",
  metadata: {
    color: "#0ea5e9",
    textColor: "#082f49",
    description: "Tutoring sessions with cancellation deadlines.",
  },
  audience: "both",
  visibility: { visibleToParents: true, visibleToAdmins: true },
};

function withBasePath(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function useTutoringSessions() {
  const [sessions, setSessions] = useState<NormalizedCalendarEvent[]>([]);

  useEffect(() => {
    let isMounted = true;

    fetch(withBasePath(tutoringSource.path ?? ""))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json() as Promise<RawJsonCalendarEvent[]>;
      })
      .then((payload) => {
        if (!isMounted) return;
        setSessions(normalizeJsonEvents(tutoringSource, payload));
      })
      .catch(() => {
        if (!isMounted) return;
        setSessions([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(
    () =>
      sessions.sort(
        (left, right) => new Date(left.start).getTime() - new Date(right.start).getTime(),
      ),
    [sessions],
  );
}
