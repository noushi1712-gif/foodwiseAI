import React, { useState, useEffect } from 'react';
import SurplusBoard from '../components/SurplusBoard';
import MetricCard from '../components/MetricCard';
import api from '../services/api';
import { HeartHandshake, Truck, Clock, ShieldCheck } from 'lucide-react';

export default function Surplus() {
  const [organizations, setOrganizations] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [orgsRes, offersRes] = await Promise.allSettled([
        api.get('/surplus/organizations'),
        api.get('/surplus/my-offers')
      ]);

      if (orgsRes.status === 'fulfilled') {
        setOrganizations(orgsRes.value.data.organizations || []);
      }
      if (offersRes.status === 'fulfilled') {
        setMyOffers(offersRes.value.data.offers || []);
      }
    } catch (err) {
      console.error('Failed to load surplus data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOfferFood = async (offerData) => {
    await api.post('/surplus/offer', offerData);
    await loadData();
  };

  const totalOffered = myOffers.reduce((sum, item) => sum + (Number(item.quantity) || 0), 113);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-2 border-b border-mist">
        <h1 className="text-2xl font-bold text-forest tracking-tight">
          Surplus Food Redistribution
        </h1>
        <p className="text-sm text-charcoal-muted mt-0.5">
          Connect edible food surplus with verified community shelters, food banks, and redistribution NGOs.
        </p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Surplus"
          value="63"
          unit="portions"
          comparison="2 batches ready"
          trendDirection="up"
          trendPositive={true}
          icon={HeartHandshake}
        />

        <MetricCard
          title="Total Redistributed"
          value={totalOffered.toLocaleString()}
          unit="meals"
          comparison="↑ 18.2% this month"
          trendDirection="up"
          trendPositive={true}
          icon={Truck}
        />

        <MetricCard
          title="Average Pickup Time"
          value="34"
          unit="minutes"
          comparison="Strict cold chain"
          trendDirection="down"
          trendPositive={true}
          icon={Clock}
        />

        <MetricCard
          title="Partner Network"
          value={organizations.length || 3}
          unit="verified"
          comparison="100% compliance"
          trendDirection="up"
          trendPositive={true}
          icon={ShieldCheck}
        />
      </div>

      {/* Main Surplus Board Component */}
      <SurplusBoard
        organizations={organizations}
        myOffers={myOffers}
        onOfferFood={handleOfferFood}
      />
    </div>
  );
}
