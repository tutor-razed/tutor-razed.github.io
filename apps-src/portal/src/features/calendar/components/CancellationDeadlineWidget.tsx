import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTutoringSessions } from "../hooks/useTutoringSessions";
import { calculateCancellationDeadline } from "../utils/cancellationPolicy";
import { differenceInHours, formatDate, formatDateTime, toDate } from "../utils/calendarDates";

const APPROACHING_DAYS = 14;

function getStatus(deadline: string, now: Date): { label: string; className: string } {
  const hoursUntilDeadline = differenceInHours(now, deadline);

  if (hoursUntilDeadline < 0) {
    return { label: "Closed", className: "bg-slate-200 text-slate-900" };
  }

  if (hoursUntilDeadline <= 24 * APPROACHING_DAYS) {
    return { label: "Approaching", className: "bg-rose-100 text-rose-900" };
  }

  return { label: "Upcoming", className: "bg-amber-100 text-amber-900" };
}

const CancellationDeadlineWidget: React.FC = () => {
  const sessions = useTutoringSessions();

  const deadlines = useMemo(() => {
    const now = new Date();

    return sessions
      .map((session) => {
        const deadline = calculateCancellationDeadline(session, 24 * 30);
        return deadline ? { session, deadline } : null;
      })
      .filter((item): item is { session: (typeof sessions)[number]; deadline: string } => !!item)
      .filter((item) => toDate(item.session.end).getTime() >= now.getTime())
      .sort((left, right) => toDate(left.deadline).getTime() - toDate(right.deadline).getTime())
      .slice(0, 3);
  }, [sessions]);

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Parent dashboard</p>
          <h3 className="mt-2 text-2xl font-black text-slate-900">30-day cancellation windows</h3>
        </div>
        <Link to="/calendar" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-black text-white">
          View schedule
        </Link>
      </div>

      {deadlines.length === 0 ? (
        <p className="text-sm text-slate-600">No upcoming tutoring sessions with cancellation deadlines are loaded right now.</p>
      ) : (
        <div className="space-y-4">
          {deadlines.map(({ session, deadline }) => {
            const status = getStatus(deadline, new Date());
            return (
              <div key={session.id} className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-black text-slate-900">{session.title}</h4>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{formatDate(session.start)} at {session.location}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-700">Cancel by {formatDateTime(deadline)}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CancellationDeadlineWidget;
