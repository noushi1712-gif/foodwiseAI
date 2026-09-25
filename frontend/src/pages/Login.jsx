import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.details?.[0]?.message ||
        'Authentication failed. Please verify your manager credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('manager@foodwise.org');
    setPassword('manager123');
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
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-mist">
            <div>
              <h2 className="text-base font-bold text-forest">Manager Sign In</h2>
              <p className="text-xs text-charcoal-muted">Access kitchen forecasting portal</p>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded bg-ivory text-forest border border-mist hover:border-forest transition-colors"
              title="Auto-fill verified demo credentials"
            >
              <Sparkles className="w-3 h-3 text-emerald" />
              Demo Login
            </button>
          </div>

          {isAuthenticated && user && (
            <div className="mb-4 p-3 rounded-lg bg-emerald/10 border border-emerald/30 flex items-center justify-between text-xs text-forest">
              <div className="truncate pr-2">
                <span className="font-semibold">Active session:</span> {user.name || user.email}
              </div>
              <Link
                to="/dashboard"
                className="shrink-0 font-bold underline hover:text-forest-light flex items-center gap-1"
              >
                Go to Dashboard &rarr;
              </Link>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-ivory border border-terracotta flex items-start gap-2.5 text-terracotta text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="manager@cafeteria.org"
                  className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal placeholder-charcoal-muted/60 focus:outline-none focus:border-forest"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-forest hover:text-emerald hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-mist text-center">
            <p className="text-xs text-charcoal-muted">
              Don't have an institutional account?{' '}
              <Link to="/register" className="text-forest hover:underline font-semibold">
                Register facility
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
