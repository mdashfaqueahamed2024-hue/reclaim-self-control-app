import React from 'react';
import {
  Shield,
  Flame,
  Zap,
  LifeBuoy,
  User,
  LogOut,
  Trophy,
  CheckCircle2,
  BarChart3,
  BookOpen,
  Settings as SettingsIcon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';

export const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const {
    activeView,
    setActiveView,
    todayCheckIn,
    setShowCheckInModal,
    setShowEmergencyModal,
    setShowAuthModal
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-[#1F2922]/80 bg-[#080B0A]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#16C784] to-[#101512] p-0.5 shadow-lg shadow-[#16C784]/20 group-hover:shadow-[#16C784]/40 transition-all">
            <div className="w-full h-full rounded-[14px] bg-[#080B0A] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#16C784] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-[#F5F7F5]">RECLAIM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#80FF00] animate-pulse" />
            </div>
            <p className="text-[10px] text-[#929C95] tracking-tight hidden sm:block">Take Control • Rebuild Discipline</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Shield },
            { id: 'challenges', label: 'Quests', icon: CheckCircle2 },
            { id: 'achievements', label: 'Trophies', icon: Trophy },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'journal', label: 'Journal', icon: BookOpen },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#151C18] text-[#16C784] border border-[#16C784]/30 shadow-sm shadow-[#16C784]/15'
                    : 'text-[#929C95] hover:text-[#F5F7F5] hover:bg-[#101512]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#16C784]' : 'text-[#929C95]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls & User Metrics */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Panic Button */}
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600/20 to-red-600/30 border border-rose-500/50 text-rose-300 hover:text-white hover:from-rose-600 hover:to-red-600 text-xs font-bold transition-all shadow-sm shadow-rose-900/30 animate-pulse hover:animate-none"
            title="Open 60-Second Guided Urge Reset & Breathing"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">SOS Reset</span>
          </button>

          {/* Daily Check-In CTA button */}
          <button
            onClick={() => setShowCheckInModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              todayCheckIn
                ? 'bg-[#151C18] border border-[#16C784]/30 text-[#16C784]'
                : 'bg-[#16C784] hover:bg-[#14b677] text-slate-950 shadow-md shadow-[#16C784]/25 hover:scale-[1.02]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{todayCheckIn ? 'Check-in Done' : 'Daily Check-in'}</span>
          </button>

          {/* Streak Badge */}
          {profile && (
            <div
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#151C18] border border-[#1F2922] text-xs font-bold text-amber-400 cursor-pointer hover:border-amber-500/40 transition-colors"
              title="Current Streak"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{profile.current_streak}d</span>
            </div>
          )}

          {/* Points/XP Pill */}
          {profile && (
            <div
              onClick={() => setActiveView('achievements')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#151C18] border border-[#1F2922] text-xs font-bold text-[#80FF00] cursor-pointer hover:border-[#80FF00]/40 transition-colors"
              title="Total XP Points"
            >
              <Zap className="w-3.5 h-3.5 text-[#80FF00]" />
              <span>{profile.points_balance} XP</span>
            </div>
          )}

          {/* User Profile / Auth Toggle */}
          {user ? (
            <div className="relative group">
              <button
                onClick={() => setActiveView('settings')}
                className="w-8 h-8 rounded-xl bg-[#151C18] border border-[#1F2922] hover:border-[#16C784] flex items-center justify-center text-xs font-bold text-[#F5F7F5] transition-colors"
              >
                <User className="w-4 h-4 text-[#16C784]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-3 py-1.5 rounded-xl bg-[#151C18] border border-[#1F2922] text-[#F5F7F5] hover:text-[#16C784] hover:border-[#16C784]/40 text-xs font-bold transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
