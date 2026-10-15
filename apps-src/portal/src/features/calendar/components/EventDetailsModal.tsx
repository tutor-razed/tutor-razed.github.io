import React from "react";
import { CATEGORY_LABELS, CATEGORY_STYLES } from "../data/mockSources";
import { NormalizedCalendarEvent, SessionWarning } from "../types/calendarTypes";
import { calculateCancellationDeadline } from "../utils/cancellationPolicy";
import { formatDate, formatDateTime, formatTime } from "../utils/calendarDates";

interface EventDetailsModalProps {
  event: NormalizedCalendarEvent | null;
  warnings: SessionWarning[];
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose, warnings }) => {
  if (!event) return null;

  const style = CATEGORY_STYLES[event.category];
  const deadline = calculateCancellationDeadline(event);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase ${style.bg} ${style.text}`}>
              {CATEGORY_LABELS[event.category]}
            </span>
            <h3 className="mt-3 text-2xl font-black text-slate-900">{event.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{event.sourceLabel}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
            Close
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">When</p>
            <p className="mt-2 text-base font-semibold text-slate-800">
              {event.allDay
                ? formatDate(event.start)
                : `${formatDate(event.start)} from ${formatTime(event.start)} to ${formatTime(event.end)}`}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Cancellation</p>
            <p className="mt-2 text-base font-semibold text-slate-800">
              {deadline ? formatDateTime(deadline) : "No explicit deadline"}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Location</p>
            <p className="mt-2 text-base font-semibold text-slate-800">{event.location || "Not set"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Audience</p>
            <p className="mt-2 text-base font-semibold capitalize text-slate-800">{event.audience}</p>
          </div>
        </div>

        {event.description ? <p className="mt-6 text-base leading-7 text-slate-700">{event.description}</p> : null}
        {event.notes ? <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-900">{event.notes}</p> : null}

        {warnings.length > 0 ? (
          <div className="mt-6">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Warnings</p>
            <div className="flex flex-wrap gap-3">
              {warnings.map((warning) => (
                <span
                  key={`${warning.kind}-${warning.relatedEventId ?? warning.message}`}
                  className="rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-900"
                >
                  {warning.message}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EventDetailsModal;
