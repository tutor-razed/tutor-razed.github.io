import React, { useState } from "react";
import CalendarMonthView from "../components/CalendarMonthView";
import CalendarSetupPanel from "../components/CalendarSetupPanel";
import EventDetailsModal from "../components/EventDetailsModal";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { NormalizedCalendarEvent } from "../types/calendarTypes";

const CalendarPage: React.FC = () => {
  const {
    filteredEvents,
    isLoading,
    preferences,
    districtSources,
    statSources,
    selectedDistrict,
    activeProvinceCodes,
    setDistrict,
    toggleProvince,
  } = useCalendarEvents();
  const [activeMonth, setActiveMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<NormalizedCalendarEvent | null>(null);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f9fafb_0%,#eef6ff_45%,#fff7ed_100%)] pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_2.05fr]">
          <CalendarSetupPanel
            activeProvinceCodes={activeProvinceCodes}
            districtSources={districtSources}
            preferences={preferences}
            selectedDistrictLabel={selectedDistrict?.label}
            statSources={statSources}
            onSelectDistrict={setDistrict}
            onToggleProvince={toggleProvince}
          />
          <CalendarMonthView
            activeMonth={activeMonth}
            events={filteredEvents}
            onMonthChange={setActiveMonth}
            onEventClick={setSelectedEvent}
          />
        </div>
      </div>

      <EventDetailsModal event={selectedEvent} warnings={[]} onClose={() => setSelectedEvent(null)} />

      {isLoading ? (
        <div className="fixed bottom-6 right-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-xl">
          Refreshing calendar sources...
        </div>
      ) : null}
    </div>
  );
};

export default CalendarPage;
