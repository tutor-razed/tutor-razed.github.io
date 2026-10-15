import fs from "node:fs/promises";
import path from "node:path";

type DistrictConfig = {
  id: string;
  name: string;
  districtKey: string;
  province: string;
  calendarUrl: string;
  icsUrl: string;
  outputFile: string;
  color: string;
  textColor: string;
  description?: string;
};

type StatRule =
  | {
      kind: "fixed_date";
      month: number;
      day: number;
    }
  | {
      kind: "nth_weekday";
      month: number;
      weekday: number;
      occurrence: number;
    };

type HolidayConfig = {
  name: string;
  dates?: string[];
  rule?: StatRule;
  years?: number[];
};

type ProvinceConfig = {
  code: string;
  name: string;
  outputFile: string;
  color: string;
  textColor: string;
  description?: string;
  holidays: HolidayConfig[];
};

type ParsedEvent = {
  uid?: string;
  title: string;
  description?: string;
  start: string;
  end?: string;
  location?: string;
  allDay: boolean;
};

const rootDir = path.resolve(import.meta.dirname, "..");
const configDir = path.join(rootDir, "config");
const publicCalendarDir = path.join(rootDir, "public", "calendar-sources");
const generatedSourcesPath = path.join(rootDir, "src", "features", "calendar", "data", "generatedSources.ts");

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unfoldIcs(content: string): string[] {
  return content.replace(/\r\n[ \t]/g, "").split(/\r?\n/);
}

function parseIcsDate(value: string): { iso: string; allDay: boolean } {
  if (/^\d{8}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    return { iso: `${year}-${month}-${day}T00:00:00`, allDay: true };
  }

  if (/^\d{8}T\d{6}Z$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    const hour = value.slice(9, 11);
    const minute = value.slice(11, 13);
    const second = value.slice(13, 15);
    return { iso: `${year}-${month}-${day}T${hour}:${minute}:${second}Z`, allDay: false };
  }

  if (/^\d{8}T\d{6}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    const hour = value.slice(9, 11);
    const minute = value.slice(11, 13);
    const second = value.slice(13, 15);
    return { iso: `${year}-${month}-${day}T${hour}:${minute}:${second}`, allDay: false };
  }

  return { iso: value, allDay: false };
}

function parseIcs(content: string): ParsedEvent[] {
  const lines = unfoldIcs(content);
  const events: ParsedEvent[] = [];
  let active: Partial<ParsedEvent> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      active = { allDay: false };
      continue;
    }

    if (line === "END:VEVENT") {
      if (active?.title && active.start) {
        events.push(active as ParsedEvent);
      }
      active = null;
      continue;
    }

    if (!active) continue;

    const separator = line.indexOf(":");
    if (separator < 0) continue;

    const key = line.slice(0, separator).split(";")[0];
    const value = line.slice(separator + 1);

    switch (key) {
      case "UID":
        active.uid = value;
        break;
      case "SUMMARY":
        active.title = value;
        break;
      case "DESCRIPTION":
        active.description = value.replace(/\\n/g, "\n");
        break;
      case "LOCATION":
        active.location = value;
        break;
      case "DTSTART": {
        const parsed = parseIcsDate(value);
        active.start = parsed.iso;
        active.allDay = parsed.allDay;
        break;
      }
      case "DTEND":
        active.end = parseIcsDate(value).iso;
        break;
      default:
        break;
    }
  }

  return events;
}

function inferDistrictCategory(title: string): "school-break" | "school-closure" {
  const normalized = title.toLowerCase();
  if (normalized.includes("break") || normalized.includes("vacation")) {
    return "school-break";
  }
  return "school-closure";
}

function formatDateParts(year: number, month: number, day: number): string {
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function nthWeekdayOfMonth(year: number, month: number, weekday: number, occurrence: number): string {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  const day = 1 + offset + (occurrence - 1) * 7;
  return formatDateParts(year, month, day);
}

function expandHolidayDates(holiday: HolidayConfig): string[] {
  if (holiday.dates && holiday.dates.length > 0) {
    return holiday.dates;
  }

  if (!holiday.rule || !holiday.years || holiday.years.length === 0) {
    return [];
  }

  if (holiday.rule.kind === "fixed_date") {
    return holiday.years.map((year) => formatDateParts(year, holiday.rule!.month, holiday.rule!.day));
  }

  return holiday.years.map((year) =>
    nthWeekdayOfMonth(year, holiday.rule!.month, holiday.rule!.weekday, holiday.rule!.occurrence),
  );
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
}

async function writeJsonFile(filePath: string, payload: unknown): Promise<void> {
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function syncDistrictCalendars(districts: DistrictConfig[]) {
  const sources: string[] = [];

  for (const district of districts) {
    if (!district.icsUrl || district.icsUrl.includes("example.com")) {
      console.log(`Skipping ${district.name}: replace the placeholder ICS URL first.`);
      continue;
    }

    const response = await fetch(district.icsUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${district.name}: HTTP ${response.status}`);
    }

    const events = parseIcs(await response.text()).map((event) => ({
      id: event.uid ?? `${district.id}-${slugify(event.title)}-${event.start}`,
      title: event.title,
      description: event.description ?? "",
      start: event.start,
      end: event.end ?? event.start,
      allDay: event.allDay,
      category: inferDistrictCategory(event.title),
      location: event.location ?? "",
      affectsSessions: true,
      visibleToParents: true,
      visibleToAdmins: true,
    }));

    await writeJsonFile(path.join(publicCalendarDir, district.outputFile), events);
    sources.push(district.id);
    console.log(`Updated district calendar: ${district.name}`);
  }

  return sources;
}

async function syncProvincialStats(provinces: ProvinceConfig[]) {
  for (const province of provinces) {
    const events = province.holidays.flatMap((holiday) =>
      expandHolidayDates(holiday).map((date) => ({
        id: `${province.code.toLowerCase()}-${slugify(holiday.name)}-${date}`,
        title: holiday.name,
        description: `${province.name} statutory holiday.`,
        start: `${date}T00:00:00`,
        end: `${date}T23:59:00`,
        allDay: true,
        category: "holiday",
        affectsSessions: true,
        visibleToParents: true,
        visibleToAdmins: true,
      })),
    );

    await writeJsonFile(path.join(publicCalendarDir, province.outputFile), events);
    console.log(`Updated stat holiday calendar: ${province.name}`);
  }
}

function buildGeneratedSourcesFile(districts: DistrictConfig[], provinces: ProvinceConfig[]): string {
  const provinceLabels = provinces
    .map((province) => `  ${province.code}: ${JSON.stringify(province.name)},`)
    .join("\n");

  const statSources = provinces
    .map(
      (province) => `  {
    id: ${JSON.stringify(`${province.code.toLowerCase()}-stat-holidays`)},
    label: ${JSON.stringify(`${province.code} statutory holidays`)},
    type: "json",
    group: "stats",
    province: ${JSON.stringify(province.code)},
    path: ${JSON.stringify(`/calendar-sources/${province.outputFile}`)},
    enabled: true,
    category: "holiday",
    autoSelectWithDistrict: true,
    metadata: {
      color: ${JSON.stringify(province.color)},
      textColor: ${JSON.stringify(province.textColor)},
      description: ${JSON.stringify(province.description ?? `${province.name} holidays.`)},
    },
    audience: "both",
    visibility: { visibleToParents: true, visibleToAdmins: true },
  },`,
    )
    .join("\n");

  const districtSources = districts
    .map(
      (district) => `  {
    id: ${JSON.stringify(district.id)},
    label: ${JSON.stringify(district.name)},
    districtKey: ${JSON.stringify(district.districtKey)},
    districtName: ${JSON.stringify(district.name)},
    province: ${JSON.stringify(district.province)},
    type: "ics-json",
    group: "district",
    path: ${JSON.stringify(`/calendar-sources/${district.outputFile}`)},
    enabled: true,
    category: "school-closure",
    metadata: {
      color: ${JSON.stringify(district.color)},
      textColor: ${JSON.stringify(district.textColor)},
      description: ${JSON.stringify(district.description ?? "District closures imported from a public calendar feed.")},
    },
    audience: "both",
    visibility: { visibleToParents: true, visibleToAdmins: true },
    notes: ${JSON.stringify(`Calendar URL: ${district.calendarUrl} | ICS: ${district.icsUrl}`)},
  },`,
    )
    .join("\n");

  return `import { CalendarSourceDefinition } from "../types/calendarTypes";

export const GENERATED_PROVINCE_LABELS: Record<string, string> = {
${provinceLabels}
};

export const GENERATED_CALENDAR_SOURCES: CalendarSourceDefinition[] = [
${statSources}
${districtSources}
];
`;
}

async function main() {
  const districtConfig = await readJsonFile<{ districts: DistrictConfig[] }>(
    path.join(configDir, "calendar-districts.json"),
  );
  const provincialStatsConfig = await readJsonFile<{ provinces: ProvinceConfig[] }>(
    path.join(configDir, "provincial-stats.json"),
  );

  await syncDistrictCalendars(districtConfig.districts);
  await syncProvincialStats(provincialStatsConfig.provinces);
  await fs.writeFile(
    generatedSourcesPath,
    buildGeneratedSourcesFile(districtConfig.districts, provincialStatsConfig.provinces),
    "utf8",
  );

  console.log("Updated generated source registry.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
