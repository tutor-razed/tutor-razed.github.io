const DAY_MS = 24 * 60 * 60 * 1000;

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export function toDate(value: string | Date): Date {
  return value instanceof Date ? new Date(value) : new Date(value);
}

export function startOfDay(value: string | Date): Date {
  const date = toDate(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function endOfDay(value: string | Date): Date {
  const date = toDate(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function addDays(value: string | Date, amount: number): Date {
  return new Date(toDate(value).getTime() + amount * DAY_MS);
}

export function addHours(value: string | Date, amount: number): Date {
  return new Date(toDate(value).getTime() + amount * 60 * 60 * 1000);
}

export function isSameDay(left: string | Date, right: string | Date): boolean {
  const a = startOfDay(left);
  const b = startOfDay(right);
  return a.getTime() === b.getTime();
}

export function formatDate(value: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(toDate(value));
}

export function formatTime(value: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(toDate(value));
}

export function formatDateTime(value: string | Date): string {
  return `${formatDate(value)} at ${formatTime(value)}`;
}

export function formatMonthLabel(value: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    year: "numeric",
  }).format(toDate(value));
}

export function toIsoDate(value: string | Date): string {
  const date = toDate(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function isPast(value: string | Date, now = new Date()): boolean {
  return toDate(value).getTime() < now.getTime();
}

export function differenceInHours(from: string | Date, to: string | Date): number {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / (60 * 60 * 1000));
}

export function getMonthGridAnchor(value: string | Date): Date {
  const date = toDate(value);
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  return addDays(first, -first.getDay());
}

export function getMonthDays(value: string | Date): Date[] {
  const anchor = getMonthGridAnchor(value);
  return Array.from({ length: 42 }, (_, index) => addDays(anchor, index));
}

export function rangesOverlap(
  startA: string | Date,
  endA: string | Date,
  startB: string | Date,
  endB: string | Date,
): boolean {
  return toDate(startA).getTime() <= toDate(endB).getTime() && toDate(endA).getTime() >= toDate(startB).getTime();
}
