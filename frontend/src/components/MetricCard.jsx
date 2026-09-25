import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  comparison,
  trendDirection = 'up', // 'up' | 'down'
  trendPositive = true,  // if 'up' is good or bad
  unit = '',
  icon: Icon,
}) {
  const isPositive = trendPositive ? trendDirection === 'up' : trendDirection === 'down';

  return (
    <div className="saas-card p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-ivory border border-mist flex items-center justify-center text-forest">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-charcoal tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-medium text-charcoal-muted">
              {unit}
            </span>
          )}
        </div>

        {comparison && (
          <div className="flex items-center gap-1.5 mt-2.5 text-xs">
            <span
              className={`inline-flex items-center font-semibold ${
                isPositive ? 'text-emerald' : 'text-terracotta'
              }`}
            >
              {trendDirection === 'up' ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {comparison}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
