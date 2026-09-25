import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-mist shadow-card text-xs space-y-1">
        <p className="font-bold text-forest mb-1 border-b border-mist pb-1">
          {label}
        </p>
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-charcoal-muted">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              {item.name}:
            </span>
            <span className="font-semibold text-charcoal">
              {item.value} {item.unit || 'meals'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function WasteChart({ data = [] }) {
  const [chartType, setChartType] = useState('line'); // 'line' | 'bar'

  return (
    <div className="saas-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-forest">Waste Trend Over Time</h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Prepared vs. consumed portions and daily variance over consecutive operational days.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-0.5 bg-ivory border border-mist rounded-lg self-start sm:self-auto text-xs">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              chartType === 'line'
                ? 'bg-white text-forest shadow-xs font-semibold border border-mist/80'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Line View
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-white text-forest shadow-xs font-semibold border border-mist/80'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Bar View
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#DDE5DF" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="#52606d" tick={{ fontSize: 11 }} />
              <YAxis stroke="#52606d" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(val) => <span className="text-charcoal font-medium">{val}</span>}
              />
              <Line
                type="monotone"
                dataKey="prepared"
                name="Prepared"
                stroke="#173F35"
                strokeWidth={2}
                dot={{ r: 3, fill: '#173F35' }}
              />
              <Line
                type="monotone"
                dataKey="consumed"
                name="Consumed"
                stroke="#2E7D5B"
                strokeWidth={2}
                dot={{ r: 3, fill: '#2E7D5B' }}
              />
              <Line
                type="monotone"
                dataKey="wasted"
                name="Wasted"
                stroke="#C96B4B"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#C96B4B' }}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#DDE5DF" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="#52606d" tick={{ fontSize: 11 }} />
              <YAxis stroke="#52606d" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                formatter={(val) => <span className="text-charcoal font-medium">{val}</span>}
              />
              <Bar dataKey="prepared" name="Prepared" fill="#173F35" radius={[3, 3, 0, 0]} />
              <Bar dataKey="consumed" name="Consumed" fill="#2E7D5B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="wasted" name="Wasted" fill="#C96B4B" radius={[3, 3, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
