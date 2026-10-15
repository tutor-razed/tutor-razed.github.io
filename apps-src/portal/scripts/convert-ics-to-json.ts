type ParsedEvent = {
  uid?: string;
  title: string;
  description?: string;
  start: string;
  end?: string;
  location?: string;
  allDay: boolean;
};

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

async function main() {
  const [, , sourceUrl, outputPath] = process.argv;

  if (!sourceUrl || !outputPath) {
    throw new Error("Usage: node scripts/convert-ics-to-json.ts <ics-url> <output-json-path>");
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ICS feed: HTTP ${response.status}`);
  }

  const events = parseIcs(await response.text());
  const fs = await import("node:fs/promises");
  await fs.writeFile(outputPath, `${JSON.stringify(events, null, 2)}\n`, "utf8");
  console.log(`Wrote ${events.length} events to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
