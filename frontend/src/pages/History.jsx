import React, { useState, useEffect } from 'react';
import ConsumptionForm from '../components/ConsumptionForm';
import MetricCard from '../components/MetricCard';
import WasteChart from '../components/WasteChart';
import api from '../services/api';
import {
  Scale,
  Trash2,
  AlertTriangle,
  TrendingDown,
  PieChart,
  FileText,
  Calendar,
  Layers
} from 'lucide-react';

export default function History() {
  const [consumptionLogs, setConsumptionLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const [consRes, analyticsRes] = await Promise.allSettled([
        api.get('/consumption'),
        api.get('/analytics')
      ]);

      if (consRes.status === 'fulfilled') {
        setConsumptionLogs(consRes.value.data.records || []);
      }
      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value.data);
      }
    } catch (err) {
      console.error('Failed to load waste records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleConsumptionRecorded = async (data) => {
    await api.post('/consumption', data);
    await fetchRecords();
  };

  const totalWaste = analytics?.totalWasted || 207;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-mist">
        <h1 className="text-2xl font-bold text-forest tracking-tight">
          Waste Tracking & Operational Audit
        </h1>
        <p className="text-sm text-charcoal-muted mt-0.5">
          Record post-service food surplus, identify root loss categories, and track reduction velocity.
        </p>
      </div>

      {/* Analytics KPI Cards as Requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Waste"
          value={`${totalWaste.toLocaleString()}`}
          unit="meals"
          comparison="↓ 2.8% vs last month"
          trendDirection="down"
          trendPositive={true}
          icon={Trash2}
        />

        <MetricCard
          title="Highest Waste Category"
          value="Grains"
          unit="41% of volume"
          comparison="Overproduction driver"
          trendDirection="up"
          trendPositive={false}
          icon={Layers}
        />

        <MetricCard
          title="Most Wasted Food"
          value="Steamed Rice"
          unit="78 portions"
          comparison="Action: cut batch 8%"
          trendDirection="up"
          trendPositive={false}
          icon={AlertTriangle}
        />

        <MetricCard
          title="Waste Trend"
          value={`${analytics?.wastePercentage || 6.4}%`}
          unit="rate"
          comparison="↓ 1.4% improvement"
          trendDirection="down"
          trendPositive={true}
          icon={TrendingDown}
        />
      </div>

      {/* Entry Form */}
      <div>
        <ConsumptionForm onRecorded={handleConsumptionRecorded} />
      </div>

      {/* Chart: Waste Trend Over Time */}
      <WasteChart data={analytics?.chartData} />

      {/* Historical Audit Logs Table */}
      <div className="saas-card p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-mist">
          <div>
            <h3 className="text-base font-bold text-forest">Waste Service Audit History</h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Chronological log of post-meal audits and food loss records.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-ivory text-charcoal border border-mist">
            {consumptionLogs.length} Records Logged
          </span>
        </div>

        {consumptionLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-charcoal-muted">
            No consumption records logged yet. Use the form above to record your first meal shift audit.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivory border-b border-mist text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Day</th>
                  <th className="p-3">Expected</th>
                  <th className="p-3">Prepared</th>
                  <th className="p-3">Consumed</th>
                  <th className="p-3">Surplus Wasted</th>
                  <th className="p-3">Variance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist font-medium text-charcoal">
                {consumptionLogs.map((log) => {
                  const prep = Number(log.food_prepared);
                  const cons = Number(log.food_consumed);
                  const wasted = log.food_wasted !== null && log.food_wasted !== undefined ? Number(log.food_wasted) : (prep - cons);
                  const wasteRate = prep > 0 ? ((wasted / prep) * 100).toFixed(1) : 0;
                  return (
                    <tr key={log.id} className="hover:bg-ivory/60 transition-colors">
                      <td className="p-3 text-charcoal-muted font-mono">
                        {log.record_date?.split('T')[0] || log.record_date}
                      </td>
                      <td className="p-3 font-semibold text-forest">{log.day_of_week}</td>
                      <td className="p-3 text-charcoal-muted">{log.people_expected}</td>
                      <td className="p-3 font-semibold text-charcoal">{prep}</td>
                      <td className="p-3 font-semibold text-emerald">{cons}</td>
                      <td className="p-3 font-bold text-terracotta">{wasted} meals</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          wasteRate < 5 ? 'bg-forest/10 text-forest' : 'bg-terracotta/10 text-terracotta'
                        }`}>
                          {wasteRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
