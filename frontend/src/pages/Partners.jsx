import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Users,
  Building2,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  PackageCheck,
  Phone,
  Mail,
  Search
} from 'lucide-react';

const PARTNERS_EXTENDED = [
  {
    id: 'org-1',
    name: 'Community Food Center',
    type: 'Regional Food Bank & Pantry',
    location: 'Downtown Logistics Hub',
    distance: '1.8 km',
    contactEmail: 'contact@cfc.org',
    contactPhone: '+1 (555) 234-5678',
    isAvailable: true,
    acceptedCategories: ['Cooked Entrees', 'Prepared Grains', 'Packaged Bakery', 'Chilled Produce'],
    pickupHours: '8:00 AM – 8:00 PM Daily',
    successfulPickups: 142,
    responseTime: '< 30 mins',
    verifiedSince: 'Jan 2024'
  },
  {
    id: 'org-2',
    name: 'Local Shelter (Westside)',
    type: 'Emergency Resident Shelter',
    location: 'Westside Community Center',
    distance: '3.4 km',
    contactEmail: 'help@shelter.org',
    contactPhone: '+1 (555) 876-5432',
    isAvailable: true,
    acceptedCategories: ['Hot Meals', 'Prepared Proteins', 'Soups', 'Whole Produce'],
    pickupHours: '11:00 AM – 7:00 PM',
    successfulPickups: 98,
    responseTime: '< 45 mins',
    verifiedSince: 'Mar 2024'
  },
  {
    id: 'org-3',
    name: 'Food Redistribution NGO',
    type: 'Direct Relief Dispatch Fleet',
    location: 'North District Warehouse',
    distance: '5.1 km',
    contactEmail: 'logistics@foodngo.org',
    contactPhone: '+1 (555) 345-9876',
    isAvailable: true,
    acceptedCategories: ['Bulk Grains', 'Bulk Proteins', 'Industrial Pan Volumes'],
    pickupHours: '7:00 AM – 9:00 PM',
    successfulPickups: 215,
    responseTime: '< 25 mins',
    verifiedSince: 'Nov 2023'
  }
];

export default function Partners() {
  const [partners, setPartners] = useState(PARTNERS_EXTENDED);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-mist">
        <div>
          <h1 className="text-2xl font-bold text-forest tracking-tight">
            Verified Redistribution Partner Network
          </h1>
          <p className="text-sm text-charcoal-muted mt-0.5">
            Pre-vetted community charities, food recovery hubs, and emergency shelters equipped for safe food rescue.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search partners by area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-ivory border border-mist rounded-lg pl-9 pr-3 py-1.5 text-xs text-charcoal focus:outline-none focus:border-forest"
          />
        </div>
      </div>

      {/* Trust & Safety Banner */}
      <div className="saas-card p-5 border-l-4 border-l-forest flex items-start gap-3 bg-ivory/60">
        <ShieldCheck className="w-5 h-5 text-forest shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-forest">Food Safety Protocol (Good Samaritan & HACCP Certified)</h4>
          <p className="text-xs text-charcoal-muted mt-0.5 leading-relaxed">
            All partners on FoodWise AI undergo thermal-transport verification, carry commercial insulated transit vessels, and sign liability waivers under food donation protection statutes.
          </p>
        </div>
      </div>

      {/* Partners List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="saas-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-ivory border border-mist flex items-center justify-center text-forest">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald/10 text-emerald border border-emerald/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Partner
                </span>
              </div>

              <h3 className="text-base font-bold text-forest mb-0.5">{partner.name}</h3>
              <p className="text-xs text-charcoal-muted mb-3">{partner.type}</p>

              <div className="space-y-2 text-xs border-t border-mist pt-3 mb-4">
                <div className="flex items-center justify-between text-charcoal-muted">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-forest" /> Location:
                  </span>
                  <span className="font-semibold text-charcoal">{partner.location} ({partner.distance})</span>
                </div>

                <div className="flex items-center justify-between text-charcoal-muted">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-forest" /> Availability:
                  </span>
                  <span className="font-semibold text-charcoal">{partner.pickupHours}</span>
                </div>

                <div className="flex items-center justify-between text-charcoal-muted">
                  <span className="flex items-center gap-1.5">
                    <PackageCheck className="w-3.5 h-3.5 text-forest" /> Lifetime Pickups:
                  </span>
                  <span className="font-bold text-emerald">{partner.successfulPickups} batches</span>
                </div>
              </div>

              {/* Accepted Categories */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider block mb-1.5">
                  Accepted Categories:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {partner.acceptedCategories.map((cat) => (
                    <span key={cat} className="text-[10px] font-medium px-2 py-0.5 rounded bg-ivory border border-mist text-charcoal">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-mist flex items-center justify-between text-xs text-charcoal-muted">
              <span className="truncate">{partner.contactEmail}</span>
              <span className="font-semibold text-forest">ETA: {partner.responseTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
