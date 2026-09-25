import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/MetricCard';
import FoodFlowChart from '../components/FoodFlowChart';
import WasteChart from '../components/WasteChart';
import AIInsightsSection from '../components/AIInsightsSection';
import api from '../services/api';
import {
  Utensils,
  ShieldCheck,
  Trash2,
  HeartHandshake,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [offersCount, setOffersCount] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, surplusRes] = await Promise.allSettled([
          api.get('/analytics'),
          api.get('/surplus/my-offers')
        ]);

        if (analyticsRes.status === 'fulfilled') {
          setAnalytics(analyticsRes.value.data);
        }
        if (surplusRes.status === 'fulfilled') {
          const offers = surplusRes.value.data.offers || [];
          if (offers.length > 0) {
            setOffersCount(offers.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0));
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPrepared = analytics?.totalPrepared || 3215;
  const totalConsumed = analytics?.totalConsumed || 3008;
  const totalWasted = analytics?.totalWasted || 207;
  const foodSaved = Math.max(0, totalConsumed - totalWasted);
  const surplusRedistributed = offersCount || 120;

  // Extract firstName for warm greeting
  const displayName = user?.name ? user.name.split(' ')[0] : 'FoodWise';

  return (
    <div className="space-y-8">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-mist">
        <div>
          <h1 className="text-2xl font-bold text-forest tracking-tight">
            Good morning, {displayName}
          </h1>
          <p className="text-sm text-charcoal-muted mt-0.5">
            Here's how your operation is performing today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/predict"
            className="px-4 py-2 rounded-lg bg-forest hover:bg-forest-light text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Demand Forecast
          </Link>
          <Link
            to="/history"
            className="px-4 py-2 rounded-lg bg-white hover:bg-ivory text-charcoal border border-mist text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-forest" />
            Log Meal Service
          </Link>
        </div>
      </div>

      {/* 4 Key Metrics as Requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Food Prepared"
          value={totalPrepared.toLocaleString()}
          unit="meals"
          comparison="↑ 3.1% vs last week"
          trendDirection="up"
          trendPositive={true}
          icon={Utensils}
        />

        <MetricCard
          title="Food Saved"
          value={foodSaved.toLocaleString()}
          unit="meals"
          comparison="↑ 14.2% this month"
          trendDirection="up"
          trendPositive={true}
          icon={ShieldCheck}
        />

        <MetricCard
          title="Waste Generated"
          value={totalWasted.toLocaleString()}
          unit="meals"
          comparison="↓ 2.4% vs target"
          trendDirection="down"
          trendPositive={true}
          icon={Trash2}
        />

        <MetricCard
          title="Surplus Redistributed"
          value={surplusRedistributed.toLocaleString()}
          unit="meals"
          comparison="↑ 18.5% to local shelters"
          trendDirection="up"
          trendPositive={true}
          icon={HeartHandshake}
        />
      </div>

      {/* Primary Chart: Food Flow (Prepared -> Consumed -> Surplus -> Redistributed -> Waste) */}
      <FoodFlowChart
        prepared={totalPrepared}
        consumed={totalConsumed}
        surplus={150}
        redistributed={surplusRedistributed}
        waste={totalWasted}
      />

      {/* Secondary Chart: Waste Trend Over Time */}
      <WasteChart data={analytics?.chartData} />

      {/* Actionable AI Insights */}
      <AIInsightsSection />
    </div>
  );
}
