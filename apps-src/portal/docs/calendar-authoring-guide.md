# Calendar Authoring Guide

Use two config files:

- `config/calendar-districts.json`
- `config/provincial-stats.json`

Then run:

```bash
npm run sync-calendars
```

That command will:

1. fetch every district ICS feed
2. regenerate the JSON files in `public/calendar-sources/`
3. regenerate `src/features/calendar/data/generatedSources.ts`

## District Config

Edit `config/calendar-districts.json`.

Each district entry has:

```json
{
  "id": "vancouver-district",
  "name": "Vancouver School Board",
  "districtKey": "vancouver",
  "province": "BC",
  "calendarUrl": "https://district-site.example/calendar",
  "icsUrl": "https://district-site.example/calendar.ics",
  "outputFile": "vancouver-district.json",
  "color": "#f59e0b",
  "textColor": "#78350f",
  "description": "District closures imported from a public calendar feed."
}
```

Notes:

- `calendarUrl` is for reference only.
- `icsUrl` is what the script fetches.
- `outputFile` is the generated JSON file.
- `province` controls which stat holidays auto-attach in the UI.

## Provincial Stats Config

Edit `config/provincial-stats.json`.

You can define holidays in two ways:

### Explicit dates

Good for holidays that move year to year.

```json
{
  "name": "Good Friday",
  "dates": ["2026-04-03", "2027-03-26"]
}
```

### Fixed date

Good for holidays that always fall on the same month/day.

```json
{
  "name": "Canada Day",
  "rule": {
    "kind": "fixed_date",
    "month": 7,
    "day": 1
  },
  "years": [2026, 2027]
}
```

### Nth weekday

Good for rules like "3rd Monday in February".

Weekday values:

- `0` = Sunday
- `1` = Monday
- `2` = Tuesday
- `3` = Wednesday
- `4` = Thursday
- `5` = Friday
- `6` = Saturday

Example:

```json
{
  "name": "Family Day",
  "rule": {
    "kind": "nth_weekday",
    "month": 2,
    "weekday": 1,
    "occurrence": 3
  },
  "years": [2026, 2027]
}
```

## Update Workflow

1. Edit the config JSON.
2. Run:

```bash
npm run sync-calendars
```

3. Review the generated files in `public/calendar-sources/`.
4. Run:

```bash
npm run build
```

## What The District Sync Pulls From ICS

The ICS parser currently reads:

- `UID`
- `SUMMARY`
- `DESCRIPTION`
- `LOCATION`
- `DTSTART`
- `DTEND`

It does not currently expand:

- `RRULE`
- `EXDATE`
- other advanced recurrence features

## District Event Category Defaults

The sync script auto-classifies district events like this:

- titles containing `break` or `vacation` -> `school-break`
- everything else -> `school-closure`

If a district feed needs more precise mapping, that can be added later.
