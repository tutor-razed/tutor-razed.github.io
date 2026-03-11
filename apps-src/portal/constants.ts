import { Resource, ResourceInput } from "./types";
import resourcesData from "./public/resources.json";

function normalizePath(path: string): string {
  const value = path.trim();
  if (!value) return "#";

  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("mailto:") || value.startsWith("tel:")) return value;
  if (value.startsWith("#")) return value;

  return value.startsWith("/") ? value : `/${value}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toResource(input: ResourceInput, index: number): Resource {
  const id = input.id?.trim() || `${slugify(input.title)}-${index + 1}`;
  const downloadUrl = input.downloadUrl?.trim() || normalizePath(input.path ?? "#");

  return {
    id,
    title: input.title,
    description: input.description,
    subject: input.subject,
    date: input.date ?? "",
    type: input.type ?? "Website",
    thumbnail: input.thumbnail,
    downloadUrl,
    rating: input.rating ?? 0,
    tags: input.tags ?? []
  };
}

function getTimestamp(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export const RESOURCES: Resource[] = (resourcesData as ResourceInput[])
  .map(toResource)
  .sort((left, right) => getTimestamp(right.date) - getTimestamp(left.date));

const uniqueSubjects = Array.from(new Set(RESOURCES.map((item) => item.subject).filter(Boolean)));
export const SUBJECTS: string[] = ["All", ...uniqueSubjects];

export const MOCK_RESOURCES: Resource[] = RESOURCES;

