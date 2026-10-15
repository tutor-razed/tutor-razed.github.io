# Tutor Razed Portal

Static-first React + Vite portal for GitHub Pages deployment.

## Calendar Module

This app now includes a `Calendar and Session Awareness` feature focused on reducing late cancellations by making the following obvious:

- upcoming tutoring sessions
- BC statutory holidays
- school closures, breaks, and non-instructional days
- tutor unavailable dates
- session overlap conflicts
- cancellation deadlines
- parent-selected school district calendars stored locally in the browser
- parent-selected province stat holiday calendars with auto-match from district province

## Proposed File Structure

```text
apps-src/portal/
  App.tsx
  components/
  pages/
  public/
    calendar-sources/
      bc-stat-holidays.json
      burnaby-district.json
      surrey-district.json
      calgary-catholic-district.json
      ab-stat-holidays.json
      on-stat-holidays.json
      tutoring-sessions.json
      tutor-unavailable.json
      custom-events.json
  scripts/
    convert-ics-to-json.ts
  src/
    features/
      calendar/
        components/
          CalendarMonthView.tsx
          CalendarSetupPanel.tsx
          EventDetailsModal.tsx
        data/
          mockSources.ts
        hooks/
          useCalendarEvents.ts
        pages/
          CalendarPage.tsx
        services/
          calendarPreferencesStorage.ts
          calendarSourceLoader.ts
        types/
          calendarTypes.ts
        utils/
          calendarDates.ts
          cancellationPolicy.ts
          eventOverlap.ts
          normalizeCalendarEvents.ts
```

## GitHub Pages Notes

- Routing: the app uses `HashRouter`, which avoids refresh and deep-link problems on GitHub Pages.
- Base path: set `VITE_BASE_PATH` for production if the app is deployed under a repository subpath.
- Static data: calendar source JSON files live in `public/calendar-sources/` and are fetched in the browser.
- Parent preferences: selected district and province holiday calendars are stored in `localStorage` on that device.
- Runtime assumptions: v1 does not require a backend, database, server cron, or private secrets.
- Failure handling: remote ICS feeds are optional. If they fail because of CORS or availability, local JSON sources still render.

### Example base-path config

For a repo deployed to `https://<user>.github.io/<repo>/`, build with:

```bash
VITE_BASE_PATH=/<repo>/ npm run build
```

## Adding Or Updating Calendar Sources

### Add a new district or stat-holiday source

1. Add a JSON file under `public/calendar-sources/`.
2. Register the source in `src/features/calendar/data/mockSources.ts`.
3. For district calendars, include `districtName`, `districtKey`, and `province`.
4. For stat calendars, include the matching `province` code.

### Update holiday or school calendar data

1. Edit the checked-in JSON file in `public/calendar-sources/`.
2. Rebuild the app.
3. Deploy the updated static files to GitHub Pages.

### Handle a public ICS feed

Use a live ICS source only if the feed supports browser CORS. Otherwise:

1. Run the optional preprocessing script to convert ICS to JSON.
2. Commit the generated JSON into `public/calendar-sources/`.
3. Point the source definition at the JSON file instead of the live ICS URL.

## Data Model Summary

Normalized events include:

- `id`
- `title`
- `description`
- `start`
- `end`
- `allDay`
- `sourceId`
- `sourceLabel`
- `sourceType`
- `category`
- `audience`
- `location`
- `notes`
- `affectsSessions`
- `cancellationPolicyApplies`
- `cancellationDeadline`
- `visibleToParents`
- `visibleToAdmins`

## Parent Setup Behavior

The parent-facing setup is intentionally simple for static hosting:

- choose one school district calendar
- optionally add one or more province stat-holiday calendars
- automatically include the selected district's province stat holidays
- keep those choices in `localStorage`

Canonical shared data remains in checked-in JSON files.

## Optional ICS Preprocessing

`scripts/convert-ics-to-json.ts` is an optional prep tool. It is not required at runtime and should be treated as a local maintenance helper for static deployments.

## Future Backend Or Serverless Options

These are not required for GitHub Pages v1, but the structure is designed so they can be added later:

- serverless config persistence for shared admin edits
- authenticated parent/student calendars
- reminder email or SMS integrations
- Google Calendar / Outlook sync
- attendance and reschedule workflows
- conflict and cancellation analytics

## Run Locally

```bash
npm install
npm run dev
```
