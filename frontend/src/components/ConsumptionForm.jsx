import React, { useState } from 'react';
import { Scale, Calendar, Clock, AlertCircle, CheckCircle2, Loader2, Utensils } from 'lucide-react';

const CATEGORIES = [
  'Grains & Carbohydrates',
  'Proteins & Meats',
  'Vegetables & Salads',
  'Dairy & Desserts',
  'Soups & Liquids',
  'Bakery'
];

const WASTE_REASONS = [
  'Overproduction',
  'Expired',
  'Spoilage',
  'Plate waste',
  'Preparation waste',
  'Other'
];

const MEAL_PERIODS = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Late Service'
];

export default function ConsumptionForm({ onRecorded }) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [recordDate, setRecordDate] = useState(todayStr);
  const [mealPeriod, setMealPeriod] = useState('Lunch');
  const [foodItem, setFoodItem] = useState('Basmati Steamed Rice');
  const [category, setCategory] = useState('Grains & Carbohydrates');
  const [wasteReason, setWasteReason] = useState('Overproduction');
  const [peopleExpected, setPeopleExpected] = useState(480);
  const [foodPrepared, setFoodPrepared] = useState(495);
  const [foodConsumed, setFoodConsumed] = useState(465);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const wasted = Math.max(0, Number(foodPrepared) - Number(foodConsumed));
  const wasteRate = Number(foodPrepared) > 0 ? ((wasted / Number(foodPrepared)) * 100).toFixed(1) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (Number(foodConsumed) > Number(foodPrepared)) {
      setError('Food consumed cannot exceed food prepared.');
      return;
    }

    setLoading(true);

    try {
      await onRecorded({
        recordDate,
        mealPeriod,
        foodItem,
        category,
        wasteReason,
        peopleExpected: Number(peopleExpected),
        foodPrepared: Number(foodPrepared),
        foodConsumed: Number(foodConsumed),
      });
      setSuccess(`Recorded waste audit for ${foodItem} (${wasted} meals / ${wasteRate}% variance).`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record waste audit log.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="saas-card p-6">
      <div className="mb-5 pb-3 border-b border-mist">
        <h2 className="text-base font-bold text-forest">Record Waste & Service Reconciliation</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Log post-service meal counts, surplus category, and root cause classification.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-ivory border border-terracotta flex items-center gap-2 text-terracotta text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-ivory border border-emerald flex items-center gap-2 text-emerald text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Date & Meal Period */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Service Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Meal Period
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={mealPeriod}
                onChange={(e) => setMealPeriod(e.target.value)}
                className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
              >
                {MEAL_PERIODS.map((period) => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Food Item & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Primary Food Item
            </label>
            <div className="relative">
              <Utensils className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={foodItem}
                onChange={(e) => setFoodItem(e.target.value)}
                placeholder="e.g. Herb Roasted Chicken"
                className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-ivory border border-mist rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Waste Reason */}
        <div>
          <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
            Reason for Waste
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {WASTE_REASONS.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                  wasteReason === reason
                    ? 'border-forest bg-forest/5 text-forest font-semibold'
                    : 'border-mist bg-ivory text-charcoal hover:border-forest/40'
                }`}
              >
                <input
                  type="radio"
                  name="wasteReason"
                  value={reason}
                  checked={wasteReason === reason}
                  onChange={(e) => setWasteReason(e.target.value)}
                  className="sr-only"
                />
                <span className={`w-2 h-2 rounded-full ${wasteReason === reason ? 'bg-forest' : 'bg-mist-dark'}`} />
                <span>{reason}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Row 4: Quantity Quantities */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Expected Patrons
            </label>
            <input
              type="number"
              min="1"
              required
              value={peopleExpected}
              onChange={(e) => setPeopleExpected(e.target.value)}
              className="w-full bg-ivory border border-mist rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Prepared (Meals)
            </label>
            <input
              type="number"
              min="1"
              required
              value={foodPrepared}
              onChange={(e) => setFoodPrepared(e.target.value)}
              className="w-full bg-ivory border border-mist rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Consumed (Meals)
            </label>
            <input
              type="number"
              min="0"
              required
              value={foodConsumed}
              onChange={(e) => setFoodConsumed(e.target.value)}
              className="w-full bg-ivory border border-mist rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
            />
          </div>
        </div>

        {/* Computed Waste Banner */}
        <div className="p-3.5 rounded-lg border border-mist bg-ivory flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-forest" />
            <span className="font-semibold text-charcoal">Calculated Surplus Waste:</span>
          </div>
          <div className="text-right">
            <span className={`font-bold ${wasted > 30 ? 'text-terracotta' : 'text-forest'}`}>
              {wasted} portions
            </span>
            <span className="text-charcoal-muted ml-2">({wasteRate}% of cooked batch)</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg bg-forest hover:bg-forest-light text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Recording Audit Log...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Record Waste Entry
            </>
          )}
        </button>
      </form>
    </div>
  );
}
