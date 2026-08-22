import { Clock, MapPin, Mail } from "lucide-react";
import type { OfficeHoursData } from "../../../data/sanity-types";

interface OfficeHoursSectionProps {
  officeHours?: OfficeHoursData[];
}

export function OfficeHoursSection({ officeHours }: OfficeHoursSectionProps) {
  if (!officeHours || officeHours.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-white/10" aria-label="Officer Office Hours">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-mono uppercase tracking-wider text-white">
          Officer Office Hours
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Drop in at the IEEE Office (BHEE 014) to meet with leadership and ask questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {officeHours.map((slot) => (
          <div
            key={slot._id}
            className="p-5 rounded-lg border border-white/10 bg-neutral-900/60 backdrop-blur-sm flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-semibold">
                  {slot.dayOfWeek}
                </span>
                <span className="text-xs text-neutral-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {slot.startTime} – {slot.endTime}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mt-2.5">{slot.officerName}</h3>
              <p className="text-xs text-neutral-400">{slot.role}</p>
            </div>

            <div className="pt-2 border-t border-white/5 text-xs text-neutral-400 space-y-1 font-mono">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" aria-hidden="true" />
                <span>{slot.location}</span>
              </div>
              {slot.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-500" aria-hidden="true" />
                  <a
                    href={`mailto:${slot.email}`}
                    className="text-primary hover:underline transition-colors"
                  >
                    {slot.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
