import React from 'react';
import { Sparkles, Trophy, X, Share2, Flame } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

export const MilestoneModal: React.FC = () => {
  const { showMilestoneModal, setShowMilestoneModal, activeMilestone, triggerCelebration } = useApp();
  const { profile } = useAuth();

  if (!showMilestoneModal || !activeMilestone) return null;

  const handleShare = () => {
    triggerCelebration();
    if (navigator.share) {
      navigator.share({
        title: `RECLAIM: ${activeMilestone.title} Unlocked!`,
        text: `I just hit my ${activeMilestone.milestone_days}-day streak milestone on RECLAIM! Rebuilding discipline and self-control day by day.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(
        `🏆 Just unlocked the ${activeMilestone.title} (${activeMilestone.milestone_days} Days Streak) on RECLAIM! #SelfDiscipline #Reclaim`
      );
      alert('Celebration badge copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080B0A]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#101512] border border-[#1F2922] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 text-center overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#16C784]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setShowMilestoneModal(false)}
          className="absolute top-4 right-4 text-[#929C95] hover:text-[#F5F7F5] p-2 rounded-xl hover:bg-[#151C18] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Congratulations Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151C18] border border-[#16C784]/30 text-[#16C784] text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Milestone Reclaimed</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F7F5] tracking-tight">
          Congratulations!
        </h2>
        <p className="text-xs text-[#929C95] mt-1 font-medium">
          You have conquered another critical stage of neuroplastic rewiring.
        </p>

        {/* Golden Star & Ribbon Badge (Matching Image 4) */}
        <div className="my-8 relative flex items-center justify-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Outer Pulsing Aura */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D6AD60]/20 via-[#16C784]/20 to-transparent blur-xl animate-pulse" />

            {/* Golden Star Base */}
            <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-tr from-[#D6AD60] via-[#FCE49C] to-[#C49B45] p-1 shadow-2xl shadow-amber-500/30 rotate-45 flex items-center justify-center">
              <div className="w-full h-full rounded-[22px] bg-[#151C18] flex flex-col items-center justify-center -rotate-45">
                <Flame className="w-6 h-6 text-amber-400 mb-0.5 animate-bounce" />
                <span className="text-2xl font-black text-amber-300 tracking-tight leading-none">
                  {activeMilestone.milestone_days}
                </span>
                <span className="text-[10px] font-extrabold text-[#929C95] uppercase tracking-wider mt-0.5">
                  Days
                </span>
              </div>
            </div>

            {/* Milestone Ribbon Banner */}
            <div className="absolute -bottom-2 inset-x-2 py-1.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 border border-pink-400/50 shadow-lg shadow-pink-500/25 flex items-center justify-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-black text-white uppercase tracking-wider truncate">
                {activeMilestone.title}
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Reflection Message */}
        <div className="bg-[#151C18] border border-[#1F2922] rounded-2xl p-4 text-left space-y-2 mb-6">
          <p className="text-xs text-[#F5F7F5] leading-relaxed italic">
            "{activeMilestone.description}"
          </p>
          <div className="pt-2 border-t border-[#1F2922] flex items-center justify-between text-[11px] text-[#929C95]">
            <span>Bonus Unlocked:</span>
            <span className="font-bold text-[#80FF00]">+{activeMilestone.xp_reward} XP Awarded</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleShare}
            className="w-full py-3.5 rounded-2xl bg-[#80FF00] hover:bg-[#72e600] text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-[#80FF00]/25 transition-all flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share your progress</span>
          </button>

          <button
            onClick={() => setShowMilestoneModal(false)}
            className="w-full py-2.5 rounded-2xl text-xs font-bold text-[#929C95] hover:text-[#F5F7F5] transition-colors"
          >
            Continue Journey
          </button>
        </div>
      </div>
    </div>
  );
};
