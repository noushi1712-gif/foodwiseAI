import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Request Code, 2: Reset Password, 3: Success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setIsSubmitting(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data?.resetCode) {
        setCode(res.data.resetCode);
        setInfo(`Verification code generated: ${res.data.resetCode} (Auto-filled for convenience)`);
      } else {
        setInfo('A password reset code has been sent to your email.');
      }
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.details?.[0]?.message ||
        'Unable to process password reset request. Please check the email entered.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/auth/reset-password', {
        email,
        code,
        newPassword,
      });
      setStep(3);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.details?.[0]?.message ||
        'Failed to reset password. Please check your verification code.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('manager@foodwise.org');
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
          {step === 1 && (
            <>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-mist">
                <div>
                  <h2 className="text-base font-bold text-forest">Forgot Password</h2>
                  <p className="text-xs text-charcoal-muted">Enter your registered email to reset</p>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded bg-ivory text-forest border border-mist hover:border-forest transition-colors"
                  title="Auto-fill demo email"
                >
                  <Sparkles className="w-3 h-3 text-emerald" />
                  Demo Email
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-ivory border border-terracotta flex items-start gap-2.5 text-terracotta text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="manager@foodwise.org"
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
                      Generating code...
                    </>
                  ) : (
                    <>
                      Continue to Reset
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6 pb-3 border-b border-mist">
                <h2 className="text-base font-bold text-forest">Set New Password</h2>
                <p className="text-xs text-charcoal-muted">For {email}</p>
              </div>

              {info && (
                <div className="mb-4 p-3 rounded-lg bg-emerald/10 border border-emerald/30 flex items-start gap-2.5 text-forest text-xs">
                  <Sparkles className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                  <span>{info}</span>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-ivory border border-terracotta flex items-start gap-2.5 text-terracotta text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                    Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="6-digit code (e.g. 123456)"
                      className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal placeholder-charcoal-muted/60 focus:outline-none focus:border-forest tracking-widest font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal placeholder-charcoal-muted/60 focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full bg-ivory border border-mist rounded-lg pl-10 pr-3 py-2 text-sm text-charcoal placeholder-charcoal-muted/60 focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); }}
                    className="w-1/3 py-2.5 px-3 rounded-lg border border-mist text-charcoal hover:bg-mist/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-2.5 px-4 rounded-lg bg-forest hover:bg-forest-light text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-base font-bold text-forest mb-1">Password Reset Successful!</h2>
              <p className="text-xs text-charcoal-muted mb-6">
                Your password has been securely updated. You can now log into your kitchen manager dashboard.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 rounded-lg bg-forest hover:bg-forest-light text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                Sign In With New Password
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-mist text-center">
            <p className="text-xs text-charcoal-muted">
              Remembered your credentials?{' '}
              <Link to="/login" className="text-forest hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
