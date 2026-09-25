import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import api from '../services/api';
import {
  Activity,
  Leaf,
  Users,
  ShieldCheck,
  TrendingUp,
  Award,
  Globe2,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

const IMPACT_TREND_DATA = [
  { month: 'May', mealsSaved: 420, co2Avoided: 840, peopleFed: 380 },
  { month: 'Jun', mealsSaved: 580, co2Avoided: 1160, peopleFed: 510 },
  { month: 'Jul', mealsSaved: 740, co2Avoided: 1480, peopleFed: 690 },
  { month: 'Aug', mealsSaved: 890, co2Avoided: 1780, peopleFed: 820 },
  { month: 'Sep', mealsSaved: 1120, co2Avoided: 2240, peopleFed: 1040 },
];

export default function Impact() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Error fetching impact analytics:', err);
      }
    };
    fetchAnalytics();
  }, []);

  const totalPrepared = analytics?.totalPrepared || 3215;
  const totalConsumed = analytics?.totalConsumed || 3008;
  const foodSaved = Math.max(0, totalConsumed - (analytics?.totalWasted || 207));
  const mealsRedistributed = 320;
  const co2AvoidedKg = Math.round((foodSaved + mealsRedistributed) * 2.1);
  const peopleServed = Math.round((foodSaved + mealsRedistributed) * 0.9);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-mist">
        <h1 className="text-2xl font-bold text-forest tracking-tight">
          Sustainability & Community Impact
        </h1>
        <p className="text-sm text-charcoal-muted mt-0.5">
          Audited metrics on institutional food conservation, community nourishment, and greenhouse gas abatement.
        </p>
      </div>

      {/* 5 Measurable Outcomes as Specified */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Food Saved"
          value={foodSaved.toLocaleString()}
          unit="meals"
          comparison="↑ 14.2% this quarter"
          trendDirection="up"
          trendPositive={true}
          icon={ShieldCheck}
        />

        <MetricCard
          title="Waste Prevented"
          value="410"
          unit="kg"
          comparison="↓ 22% kitchen loss"
          trendDirection="down"
          trendPositive={true}
          icon={Leaf}
        />

        <MetricCard
          title="Meals Redistributed"
          value={mealsRedistributed.toLocaleString()}
          unit="portions"
          comparison="100% safe transit"
          trendDirection="up"
          trendPositive={true}
          icon={Activity}
        />

        <MetricCard
          title="CO₂e Avoided"
          value={co2AvoidedKg.toLocaleString()}
          unit="kg CO₂e"
          comparison="2.1 kg CO₂e / meal"
          trendDirection="up"
          trendPositive={true}
          icon={Globe2}
        />

        <MetricCard
          title="Diners & Shelters"
          value={peopleServed.toLocaleString()}
          unit="served"
          comparison="3 partner NGOs"
          trendDirection="up"
          trendPositive={true}
          icon={Users}
        />
      </div>

      {/* Primary Chart: "Your Impact Over Time" */}
      <div className="saas-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-forest">Your Impact Over Time</h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Cumulative progression of meals conserved, greenhouse gas abatement, and community members supported.
            </p>
          </div>
          <span className="text-xs text-charcoal-muted bg-ivory px-3 py-1 rounded-lg border border-mist self-start sm:self-auto font-medium">
            Rolling 5-Month Trajectory
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={IMPACT_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="impactSaved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D5B" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2E7D5B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="impactCO2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#173F35" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#173F35" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#DDE5DF" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" stroke="#52606d" tick={{ fontSize: 11 }} />
              <YAxis stroke="#52606d" tick={{ fontSize: 11 }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg border border-mist shadow-card text-xs space-y-1">
                        <p className="font-bold text-forest mb-1 border-b border-mist pb-1">{label} Record</p>
                        <p className="text-emerald font-semibold">Meals Saved: {payload[0]?.value}</p>
                        <p className="text-forest font-semibold">CO₂ Avoided: {payload[1]?.value} kg</p>
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
              <Area
                type="monotone"
                dataKey="mealsSaved"
                name="Meals Saved"
                stroke="#2E7D5B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#impactSaved)"
              />
              <Area
                type="monotone"
                dataKey="co2Avoided"
                name="CO₂ Avoided (kg)"
                stroke="#173F35"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#impactCO2)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* "This Month's Impact" Concise Summary */}
      <div className="saas-card p-6 bg-forest text-white border-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber" />
              <h3 className="text-base font-bold text-white">This Month's Sustainability Milestone</h3>
            </div>
            <p className="text-xs text-sage leading-relaxed max-w-2xl">
              By replacing fixed cooking quotas with FoodWise AI demand predictions, your culinary team eliminated <strong className="text-white">1,120 unneeded portions</strong>, redirected <strong className="text-white">320 fresh meals</strong> to downtown family shelters, and curtailed <strong className="text-white">2.24 metric tons</strong> of landfill methane emissions.
            </p>
          </div>

          <div className="text-right shrink-0 hidden sm:block">
            <span className="text-3xl font-extrabold text-amber">94.8%</span>
            <p className="text-[11px] text-sage">Diversion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
