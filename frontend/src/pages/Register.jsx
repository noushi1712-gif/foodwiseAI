import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, User, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.details?.[0]?.message ||
        'Registration failed. Please check form values.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-forest text-white mb-3 shadow-subtle">
            <Leaf className="w-6 h-6 text-sage" />
          </div>
          <h1 className="text-2xl font-bold text-forest tracking-tight">
            FoodWise <span className="text-emerald">AI</span>
          </h1>
          <p className="text-xs text-charcoal-muted mt-1 font-medium">
            Predict less. Waste less. Feed more.
          </p>
        </div>

        {/* Card */}
        <div className="saas-card p-8">
          <div className="mb-6 pb-3 border-b border-mist">
            <h2 className="text-base font-bold text-forest">Register Kitchen Facility</h2>
            <p className="text-xs text-charcoal-muted">Deploy predictive food forecasting for your dining hall</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-ivory border border-terracotta flex items-start gap-2.5 text-terracotta text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Facility / Manager Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="North Wing Dining Hall"
                  className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal placeholder-charcoal-muted/60 focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@hostel.edu"
                  className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal placeholder-charcoal-muted/60 focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal placeholder-charcoal-muted/60 focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal placeholder-charcoal-muted/60 focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-lg bg-forest hover:bg-forest-light text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Register & Launch
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-mist text-center">
            <p className="text-xs text-charcoal-muted">
              Already registered?{' '}
              <Link to="/login" className="text-forest hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
