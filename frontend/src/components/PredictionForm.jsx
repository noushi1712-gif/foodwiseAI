import React, { useState } from 'react';
import { Users, Calendar, Sparkles, Loader2, Info } from 'lucide-react';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export default function PredictionForm({ onSubmit, loading }) {
  const getTomorrowDay = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return DAYS_OF_WEEK[d.getDay() === 0 ? 6 : d.getDay() - 1];
  };

  const [expectedPeople, setExpectedPeople] = useState(480);
  const [dayOfWeek, setDayOfWeek] = useState(getTomorrowDay());
  const [isHoliday, setIsHoliday] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      expectedPeople: Number(expectedPeople),
      dayOfWeek,
      isHoliday
    });
  };

  return (
    <div className="saas-card p-6">
      <div className="mb-5 pb-3 border-b border-mist">
        <h2 className="text-base font-bold text-forest">Forecast Parameters</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Enter operational headcount factors for tomorrow or upcoming meal shift.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Headcount Input */}
        <div>
          <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
            Expected Customers / Patrons <span className="text-emerald">*</span>
          </label>
          <div className="relative">
            <Users className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              min="1"
              required
              value={expectedPeople}
              onChange={(e) => setExpectedPeople(e.target.value)}
              placeholder="e.g. 480"
              className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal placeholder-charcoal-muted/60 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
            />
          </div>
          <p className="text-[11px] text-charcoal-muted mt-1 flex items-center gap-1">
            <Info className="w-3 h-3 text-forest shrink-0" />
            Calculated from student dormitory rolls or daily shift bookings.
          </p>
        </div>

        {/* Day of the Week */}
        <div>
          <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
            Target Day of Week
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Special Event / Holiday Flag */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 p-3 rounded-lg border border-mist bg-ivory/60 cursor-pointer hover:border-forest/40 transition-colors">
            <input
              type="checkbox"
              checked={isHoliday}
              onChange={(e) => setIsHoliday(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-forest rounded border-mist focus:ring-forest"
            />
            <div>
              <span className="text-xs font-semibold text-charcoal block">
                Holiday, Exam Period, or Reduced Shift
              </span>
              <span className="text-[11px] text-charcoal-muted block leading-normal mt-0.5">
                Calibrates dynamic weighting to account for atypical footfall.
              </span>
            </div>
          </label>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg bg-forest hover:bg-forest-light text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Computing Prediction...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-sage" />
              Generate Demand Forecast
            </>
          )}
        </button>
      </form>
    </div>
  );
}
