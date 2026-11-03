import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  AlertCircle,
  Smile,
  Zap,
  Shield,
  BookOpen,
  Flame,
  Award
} from 'lucide-react';
import { MoodType, TriggerType } from '@/types';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

const MOODS: { type: MoodType; label: string; icon: string; color: string }[] = [
  { type: 'happy', label: 'Happy', icon: '😄', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' },
  { type: 'focused', label: 'Focused', icon: '🎯', color: 'border-teal-500/40 bg-teal-500/10 text-teal-400' },
  { type: 'calm', label: 'Calm', icon: '🧘', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400' },
  { type: 'stressed', label: 'Stressed', icon: '😫', color: 'border-amber-500/40 bg-amber-500/10 text-amber-400' },
  { type: 'anxious', label: 'Anxious', icon: '😰', color: 'border-orange-500/40 bg-orange-500/10 text-orange-400' },
  { type: 'tired', label: 'Tired', icon: '🥱', color: 'border-purple-500/40 bg-purple-500/10 text-purple-400' },
  { type: 'unmotivated', label: 'Unmotivated', icon: '🌧️', color: 'border-rose-500/40 bg-rose-500/10 text-rose-400' },
];

const TRIGGERS: TriggerType[] = [
  'Boredom',
  'Stress',
  'Loneliness',
  'Social media',
  'Late-night browsing',
  'Fatigue',
  'Anxiety',
  'Idle time',
  'Other'
];

const COPING_OPTIONS = [
  'Cold splash on face',
  '15-minute outdoor walk',
  '4-7-8 breathing exercise',
  'Left phone in another room',
  'Engaged in physical workout',
  'Read a physical book',
  'Called a friend or family member',
  'Urge surfing protocol'
];

export const DailyCheckInModal: React.FC = () => {
  const { showCheckInModal, setShowCheckInModal, submitCheckIn, todayCheckIn } = useApp();
  const { profile } = useAuth();

  const [achievedGoal, setAchievedGoal] = useState<boolean>(true);
  const [urgeIntensity, setUrgeIntensity] = useState<number>(3);
  const [selectedMood, setSelectedMood] = useState<MoodType>('focused');
  const [selectedTriggers, setSelectedTriggers] = useState<TriggerType[]>([]);
  const [selectedCoping, setSelectedCoping] = useState<string[]>(['15-minute outdoor walk']);
  const [accomplishments, setAccomplishments] = useState<string>('');
  const [journalNote, setJournalNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showCheckInModal) return null;

  const toggleTrigger = (t: TriggerType) => {
    setSelectedTriggers((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const toggleCoping = (c: string) => {
    setSelectedCoping((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await submitCheckIn({
        date: todayStr,
        achieved_goal: achievedGoal,
        urge_intensity: urgeIntensity,
        mood: selectedMood,
        triggers: selectedTriggers,
        coping_strategies: selectedCoping,
        accomplishments: accomplishments.trim() || 'Showed up for myself today.',
        journal_notes: journalNote.trim() || undefined
      });
    } catch (err) {
      console.error('Error submitting checkin:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgeLabel = (val: number) => {
    if (val <= 2) return 'Zero to Minimal (Peaceful)';
    if (val <= 4) return 'Mild Urge (Easy to Disregard)';
    if (val <= 6) return 'Moderate (Noticed & Managed)';
    if (val <= 8) return 'Elevated (Required Deliberate Coping)';
    return 'Intense Spike (Overcame with Grit)';
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080B0A]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#101512] border border-[#1F2922] rounded-3xl p-5 sm:p-7 shadow-2xl text-left my-8">
        {/* Close Button */}
        <button
          onClick={() => setShowCheckInModal(false)}
          className="absolute top-5 right-5 text-[#929C95] hover:text-[#F5F7F5] p-2 rounded-xl hover:bg-[#151C18] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#16C784] to-[#101512] p-0.5 shadow-md shadow-[#16C784]/20 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-[#080B0A] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#16C784]" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#F5F7F5] tracking-tight">
              Daily Accountability Check-In
            </h2>
            <p className="text-xs text-[#929C95]">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })} • Day {(profile?.current_streak || 0) + (achievedGoal ? 1 : 0)} Tracker
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question 1: Goal Achievement Toggle */}
          <div className="bg-[#151C18] border border-[#1F2922] rounded-2xl p-4 sm:p-5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#929C95] block mb-2">
              1. Did you honor your personal self-control goal today?
            </label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                type="button"
                onClick={() => setAchievedGoal(true)}
                className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  achievedGoal
                    ? 'bg-[#16C784]/15 border-[#16C784] text-[#16C784] shadow-md shadow-[#16C784]/20'
                    : 'bg-[#101512] border-[#1F2922] text-[#929C95] hover:border-[#16C784]/40'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Yes, I Maintained Discipline</span>
              </button>

              <button
                type="button"
                onClick={() => setAchievedGoal(false)}
                className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  !achievedGoal
                    ? 'bg-rose-500/15 border-rose-500 text-rose-400 shadow-md shadow-rose-500/20'
                    : 'bg-[#101512] border-[#1F2922] text-[#929C95] hover:border-rose-500/40'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>Had a Setback (Honest Reset)</span>
              </button>
            </div>
            {!achievedGoal && (
              <p className="text-[11px] text-amber-300/90 mt-2.5 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                🌱 <strong>Zero Shame Policy:</strong> A setback does not erase your historical growth or neurological rewiring. Honest reflection allows you to restart clean without guilt.
              </p>
            )}
          </div>

          {/* Question 2: Urge Intensity Slider */}
          <div className="bg-[#151C18] border border-[#1F2922] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#929C95]">
                2. Urge Intensity Rating
              </label>
              <span className="text-xs font-black text-[#80FF00] bg-[#101512] px-2.5 py-0.5 rounded-lg border border-[#1F2922]">
                {urgeIntensity} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={urgeIntensity}
              onChange={(e) => setUrgeIntensity(Number(e.target.value))}
              className="w-full h-2 bg-[#101512] rounded-lg appearance-none cursor-pointer accent-[#16C784] my-3"
            />
            <p className="text-xs text-[#F5F7F5] font-semibold">{getUrgeLabel(urgeIntensity)}</p>
          </div>

          {/* Question 3: Mood Grid */}
          <div className="bg-[#151C18] border border-[#1F2922] rounded-2xl p-4 sm:p-5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#929C95] block mb-3">
              3. What was your predominant mood today?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MOODS.map((m) => {
                const isSelected = selectedMood === m.type;
                return (
                  <button
                    key={m.type}
                    type="button"
                    onClick={() => setSelectedMood(m.type)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? `${m.color} ring-1 ring-[#16C784]/30 shadow-sm`
                        : 'border-[#1F2922] bg-[#101512] text-[#929C95] hover:border-[#16C784]/30 hover:text-[#F5F7F5]'
                    }`}
                  >
                    <span className="text-lg">{m.icon}</span>
                    <span className="text-xs font-bold">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 4: Triggers Checklist */}
          <div className="bg-[#151C18] border border-[#1F2922] rounded-2xl p-4 sm:p-5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#929C95] block mb-2">
              4. Did any specific triggers challenge you today?
            </label>
            <p className="text-[11px] text-[#929C95] mb-3">Select all factors that prompted cravings or restlessness:</p>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map((t) => {
                const isSelected = selectedTriggers.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTrigger(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#16C784]/20 border-[#16C784] text-[#16C784]'
                        : 'bg-[#101512] border-[#1F2922] text-[#929C95] hover:text-[#F5F7F5]'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 5: Coping Strategies */}
          <div className="bg-[#151C18] border border-[#1F2922] rounded-2xl p-4 sm:p-5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#929C95] block mb-2">
              5. What actions helped you navigate or defuse the urges?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {COPING_OPTIONS.map((c) => {
                const isSelected = selectedCoping.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCoping(c)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#101512] border-[#80FF00] text-[#80FF00]'
                        : 'bg-[#101512] border-[#1F2922] text-[#929C95] hover:border-[#1F2922]/80'
                    }`}
                  >
                    <span>{c}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 6: Accomplishments & Reflection Note */}
          <div className="bg-[#151C18] border border-[#1F2922] rounded-2xl p-4 sm:p-5 space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#929C95] block mb-1">
                6. What positive victory or accomplishment did you achieve today?
              </label>
              <input
                type="text"
                value={accomplishments}
                onChange={(e) => setAccomplishments(e.target.value)}
                placeholder="E.g. Completed a workout, finished project task, read 30 pages..."
                className="w-full bg-[#101512] border border-[#1F2922] focus:border-[#16C784] rounded-xl px-3.5 py-2.5 text-xs text-[#F5F7F5] outline-none placeholder-[#5C665F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#929C95] block mb-1">
                Optional Private Journal Note
              </label>
              <textarea
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="Reflect freely on what you learned about yourself today. Fully private and encrypted to your profile."
                rows={2}
                className="w-full bg-[#101512] border border-[#1F2922] focus:border-[#16C784] rounded-xl p-3 text-xs text-[#F5F7F5] outline-none placeholder-[#5C665F] resize-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#16C784] to-[#80FF00] hover:from-[#14b677] hover:to-[#72e600] text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-[#16C784]/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Check-in...' : 'Lock In Daily Check-In (+30 XP)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
