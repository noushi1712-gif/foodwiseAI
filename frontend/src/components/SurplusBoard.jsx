import React, { useState } from 'react';
import {
  HeartHandshake,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  Loader2,
  Building2,
  Calendar,
  Truck,
  CheckCheck,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const SURPLUS_WORKFLOW_STEPS = [
  { step: 1, title: 'Batch Identified', desc: 'Edible surplus verified' },
  { step: 2, title: 'Partner Match', desc: 'Ranked by proximity' },
  { step: 3, title: 'Offer Dispatched', desc: 'Partner notified' },
  { step: 4, title: 'Pickup Scheduled', desc: 'Reserved & safe holding' },
  { step: 5, title: 'Collected & Logged', desc: 'Impact metrics updated' },
];

export default function SurplusBoard({
  organizations = [],
  myOffers = [],
  onOfferFood
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [foodItem, setFoodItem] = useState('Herb Roasted Chicken & Quinoa');
  const [quantity, setQuantity] = useState(35);
  const [expiryHours, setExpiryHours] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sample surplus batches with rich SaaS metadata
  const surplusBatches = [
    {
      id: 'batch-1',
      foodItem: 'Herb Roasted Chicken & Quinoa',
      category: 'Proteins',
      quantity: 35,
      unit: 'meals',
      preparedTime: '11:30 AM',
      expiryTime: 'In 3 hours',
      status: 'Reserved',
      partner: 'Community Food Center',
      pickupStatus: 'Driver dispatched (ETA 25m)',
      urgent: true
    },
    {
      id: 'batch-2',
      foodItem: 'Steamed Garden Medley',
      category: 'Vegetables',
      quantity: 28,
      unit: 'meals',
      preparedTime: '12:00 PM',
      expiryTime: 'In 5 hours',
      status: 'Available',
      partner: 'Eligible for matching',
      pickupStatus: 'Awaiting allocation',
      urgent: false
    },
    {
      id: 'batch-3',
      foodItem: 'Whole Grain Dinner Rolls',
      category: 'Bakery',
      quantity: 50,
      unit: 'portions',
      preparedTime: '08:00 AM',
      expiryTime: 'In 18 hours',
      status: 'Collected',
      partner: 'Local Shelter (Westside)',
      pickupStatus: 'Delivered at 01:15 PM',
      urgent: false
    }
  ];

  const handleOpenModal = (orgId) => {
    if (orgId) {
      setSelectedOrgId(orgId);
    } else if (organizations.length > 0) {
      setSelectedOrgId(organizations[0].id);
    }
    setModalOpen(true);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!selectedOrgId) return;

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await onOfferFood({
        organizationId: selectedOrgId,
        quantity: Number(quantity),
        foodItem,
        expiryHours: Number(expiryHours)
      });
      setSuccessMsg(`Successfully offered ${quantity} portions of ${foodItem}!`);
      setTimeout(() => {
        setModalOpen(false);
      }, 1200);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to dispatch surplus batch.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Redistribution Workflow Tracker */}
      <div className="saas-card p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-mist">
          <div>
            <h3 className="text-base font-bold text-forest">Automated Redistribution Pipeline</h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Verified cold-chain matching: From excess detection to partner receipt and verified impact logging.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-ivory text-forest border border-mist hidden sm:block">
            Strict HACCP Food Safety
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {SURPLUS_WORKFLOW_STEPS.map((step, idx) => (
            <div key={step.step} className="p-3 rounded-lg border border-mist bg-ivory/60 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-5 h-5 rounded-full bg-forest text-white text-[11px] font-bold flex items-center justify-center">
                  {step.step}
                </span>
                {idx < 4 && <ArrowRight className="w-3.5 h-3.5 text-charcoal-muted hidden md:block" />}
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">{step.title}</p>
                <p className="text-[11px] text-charcoal-muted mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Surplus Batches Table */}
      <div className="saas-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-mist">
          <div>
            <h3 className="text-base font-bold text-forest">Live Surplus Batch Inventory</h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Current kitchen surplus portions staged for community redistribution.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-lg bg-forest hover:bg-forest-light text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            Offer Surplus Batch
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory border-b border-mist text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
              <tr>
                <th className="p-3">Food Item & Category</th>
                <th className="p-3">Available Quantity</th>
                <th className="p-3">Prepared</th>
                <th className="p-3">Safe Until</th>
                <th className="p-3">Status</th>
                <th className="p-3">Redistribution Logistics</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist font-medium text-charcoal">
              {surplusBatches.map((batch) => (
                <tr key={batch.id} className="hover:bg-ivory/60 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-forest">{batch.foodItem}</p>
                    <p className="text-[11px] text-charcoal-muted">{batch.category}</p>
                  </td>
                  <td className="p-3 font-bold text-charcoal">
                    {batch.quantity} {batch.unit}
                  </td>
                  <td className="p-3 text-charcoal-muted font-mono">{batch.preparedTime}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 font-semibold ${
                      batch.urgent ? 'text-amber' : 'text-charcoal-muted'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      {batch.expiryTime}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        batch.status === 'Available'
                          ? 'bg-amber/15 text-amber-dark border border-amber/30'
                          : batch.status === 'Reserved'
                          ? 'bg-forest/15 text-forest border border-forest/30'
                          : 'bg-emerald/15 text-emerald border border-emerald/30'
                      }`}
                    >
                      {batch.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-charcoal">{batch.partner}</p>
                    <p className="text-[11px] text-charcoal-muted">{batch.pickupStatus}</p>
                  </td>
                  <td className="p-3 text-right">
                    {batch.status === 'Available' ? (
                      <button
                        onClick={() => handleOpenModal()}
                        className="px-2.5 py-1 rounded bg-forest hover:bg-forest-light text-white text-[11px] font-semibold transition-colors"
                      >
                        Assign Partner
                      </button>
                    ) : (
                      <span className="text-[11px] text-charcoal-muted font-medium">
                        Tracked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verified Partner Selection Grid */}
      <div className="saas-card p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-mist">
          <div>
            <h3 className="text-base font-bold text-forest">Verified Redistribution Partners</h3>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Ranked local NGOs, food banks, and shelters verified for immediate pickup.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-ivory text-forest border border-mist">
            {organizations.length} Active Partners
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="p-4 rounded-xl border border-mist bg-ivory/50 flex flex-col justify-between hover:border-forest/50 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-mist flex items-center justify-center text-forest">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald/10 text-emerald border border-emerald/20">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                <h4 className="text-sm font-bold text-forest mb-1">{org.name}</h4>
                <p className="text-xs text-charcoal-muted flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-charcoal-muted" />
                  {org.location} &bull; 1.8 km away
                </p>
                <p className="text-[11px] text-charcoal-muted truncate mb-3">
                  {org.contact_email}
                </p>
              </div>

              <button
                onClick={() => handleOpenModal(org.id)}
                className="w-full py-2 px-3 rounded-lg bg-white hover:bg-forest hover:text-white text-forest border border-mist hover:border-forest text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3 h-3" />
                Dispatch Offer
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Offer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 sm:p-7 rounded-xl border border-mist shadow-card max-w-md w-full animate-in fade-in">
            <h3 className="text-base font-bold text-forest mb-1">
              Dispatch Surplus Food Offer
            </h3>
            <p className="text-xs text-charcoal-muted mb-4">
              Allocate verified edible surplus meals to an approved community distribution partner.
            </p>

            {errorMsg && (
              <div className="mb-3 p-3 rounded-lg bg-ivory border border-terracotta flex items-center gap-2 text-terracotta text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-3 p-3 rounded-lg bg-ivory border border-emerald flex items-center gap-2 text-emerald text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleDispatch} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                  Food Item Description
                </label>
                <input
                  type="text"
                  required
                  value={foodItem}
                  onChange={(e) => setFoodItem(e.target.value)}
                  className="w-full bg-ivory border border-mist rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                  Recipient Organization
                </label>
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full bg-ivory border border-mist rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                    Portion Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-ivory border border-mist rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">
                    Safe Holding Window
                  </label>
                  <select
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(e.target.value)}
                    className="w-full bg-ivory border border-mist rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
                  >
                    <option value={2}>2 Hours (Hot Holding)</option>
                    <option value={4}>4 Hours (Standard)</option>
                    <option value={12}>12 Hours (Chilled)</option>
                    <option value={24}>24 Hours (Frozen)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 px-3 rounded-lg bg-white hover:bg-ivory text-charcoal border border-mist text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 px-3 rounded-lg bg-forest hover:bg-forest-light text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Offer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
