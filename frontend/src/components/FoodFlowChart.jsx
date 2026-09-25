import React from 'react';
import { ArrowRight, Info } from 'lucide-react';

export default function FoodFlowChart({
  prepared = 3215,
  consumed = 3008,
  surplus = 150,
  redistributed = 120,
  waste = 87
}) {
  // Calculate relative percentages
  const prepNum = Math.max(1, prepared);
  const pctConsumed = Math.round((consumed / prepNum) * 100);
  const pctSurplus = Math.round((surplus / prepNum) * 100);
  const pctRedistributed = Math.round((redistributed / prepNum) * 100);
  const pctWaste = Math.max(1, 100 - pctConsumed - pctRedistributed);

  const flowSteps = [
    {
      label: 'Prepared',
      quantity: prepared,
      pct: 100,
      description: 'Total cooked batch inventory',
      color: '#173F35',
      textColor: 'text-white',
      badgeBg: 'bg-forest',
    },
    {
      label: 'Consumed',
      quantity: consumed,
      pct: pctConsumed,
      description: 'Served to diners & patrons',
      color: '#A8C3B0',
      textColor: 'text-charcoal',
      badgeBg: 'bg-sage',
    },
    {
      label: 'Surplus',
      quantity: surplus,
      pct: pctSurplus,
      description: 'Safe edible remaining food',
      color: '#D99A2B',
      textColor: 'text-charcoal',
      badgeBg: 'bg-amber',
    },
    {
      label: 'Redistributed',
      quantity: redistributed,
      pct: pctRedistributed,
      description: 'Delivered to partner shelters',
      color: '#2E7D5B',
      textColor: 'text-white',
      badgeBg: 'bg-emerald',
    },
    {
      label: 'Waste',
      quantity: waste,
      pct: Math.round((waste / prepNum) * 100),
      description: 'Unavoidable kitchen scrap & plate loss',
      color: '#C96B4B',
      textColor: 'text-white',
      badgeBg: 'bg-terracotta',
    },
  ];

  return (
    <div className="saas-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-forest">Food Flow Lifecycle</h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            End-to-end reconciliation: Tracking inventory from kitchen preparation to table, donation, and waste.
          </p>
        </div>
        <div className="text-xs text-charcoal-muted flex items-center gap-1.5 bg-ivory px-3 py-1.5 rounded-lg border border-mist self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-forest" />
          <span>Balanced conservation accounting</span>
        </div>
      </div>

      {/* Visual Sequence Chain */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {flowSteps.map((step, idx) => (
          <div
            key={step.label}
            className="p-4 rounded-xl border border-mist bg-ivory/60 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
                  {step.label}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${step.badgeBg} ${step.textColor}`}>
                  {step.pct}%
                </span>
              </div>
              <p className="text-xl font-bold text-charcoal">
                {step.quantity.toLocaleString()} <span className="text-xs font-normal text-charcoal-muted">meals</span>
              </p>
            </div>
            <p className="text-[11px] text-charcoal-muted mt-2 border-t border-mist pt-2">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Cumulative Stacked Bar Visualization */}
      <div className="mt-6 pt-5 border-t border-mist">
        <div className="flex items-center justify-between text-xs text-charcoal-muted mb-2">
          <span className="font-semibold text-charcoal">Distribution Proportions</span>
          <span>Target Food Loss: &lt; 4.0%</span>
        </div>

        <div className="h-4 w-full bg-mist/50 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${pctConsumed}%`, backgroundColor: '#A8C3B0' }}
            title={`Consumed: ${consumed} meals (${pctConsumed}%)`}
          />
          <div
            style={{ width: `${pctRedistributed}%`, backgroundColor: '#2E7D5B' }}
            title={`Redistributed: ${redistributed} meals (${pctRedistributed}%)`}
          />
          <div
            style={{ width: `${pctWaste}%`, backgroundColor: '#C96B4B' }}
            title={`Waste: ${waste} meals (${pctWaste}%)`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-charcoal-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sage" />
            <span>Consumed ({pctConsumed}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald" />
            <span>Redistributed ({pctRedistributed}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-terracotta" />
            <span>Waste ({pctWaste}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
