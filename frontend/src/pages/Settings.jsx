import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Shield, Sliders, Bell, Building2, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [safetyBufferPct, setSafetyBufferPct] = useState(4.0);
  const [facilityName, setFacilityName] = useState(user?.name || 'Central Dining Facility');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [partnerAutoNotify, setPartnerAutoNotify] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-mist">
        <h1 className="text-2xl font-bold text-forest tracking-tight">
          Operational Configuration & Kitchen Preferences
        </h1>
        <p className="text-sm text-charcoal-muted mt-0.5">
          Tune AI prediction safety margins, facility profiles, and surplus notification triggers.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-ivory border border-emerald flex items-center gap-2 text-emerald text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Operational preferences saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Facility Identity */}
        <div className="saas-card p-6">
          <h3 className="text-sm font-bold text-forest mb-1 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Facility Profile
          </h3>
          <p className="text-xs text-charcoal-muted mb-4">
            Institutional entity registered for food donation protection and kitchen logs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                Facility / Cafeteria Name
              </label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="w-full bg-ivory border border-mist rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                Registered Manager Account
              </label>
              <input
                type="text"
                disabled
                value={user?.email || 'manager@foodwise.org'}
                className="w-full bg-ivory/60 border border-mist rounded-lg px-3 py-2 text-sm text-charcoal-muted cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Prediction Buffer Tuning */}
        <div className="saas-card p-6">
          <h3 className="text-sm font-bold text-forest mb-1 flex items-center gap-2">
            <Sliders className="w-4 h-4" /> AI Safety Buffer Calibration
          </h3>
          <p className="text-xs text-charcoal-muted mb-4">
            Set the baseline percentage added to AI predicted headcount to guarantee against shortages.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-charcoal">
                Preparation Buffer Hedge: <strong className="text-forest font-bold">{safetyBufferPct}%</strong>
              </span>
              <span className="text-[11px] text-charcoal-muted">Recommended: 3.5% – 5.0%</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.5"
              value={safetyBufferPct}
              onChange={(e) => setSafetyBufferPct(parseFloat(e.target.value))}
              className="w-full accent-forest cursor-pointer"
            />
            <p className="text-[11px] text-charcoal-muted">
              Lower buffer values minimize kitchen overproduction, while higher values accommodate sudden attendance spikes.
            </p>
          </div>
        </div>

        {/* Automated Alerts */}
        <div className="saas-card p-6">
          <h3 className="text-sm font-bold text-forest mb-1 flex items-center gap-2">
            <Bell className="w-4 h-4" /> Redistribution & Safety Alerts
          </h3>
          <p className="text-xs text-charcoal-muted mb-4">
            Trigger automated alerts when surplus food reaches critical holding windows.
          </p>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg border border-mist bg-ivory/50 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-charcoal block">Surplus Expiry Warning (2 Hours)</span>
                <span className="text-[11px] text-charcoal-muted">Alert culinary staff when hot holding batch approaches 2 hours.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-forest rounded border-mist focus:ring-forest"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-mist bg-ivory/50 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-charcoal block">Auto-Dispatch to Nearest Partner</span>
                <span className="text-[11px] text-charcoal-muted">Instantly notify verified partners within 3 km when surplus is committed.</span>
              </div>
              <input
                type="checkbox"
                checked={partnerAutoNotify}
                onChange={(e) => setPartnerAutoNotify(e.target.checked)}
                className="w-4 h-4 text-forest rounded border-mist focus:ring-forest"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-forest hover:bg-forest-light text-white text-xs font-semibold transition-colors shadow-xs"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
}
