import React, { useState } from 'react';
import { Lightbulb, ArrowRight, Check, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AIInsightsSection({ insight, onApply }) {
  const [applied, setApplied] = useState(false);
  const navigate = useNavigate();

  const defaultInsight = {
    title: 'Attendance Shift Optimization',
    observation: 'Tuesday demand is consistently 9.4% lower than Monday across the last 4 weeks.',
    recommendation: 'Reduce Tuesday base production from 490 to 445 portions.',
    reasoning: 'Based on 4-week historical attendance data, Tuesday lunch and dinner exhibit lower dining hall headcount due to departmental off-campus field shifts.',
    impact: 'Estimated prevention: 35–45 wasted meals weekly (~$180 procurement saving).'
  };

  const current = insight || defaultInsight;

  const handleApply = () => {
    setApplied(true);
    if (onApply) onApply(current);
  };

  return (
    <div className="saas-card p-6 border-l-4 border-l-forest">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-ivory border border-mist flex items-center justify-center text-forest shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-forest">
                Operational AI Insight
              </span>
              <span className="text-[11px] text-charcoal-muted">&bull; High Confidence (94%)</span>
            </div>
            <h4 className="text-base font-bold text-charcoal mt-1">
              {current.observation}
            </h4>
            <p className="text-sm font-medium text-forest mt-1">
              Recommendation: {current.recommendation}
            </p>
            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
              <span className="font-semibold text-charcoal">Why this recommendation:</span> {current.reasoning}
            </p>
            {current.impact && (
              <p className="text-xs text-emerald font-semibold mt-2">
                Impact: {current.impact}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-mist">
        <button
          onClick={handleApply}
          disabled={applied}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            applied
              ? 'bg-emerald text-white cursor-default'
              : 'bg-forest hover:bg-forest-light text-white'
          }`}
        >
          {applied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Recommendation Applied to Tuesday
            </>
          ) : (
            <>
              Apply Recommendation
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-ivory text-charcoal border border-mist flex items-center gap-1.5 transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-forest" />
          View Historical Data
        </button>
      </div>
    </div>
  );
}
