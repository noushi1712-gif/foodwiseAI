import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import AIRecommendationCard from '../components/AIRecommendationCard';
import api from '../services/api';
import {
  TrendingUp,
  AlertCircle,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

const SEVEN_DAY_FORECAST = [
  { day: 'Today', expected: 480, recommended: 495, buffer: 20 },
  { day: 'Tomorrow', expected: 510, recommended: 525, buffer: 25 },
  { day: 'Fri', expected: 440, recommended: 455, buffer: 18 },
  { day: 'Sat', expected: 360, recommended: 372, buffer: 14 },
  { day: 'Sun', expected: 350, recommended: 362, buffer: 14 },
  { day: 'Mon', expected: 530, recommended: 545, buffer: 26 },
  { day: 'Tue', expected: 470, recommended: 485, buffer: 22 },
];

export default function Predict() {
  const [prediction, setPrediction] = useState(null);
  const [historicalAverage, setHistoricalAverage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/predictions', formData);
      setPrediction(response.data.prediction);
      setHistoricalAverage(response.data.historicalAverage || 0);
    } catch (err) {
      console.error('Prediction request error:', err);
      setError(
        err.response?.data?.error ||
        'Failed to generate prediction. Please verify parameters.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-mist">
        <h1 className="text-2xl font-bold text-forest tracking-tight">
          Demand Forecast & Kitchen Planning
        </h1>
        <p className="text-sm text-charcoal-muted mt-0.5">
          Predict preparation volumes using attendance trends, calendar variance, and safety buffer hedging.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-ivory border border-terracotta flex items-center gap-3 text-terracotta text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Forecasting Tool: Form + AI Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <PredictionForm onSubmit={handlePredict} loading={loading} />
        </div>

        <div className="lg:col-span-7">
          <AIRecommendationCard
            prediction={prediction}
            historicalAverage={historicalAverage}
          />
        </div>
      </div>

      {/* 7-Day Forward Planning Horizon */}
      <div className="saas-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-forest">
              7-Day Production Horizon (Today, Tomorrow & Next 7 Days)
            </h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Projected attendance baseline vs. recommended batch size over the rolling weekly cycle.
            </p>
          </div>
          <span className="text-xs text-charcoal-muted font-medium bg-ivory px-3 py-1 rounded-lg border border-mist self-start sm:self-auto">
            Dynamic Safety Buffer: 3.5–5%
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={SEVEN_DAY_FORECAST} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#DDE5DF" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="#52606d" tick={{ fontSize: 11 }} />
              <YAxis stroke="#52606d" tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg border border-mist shadow-card text-xs">
                        <p className="font-bold text-forest mb-1">{label}</p>
                        <p className="text-charcoal">Expected Diners: <strong>{payload[0]?.value}</strong></p>
                        <p className="text-forest font-semibold">Recommended Prep: <strong>{payload[1]?.value} meals</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                formatter={(val) => <span className="text-charcoal font-medium">{val}</span>}
              />
              <Line
                type="monotone"
                dataKey="expected"
                name="Expected Diners"
                stroke="#52606d"
                strokeWidth={1.5}
                dot={{ r: 3, fill: '#52606d' }}
              />
              <Line
                type="monotone"
                dataKey="recommended"
                name="Recommended Prep"
                stroke="#173F35"
                strokeWidth={2}
                dot={{ r: 3, fill: '#173F35' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
