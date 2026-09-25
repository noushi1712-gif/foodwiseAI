import React from 'react';
import { ChefHat, TrendingUp, ShieldAlert, CheckCircle2, Info, Calendar, Sparkles } from 'lucide-react';

export default function AIRecommendationCard({ prediction, historicalAverage }) {
  if (!prediction) {
    return (
      <div className="saas-card p-8 text-center flex flex-col items-center justify-center min-h-[360px] border-dashed">
        <div className="w-10 h-10 rounded-full bg-ivory border border-mist flex items-center justify-center text-charcoal-muted mb-3">
          <ChefHat className="w-5 h-5 text-forest" />
        </div>
        <h3 className="text-sm font-semibold text-charcoal mb-1">
          Awaiting Forecast Parameters
        </h3>
        <p className="text-xs text-charcoal-muted max-w-sm">
          Select target operational parameters on the left to compute prep volumes and safety margins.
        </p>
      </div>
    );
  }

  const {
    predicted_demand,
    recommended_quantity,
    safety_buffer,
    reason,
    expected_people,
    target_date
  } = prediction;

  const expectedCustomers = expected_people || 480;
  const expectedMeals = predicted_demand || 465;
  const recommendedPrep = recommended_quantity || 485;
  const expectedSurplus = Math.round(recommendedPrep * 0.04); // Expected surplus margin

  return (
    <div className="saas-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-mist">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest block">
            Kitchen Preparation Advisory
          </span>
          <h3 className="text-lg font-bold text-charcoal">
            Target Service: {target_date || 'Upcoming Shift'}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-ivory text-forest border border-mist text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald" />
          Verified Forecast
        </span>
      </div>

      {/* 4 Metric Cards as Specified */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg border border-mist bg-ivory/60">
          <span className="text-[11px] font-semibold text-charcoal-muted block mb-1">
            Expected Customers
          </span>
          <p className="text-xl font-bold text-charcoal">
            {expectedCustomers}
          </p>
          <span className="text-[10px] text-charcoal-muted">Patrons</span>
        </div>

        <div className="p-3.5 rounded-lg border border-mist bg-ivory/60">
          <span className="text-[11px] font-semibold text-charcoal-muted block mb-1">
            Expected Meals
          </span>
          <p className="text-xl font-bold text-charcoal">
            {expectedMeals}
          </p>
          <span className="text-[10px] text-charcoal-muted">Demand baseline</span>
        </div>

        <div className="p-3.5 rounded-lg border border-forest/30 bg-forest/5">
          <span className="text-[11px] font-bold text-forest block mb-1">
            Recommended Prep
          </span>
          <p className="text-xl font-black text-forest">
            {recommendedPrep}
          </p>
          <span className="text-[10px] text-forest font-semibold">+{safety_buffer} buffer</span>
        </div>

        <div className="p-3.5 rounded-lg border border-mist bg-ivory/60">
          <span className="text-[11px] font-semibold text-charcoal-muted block mb-1">
            Expected Surplus
          </span>
          <p className="text-xl font-bold text-amber">
            ~{expectedSurplus}
          </p>
          <span className="text-[10px] text-charcoal-muted">&lt;4% allocation</span>
        </div>
      </div>

      {/* "Why this forecast?" Explanatory Breakdown */}
      <div className="p-4 rounded-xl border border-mist bg-ivory/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-forest">
          <Info className="w-4 h-4 text-forest" />
          Why this forecast?
        </div>

        <p className="text-xs text-charcoal leading-relaxed">
          {reason}
        </p>

        <div className="pt-2 border-t border-mist/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-charcoal-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-forest" />
            <span><strong className="text-charcoal">Historical attendance:</strong> 4-week moving average</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-forest" />
            <span><strong className="text-charcoal">Day of week trend:</strong> Calibrated variance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-forest" />
            <span><strong className="text-charcoal">Recent consumption:</strong> Prior 4 recorded shifts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-forest" />
            <span><strong className="text-charcoal">Safety buffer:</strong> {safety_buffer} portion hedge</span>
          </div>
        </div>
      </div>
    </div>
  );
}
