import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, authMode, setAuthMode, triggerCelebration } = useApp();
  const { signIn, signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const res = await signIn(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setShowAuthModal(false);
        }
      } else if (authMode === 'signup') {
        if (!username.trim()) {
          setErrorMsg('Please enter a display name');
          setIsLoading(false);
          return;
        }
        const res = await signUp(email, username, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          triggerCelebration();
          setShowAuthModal(false);
        }
      } else if (authMode === 'forgot') {
        // Password reset notification
        setResetSent(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFastDemoLogin = async () => {
    setIsLoading(true);
    await signIn('demo.discipline@pulse.io');
    setIsLoading(false);
    setShowAuthModal(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAuthModal(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#111713] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10"
        >
          {/* Subtle Glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Private & Anonymous
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {authMode === 'login' && 'Welcome Back'}
              {authMode === 'signup' && 'Create Your Vault'}
              {authMode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              {authMode === 'login' && 'Access your streaks, reflections, and rewards.'}
              {authMode === 'signup' && 'Start your zero-shame self-mastery journey today.'}
              {authMode === 'forgot' && 'We will send a recovery link to your inbox.'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {resetSent ? (
            <div className="p-6 rounded-2xl bg-[#161e19] border border-emerald-500/30 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Reset link dispatched</h3>
              <p className="text-xs text-zinc-400">
                If an account exists for {email}, a password reset link has been sent.
              </p>
              <button
                type="button"
                onClick={() => {
                  setResetSent(false);
                  setAuthMode('login');
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display name for signup */}
              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Display Name or Alias
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="e.g., Alex Hunter"
                      required
                      className="w-full bg-[#161e19] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full bg-[#161e19] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              {authMode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Password
                    </label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[11px] text-emerald-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      minLength={6}
                      className="w-full bg-[#161e19] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {authMode === 'login' && 'Sign In to Account'}
                      {authMode === 'signup' && 'Create Free Account'}
                      {authMode === 'forgot' && 'Send Recovery Email'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Demo 1-Click Fast Login */}
          <div className="mt-5 pt-5 border-t border-zinc-800/80 space-y-3">
            <button
              type="button"
              onClick={handleFastDemoLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Demo Account (15-Day Active Streak)</span>
            </button>

            {/* Toggle Modes */}
            <div className="text-center text-xs text-zinc-400">
              {authMode === 'login' && (
                <p>
                  New to RECLAIM?{' '}
                  <button
                    onClick={() => {
                      setErrorMsg(null);
                      setAuthMode('signup');
                    }}
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              )}
              {authMode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setErrorMsg(null);
                      setAuthMode('login');
                    }}
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              )}
              {authMode === 'forgot' && (
                <p>
                  Remembered your password?{' '}
                  <button
                    onClick={() => {
                      setErrorMsg(null);
                      setAuthMode('login');
                    }}
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
