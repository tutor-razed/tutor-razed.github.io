import React from "react";
import { PROVINCE_LABELS } from "../data/mockSources";
import { CalendarPreferences, CalendarSourceDefinition } from "../types/calendarTypes";

interface CalendarSetupPanelProps {
  activeProvinceCodes: string[];
  districtSources: CalendarSourceDefinition[];
  preferences: CalendarPreferences;
  selectedDistrictLabel?: string;
  statSources: CalendarSourceDefinition[];
  onSelectDistrict: (districtId: string) => void;
  onToggleProvince: (provinceCode: string) => void;
}

const CalendarSetupPanel: React.FC<CalendarSetupPanelProps> = ({
  activeProvinceCodes,
  districtSources,
  onSelectDistrict,
  onToggleProvince,
  preferences,
  selectedDistrictLabel,
  statSources,
}) => {
  const provinceCodes = Array.from(new Set(statSources.map((source) => source.province).filter(Boolean))) as string[];

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-5">
        <h3 className="text-lg font-black text-slate-900">Choose the calendars that match your family</h3>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          Your school district choice is stored only in this browser. If you pick a district, the matching province stat holidays are shown automatically.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">School district</p>
          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
            value={preferences.selectedDistrictId}
            onChange={(event) => onSelectDistrict(event.target.value)}
          >
            <option value="">No district selected</option>
            {districtSources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.label} {source.province ? `(${source.province})` : ""}
              </option>
            ))}
          </select>
          {selectedDistrictLabel ? (
            <p className="mt-2 text-sm font-semibold text-sky-700">Showing district calendar: {selectedDistrictLabel}</p>
          ) : null}
        </div>

        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Stat holiday provinces</p>
          <div className="flex flex-wrap gap-3">
            {provinceCodes.map((provinceCode) => {
              const active = activeProvinceCodes.includes(provinceCode);
              const selectedOnlyManually = preferences.selectedProvinceCodes.includes(provinceCode);
              return (
                <button
                  key={provinceCode}
                  type="button"
                  onClick={() => onToggleProvince(provinceCode)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    active ? "bg-rose-100 text-rose-900 ring-1 ring-rose-200" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {PROVINCE_LABELS[provinceCode] ?? provinceCode}
                  {selectedOnlyManually ? " selected" : ""}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Active now:{" "}
            {activeProvinceCodes.length > 0
              ? activeProvinceCodes.map((code) => PROVINCE_LABELS[code] ?? code).join(", ")
              : "No stat holiday calendars selected"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CalendarSetupPanel;
