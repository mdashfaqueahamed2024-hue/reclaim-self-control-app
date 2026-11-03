import React, { useState } from 'react';
import {
  Flame,
  Zap,
  Shield,
  LifeBuoy,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  Compass,
  BookOpen,
  Award,
  ChevronRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { MOTIVATIONAL_AFFIRMATIONS } from '@/lib/constants';

export const DashboardView: React.FC = () => {
  const {
    todayCheckIn,
    setShowCheckInModal,
    setShowEmergencyModal,
    setActiveView,
    challenges,
    completeChallenge
  } = useApp();
  const { profile } = useAuth();

  const [affirmationIdx, setAffirmationIdx] = useState(0);

  const streak = profile?.current_streak || 15;
  const bestStreak = profile?.longest_streak || 15;
  const totalXp = profile?.total_xp || 420;

  // Daily habit items
  const [dailyHabits, setDailyHabits] = useState([
    { id: 'h1', title: 'Maintain complete self-control', completed: Boolean(todayCheckIn?.achieved_goal), xp: 30, icon: '🛡️' },
    { id: 'h2', title: '5-minute deep breathing reset', completed: false, xp: 20, icon: '🧘' },
    { id: 'h3', title: '15-minute walk without phone', completed: true, xp: 25, icon: '🚶' },
    { id: 'h4', title: 'No phone in bed before sleep', completed: false, xp: 20, icon: '🌙' },
  ]);

  const toggleHabit = (id: string) => {
    setDailyHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const completedHabitsCount = dailyHabits.filter((h) => h.completed).length;
  const habitProgressPercent = Math.round((completedHabitsCount / dailyHabits.length) * 100);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // 0 for Mon, 6 for Sun

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200 pb-24 md:pb-12">
      {/* Top Welcome & Momentum Header (Matching Image 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#929C95] tracking-wider uppercase flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#16C784]" />
            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#F5F7F5] tracking-tight mt-1">
            Let's Build <span className="text-[#80FF00]">Momentum</span> Today
          </h1>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-600/20 to-red-600/30 border border-rose-500/50 text-rose-300 hover:text-white hover:from-rose-600 hover:to-red-600 text-xs font-black shadow-lg shadow-rose-950/40 transition-all animate-pulse hover:animate-none"
          >
            <LifeBuoy className="w-4 h-4 text-rose-400" />
            <span>I NEED HELP (SOS)</span>
          </button>
        </div>
      </div>

      {/* AI Mindset Companion Hero Banner (Matching Image 1) */}
      <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#151C18] via-[#101512] to-[#080B0A] border border-[#1F2922] shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#16C784]/20 to-[#80FF00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101512] border border-[#16C784]/30 text-[#16C784] text-[11px] font-black uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5" />
              <span>Dopamine Resensitization Coach</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#F5F7F5] tracking-tight">
              "{MOTIVATIONAL_AFFIRMATIONS[affirmationIdx]}"
            </h2>
            <p className="text-xs text-[#929C95]">
              Every single hour you choose self-respect over cheap dopamine, your brain physically restores its baseline receptors.
            </p>
          </div>

          <div className="shrink-0 flex sm:flex-col gap-2.5">
            <button
              onClick={() => setAffirmationIdx((prev) => (prev + 1) % MOTIVATIONAL_AFFIRMATIONS.length)}
              className="py-2.5 px-4 rounded-xl bg-[#101512] border border-[#1F2922] hover:border-[#16C784]/50 text-xs font-bold text-[#F5F7F5] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#80FF00]" />
              <span>Next Thought</span>
            </button>
            <button
              onClick={() => setShowCheckInModal(true)}
              className="py-2.5 px-4 rounded-xl bg-[#16C784] hover:bg-[#14b677] text-slate-950 text-xs font-black transition-all shadow-md shadow-[#16C784]/20 flex items-center justify-center gap-1.5"
            >
              <span>{todayCheckIn ? 'Edit Check-In' : 'Log Today'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Core Grid: Streak Circle Card (Image 4) & Today's Progress Bar (Image 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak Counter Card (Matching Image 4) */}
        <div className="md:col-span-1 rounded-3xl p-6 bg-[#151C18] border border-[#1F2922] shadow-2xl flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs font-bold text-[#929C95] mb-2">
            <span>Streak Velocity</span>
            <span className="text-[#80FF00] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Active
            </span>
          </div>

          {/* Central Circular Streak Display */}
          <div className="my-4 relative flex items-center justify-center">
            {/* Ambient Aura */}
            <div className="absolute inset-0 rounded-full bg-[#16C784]/15 blur-2xl animate-pulse" />

            <div className="relative w-40 h-40 rounded-full border-4 border-[#1F2922] p-2 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#16C784]/20 via-[#101512] to-[#151C18] border border-[#16C784]/40 flex flex-col items-center justify-center shadow-inner">
                <Flame className="w-8 h-8 text-amber-500 fill-amber-500 animate-bounce" />
                <span className="text-4xl font-black text-[#F5F7F5] tracking-tight leading-none mt-1">
                  {streak}
                </span>
                <span className="text-[11px] font-black text-[#929C95] uppercase tracking-wider mt-1">
                  Days Clean
                </span>
              </div>
            </div>
          </div>

          {/* Sub Stats Row matching Image 4 */}
          <div className="grid grid-cols-2 gap-3 w-full mt-2 pt-4 border-t border-[#1F2922]">
            <div className="bg-[#101512] p-3 rounded-2xl border border-[#1F2922]">
              <span className="text-[10px] font-bold text-[#929C95] uppercase block">Longest Record</span>
              <span className="text-base font-black text-amber-300">{bestStreak} Days</span>
            </div>
            <div className="bg-[#101512] p-3 rounded-2xl border border-[#1F2922]">
              <span className="text-[10px] font-bold text-[#929C95] uppercase block">Earned XP</span>
              <span className="text-base font-black text-[#80FF00]">{totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* Today's Focus & Habit Progress Bar (Matching Image 1) */}
        <div className="md:col-span-2 rounded-3xl p-6 sm:p-7 bg-[#151C18] border border-[#1F2922] shadow-2xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-[#F5F7F5] tracking-tight">Today's Focus & Progress</h3>
                <p className="text-xs text-[#929C95]">Daily non-negotiable mental and physical habits</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#80FF00]">{habitProgressPercent}%</span>
                <span className="text-[10px] text-[#929C95] font-bold block">{completedHabitsCount}/{dailyHabits.length} Habits Done</span>
              </div>
            </div>

            {/* Glowing Lime Progress Pill (Matching Image 1) */}
            <div className="w-full h-4 rounded-full bg-[#101512] p-0.5 border border-[#1F2922] overflow-hidden mb-6">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#16C784] to-[#80FF00] shadow-md shadow-[#80FF00]/40 transition-all duration-500"
                style={{ width: `${habitProgressPercent}%` }}
              />
            </div>

            {/* Habit Daily Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {dailyHabits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    habit.completed
                      ? 'bg-[#101512] border-[#16C784]/40 text-[#F5F7F5]'
                      : 'bg-[#101512]/60 border-[#1F2922] text-[#929C95] hover:border-[#1F2922]/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{habit.icon}</span>
                    <span className={`text-xs font-bold ${habit.completed ? 'text-[#F5F7F5]' : 'text-[#929C95]'}`}>
                      {habit.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#80FF00]">+{habit.xp} XP</span>
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        habit.completed
                          ? 'bg-[#16C784] border-[#16C784] text-slate-950'
                          : 'border-[#1F2922] bg-[#080B0A]'
                      }`}
                    >
                      {habit.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Streak Mini Heatmap */}
          <div className="pt-4 border-t border-[#1F2922] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#929C95]">7-Day Discipline Vector:</span>
            <div className="flex items-center gap-2">
              {daysOfWeek.map((day, idx) => {
                const isPassed = idx <= currentDayIndex;
                return (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-[#929C95]">{day}</span>
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                        isPassed
                          ? 'bg-[#16C784]/20 border border-[#16C784] text-[#16C784]'
                          : 'bg-[#101512] border border-[#1F2922] text-[#5C665F]'
                      }`}
                    >
                      {isPassed ? '✓' : '•'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Actions / Quick Capture Tiles (Matching Image 1) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#F5F7F5] tracking-tight">Suggested Actions</h3>
          <span className="text-xs text-[#16C784] font-bold cursor-pointer" onClick={() => setActiveView('challenges')}>
            View Quests →
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div
            onClick={() => setShowCheckInModal(true)}
            className="p-4 rounded-3xl bg-[#151C18] border border-[#1F2922] hover:border-[#16C784]/50 cursor-pointer transition-all group flex flex-col justify-between h-32"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-[#16C784]/15 border border-[#16C784]/30 flex items-center justify-center text-[#16C784]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#929C95] group-hover:text-[#16C784] transition-colors" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#F5F7F5]">Daily Check-In</h4>
              <p className="text-[10px] text-[#929C95] mt-0.5">Track urges & win +30 XP</p>
            </div>
          </div>

          <div
            onClick={() => setShowEmergencyModal(true)}
            className="p-4 rounded-3xl bg-[#151C18] border border-rose-500/30 hover:border-rose-500 cursor-pointer transition-all group flex flex-col justify-between h-32"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <LifeBuoy className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#929C95] group-hover:text-rose-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-xs font-black text-rose-300">SOS Urge Protocol</h4>
              <p className="text-[10px] text-[#929C95] mt-0.5">60s breathing & timer</p>
            </div>
          </div>

          <div
            onClick={() => setActiveView('journal')}
            className="p-4 rounded-3xl bg-[#151C18] border border-[#1F2922] hover:border-[#16C784]/50 cursor-pointer transition-all group flex flex-col justify-between h-32"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#929C95] group-hover:text-teal-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#F5F7F5]">Private Journal</h4>
              <p className="text-[10px] text-[#929C95] mt-0.5">Reflect & dissect triggers</p>
            </div>
          </div>

          <div
            onClick={() => setActiveView('achievements')}
            className="p-4 rounded-3xl bg-[#151C18] border border-[#1F2922] hover:border-[#16C784]/50 cursor-pointer transition-all group flex flex-col justify-between h-32"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#929C95] group-hover:text-amber-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#F5F7F5]">Trophy Vault</h4>
              <p className="text-[10px] text-[#929C95] mt-0.5">Inspect unlocked medals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
