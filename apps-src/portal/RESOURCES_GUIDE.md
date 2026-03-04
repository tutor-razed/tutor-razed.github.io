# How to Update Resources

Edit one root file: `resources.portal.json`.

That file is the source of truth. Build automatically syncs it into `apps-src/portal/public/resources.json`.

## Fastest Way To Add A Resource

Add a new object to the JSON array in `resources.portal.json`.

Use either:
- `downloadUrl`: full URL (`https://...`)
- `path`: short site path (`/headline-to-story/`)

Example:

```json
{
  "title": "Headline to Story",
  "description": "Create a headline and transform it into a story.",
  "subject": "Writing",
  "type": "Website",
  "thumbnail": "https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?q=80&w=735&auto=format&fit=crop",
  "path": "/headline-to-story/",
  "tags": ["Writing", "Creativity"]
}
```

## What Is Automatic

- `id` auto-generated if omitted
- `type` defaults to `Website`
- `rating` defaults to `0`
- `tags` defaults to `[]`
- Subject filters auto-generated from the resource list

## Commands

```bash
npm run resources:sync
npm run build
npm run preview:site
```