import React from "react";
import { CATEGORY_STYLES } from "../data/mockSources";
import { NormalizedCalendarEvent } from "../types/calendarTypes";
import { endOfDay, formatMonthLabel, getMonthDays, isSameDay, rangesOverlap, startOfDay } from "../utils/calendarDates";

interface CalendarMonthViewProps {
  activeMonth: Date;
  events: NormalizedCalendarEvent[];
  onMonthChange: (nextMonth: Date) => void;
  onEventClick: (event: NormalizedCalendarEvent) => void;
}

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  activeMonth,
  events,
  onEventClick,
  onMonthChange,
}) => {
  const days = getMonthDays(activeMonth);

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900">{formatMonthLabel(activeMonth)}</h3>
          <p className="text-sm text-slate-500">Conflicts and deadlines remain visible in the month grid.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onMonthChange(new Date(activeMonth.getFullYear(), activeMonth.getMonth() - 1, 1))}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
          >
            Prev
          </button>
          <button type="button" onClick={() => onMonthChange(new Date())} className="rounded-full bg-sky-100 px-4 py-2 text-sm font-bold text-sky-900">
            Today
          </button>
          <button
            type="button"
            onClick={() => onMonthChange(new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 1))}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-2">
        {weekdayLabels.map((day) => (
          <div key={day} className="px-2 text-center text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayEvents = events.filter((event) =>
            rangesOverlap(event.start, event.end, startOfDay(day), endOfDay(day)),
          );
          const inActiveMonth = day.getMonth() === activeMonth.getMonth();
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`min-h-32 rounded-2xl border p-2 ${
                inActiveMonth ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50"
              } ${isToday ? "ring-2 ring-sky-300" : ""}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-sm font-black ${inActiveMonth ? "text-slate-900" : "text-slate-400"}`}>{day.getDate()}</span>
                {dayEvents.length > 0 ? (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                    {dayEvents.length}
                  </span>
                ) : null}
              </div>

              <div className="space-y-2">
                {dayEvents.slice(0, 3).map((event) => {
                  const style = CATEGORY_STYLES[event.category];
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => onEventClick(event)}
                      className={`w-full rounded-xl px-2 py-2 text-left text-xs font-bold ${style.bg} ${style.text}`}
                    >
                      {event.title}
                    </button>
                  );
                })}
                {dayEvents.length > 3 ? <p className="px-2 text-xs font-semibold text-slate-500">+{dayEvents.length - 3} more</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CalendarMonthView;
