import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Clock,
  Target,
  Download,
  Trash2,
  Shield,
  Palette,
  Check,
  RefreshCw,
  LogOut,
  Database,
  Lock,
  Smartphone,
  Info
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';

const AVATAR_OPTIONS = [
  { index: 1, label: 'Cyber Ninja', icon: '⚡', bg: 'from-emerald-500 to-teal-700' },
  { index: 2, label: 'Spartan Helm', icon: '🛡️', bg: 'from-amber-500 to-orange-700' },
  { index: 3, label: 'Eagle Vision', icon: '🦅', bg: 'from-cyan-500 to-blue-700' },
  { index: 4, label: 'Iron Wolf', icon: '🐺', bg: 'from-purple-500 to-indigo-800' },
  { index: 5, label: 'Phoenix Reborn', icon: '🔥', bg: 'from-rose-500 to-red-800' },
  { index: 6, label: 'Zen Master', icon: '🌿', bg: 'from-lime-500 to-emerald-800' }
];

export const SettingsView: React.FC = () => {
  const { profile, updateProfile, signOut, isSupabaseConnected } = useAuth();
  const { checkIns, journalEntries, achievements, recoverySessions, setShowAuthModal, setAuthMode } = useApp();

  const [username, setUsername] = useState(profile?.username || 'Discipline Pioneer');
  const [personalGoal, setPersonalGoal] = useState(profile?.personal_goal || 'Reclaiming peak energy, focus, and self-mastery');
  const [reminderTime, setReminderTime] = useState(profile?.daily_reminder_time || '21:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile?.notifications_enabled ?? true);
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_index || 1);
  const [themePref, setThemePref] = useState(profile?.theme_preference || 'dark-emerald');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      username,
      personal_goal: personalGoal,
      daily_reminder_time: reminderTime,
      notifications_enabled: notificationsEnabled,
      avatar_index: selectedAvatar,
      theme_preference: themePref
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportData = () => {
    const exportPayload = {
      app: 'RECLAIM Self-Control Platform',
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      profile,
      checkIns,
      journalEntries,
      achievements,
      recoverySessions
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `reclaim-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account & Personalization</h1>
        <p className="text-zinc-400 text-sm">
          Customize your self-control targets, security settings, privacy, and backup data.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Details Card */}
        <div className="bg-[#121814] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Identity & Avatar</h2>
              <p className="text-xs text-zinc-400">How you appear on your personal dashboard and badges</p>
            </div>
          </div>

          {/* Avatar selector */}
          <div className="space-y-3">
            <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
              Choose Avatar Crest
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {AVATAR_OPTIONS.map(av => {
                const isSelected = selectedAvatar === av.index;
                return (
                  <button
                    key={av.index}
                    type="button"
                    onClick={() => setSelectedAvatar(av.index)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500/15 ring-2 ring-emerald-500/40 scale-105'
                        : 'border-zinc-800 bg-[#161e19] hover:border-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${av.bg} flex items-center justify-center text-2xl shadow-md mb-2`}
                    >
                      {av.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-300 truncate max-w-full">
                      {av.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                Display Name
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full bg-[#161e19] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                Account Email
              </label>
              <div className="w-full bg-[#161e19]/60 border border-zinc-800/60 rounded-xl px-4 py-3 text-zinc-400 text-sm flex items-center justify-between">
                <span>{profile?.email || 'guest@reclaim.local'}</span>
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>
          </div>

          {/* Personal Goal / Motto */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              Personal Goal & Long-term North Star
            </label>
            <input
              type="text"
              value={personalGoal}
              onChange={e => setPersonalGoal(e.target.value)}
              placeholder="e.g., Reclaiming mental clarity, high energy, and deep focus"
              required
              className="w-full bg-[#161e19] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <p className="text-[11px] text-zinc-500">
              This statement appears at the top of your dashboard as your daily reminder.
            </p>
          </div>
        </div>

        {/* Accountability & Notification Card */}
        <div className="bg-[#121814] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Daily Accountability Schedule</h2>
              <p className="text-xs text-zinc-400">Stay consistent with evening reflection triggers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Preferred Check-in Time */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Evening Reflection Time
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                className="w-full bg-[#161e19] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#161e19] border border-zinc-800 mt-2 sm:mt-6">
              <div>
                <p className="text-sm font-semibold text-white">Daily In-App Reminder</p>
                <p className="text-xs text-zinc-500">Prompt daily check-in at evening hour</p>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  notificationsEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Visual Appearance & Theme Card */}
        <div className="bg-[#121814] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Theme & Ambience</h2>
              <p className="text-xs text-zinc-400">Calibrated for low visual fatigue and cinematic focus</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'dark-emerald', label: 'Emerald Deep', desc: 'Default dark with neon lime & emerald accents', color: 'border-emerald-500/50' },
              { id: 'pure-black', label: 'Pure Obsidian', desc: 'OLED-optimized true blacks with silver highlights', color: 'border-zinc-700' },
              { id: 'midnight-gold', label: 'Midnight Gold', desc: 'Luxury dark slate with muted gold trophies', color: 'border-amber-500/50' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemePref(t.id as any)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  themePref === t.id
                    ? `${t.color} bg-[#161e19] ring-2 ring-emerald-500/30`
                    : 'border-zinc-800 bg-[#161e19]/60 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white">{t.label}</span>
                  {themePref === t.id && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-zinc-500">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Check className="w-4 h-4" /> Preferences saved!
            </span>
          )}
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Data Management & Privacy */}
      <div className="bg-[#121814] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Privacy, Sync & Backups</h2>
            <p className="text-xs text-zinc-400">Your habit data is 100% private and user-controlled</p>
          </div>
        </div>

        {/* Backend status info */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#161e19] border border-zinc-800/80">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm font-bold text-white">
                {isSupabaseConnected ? 'Cloud Sync Connected' : 'Resilient Local Vault (Offline Active)'}
              </p>
              <p className="text-xs text-zinc-500">
                {isSupabaseConnected
                  ? 'Data synced with Supabase PostgreSQL and Row-Level Security'
                  : 'Operating locally in private browser storage. Zero server tracking.'}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isSupabaseConnected
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            }`}
          >
            {isSupabaseConnected ? 'Connected' : 'Local Storage'}
          </span>
        </div>

        {/* Export Data */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#161e19] border border-zinc-800/80">
          <div>
            <p className="text-sm font-bold text-white">Export Complete Data Archive</p>
            <p className="text-xs text-zinc-500">
              Download your streaks, daily logs, reflections, and rewards in open JSON format.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs border border-zinc-700 transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            {exportSuccess ? 'Downloaded!' : 'Export JSON Backup'}
          </button>
        </div>

        {/* Account Authentication & Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800">
          <div>
            <p className="text-sm font-bold text-white">Session & Sign Out</p>
            <p className="text-xs text-zinc-500">Signed in as {profile?.email || 'Guest'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 hover:text-white font-semibold transition-colors"
            >
              Switch Account
            </button>
            <button
              type="button"
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
