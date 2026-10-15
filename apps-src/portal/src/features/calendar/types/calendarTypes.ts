export type CalendarSourceType = "json" | "config" | "ics" | "ics-json";

export type EventCategory =
  | "session"
  | "holiday"
  | "school-closure"
  | "school-break"
  | "tutor-unavailable"
  | "custom"
  | "cancellation";

export type EventAudience = "parents" | "admins" | "both";

export type CalendarLoadStatus = "idle" | "loading" | "ready" | "error";

export type SessionStatus =
  | "normal"
  | "upcoming-deadline"
  | "cancellation-closed"
  | "holiday-conflict"
  | "school-closure-conflict"
  | "tutor-unavailable-conflict";

export interface SourceVisibility {
  visibleToParents: boolean;
  visibleToAdmins: boolean;
}

export interface SourceMetadata {
  color: string;
  textColor: string;
  description?: string;
}

export interface CalendarSourceDefinition {
  id: string;
  label: string;
  type: CalendarSourceType;
  group?: "sessions" | "district" | "stats" | "availability" | "custom";
  province?: string;
  districtKey?: string;
  districtName?: string;
  autoSelectWithDistrict?: boolean;
  path?: string;
  url?: string;
  enabled: boolean;
  category: EventCategory;
  metadata: SourceMetadata;
  audience?: EventAudience;
  visibility: SourceVisibility;
  supportsBrowserFetch?: boolean;
  notes?: string;
}

export interface RawJsonCalendarEvent {
  id?: string;
  title: string;
  description?: string;
  start: string;
  end?: string;
  allDay?: boolean;
  category?: EventCategory;
  audience?: EventAudience;
  location?: string;
  notes?: string;
  affectsSessions?: boolean;
  cancellationPolicyApplies?: boolean;
  cancellationDeadline?: string;
  cancellationLeadHours?: number;
  visibleToParents?: boolean;
  visibleToAdmins?: boolean;
}

export interface RawIcsCalendarEvent {
  uid?: string;
  summary?: string;
  description?: string;
  dtstart: string;
  dtend?: string;
  location?: string;
  allDay?: boolean;
}

export interface NormalizedCalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean;
  sourceId: string;
  sourceLabel: string;
  sourceType: CalendarSourceType;
  category: EventCategory;
  audience: EventAudience;
  location: string;
  notes: string;
  affectsSessions: boolean;
  cancellationPolicyApplies: boolean;
  cancellationDeadline?: string;
  cancellationLeadHours?: number;
  visibleToParents: boolean;
  visibleToAdmins: boolean;
}

export interface CalendarSourceResult {
  source: CalendarSourceDefinition;
  status: CalendarLoadStatus;
  events: NormalizedCalendarEvent[];
  error?: string;
}

export interface SessionWarning {
  kind:
    | "deadline"
    | "holiday"
    | "school-closure"
    | "school-break"
    | "tutor-unavailable";
  message: string;
  relatedEventId?: string;
}

export interface CalendarFiltersState {
  search: string;
  categories: EventCategory[];
  sourceIds: string[];
  parentVisibleOnly: boolean;
}

export interface CalendarPreferences {
  selectedDistrictId: string;
  selectedProvinceCodes: string[];
}
