import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Zap,
  Filter,
  Flame,
  Award,
  Sparkles,
  BookOpen,
  Compass,
  PhoneOff,
  Wind,
  Droplet,
  Moon
} from 'lucide-react';
import { ChallengeCategory } from '@/types';
import { useApp } from '@/context/AppContext';

export const ChallengesView: React.FC = () => {
  const { challenges, completeChallenge } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<ChallengeCategory | 'all'>('all');

  const filteredChallenges = challenges.filter((c) => {
    if (selectedFilter === 'all') return true;
    return c.category === selectedFilter;
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-cyan-400" />;
      case 'SmartphoneOff':
        return <PhoneOff className="w-5 h-5 text-rose-400" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-teal-400" />;
      case 'Droplet':
        return <Droplet className="w-5 h-5 text-blue-400" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-purple-400" />;
      default:
        return <Zap className="w-5 h-5 text-amber-400" />;
    }
  };

  const completedCount = challenges.filter((c) => c.is_completed).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200 pb-24 md:pb-12">
      {/* Header Banner */}
      <div className="bg-[#101512] border border-[#1F2922] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151C18] border border-[#16C784]/30 text-[#16C784] text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Daily Discipline Quests</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight">
            Dopamine Reset Missions
          </h1>
          <p className="text-xs text-[#929C95] mt-1 max-w-lg">
            Replace passive compulsive consumption with high-agency physical and mental rituals.
          </p>
        </div>

        <div className="px-5 py-3 rounded-2xl bg-[#151C18] border border-[#1F2922] text-right">
          <span className="text-[10px] font-bold text-[#929C95] uppercase block">Completed Missions</span>
          <span className="text-lg font-black text-[#80FF00]">{completedCount} / {challenges.length} Done</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {[
          { id: 'all', label: 'All Missions' },
          { id: 'physical', label: 'Physical' },
          { id: 'digital-detox', label: 'Digital Detox' },
          { id: 'mindfulness', label: 'Mindfulness' },
          { id: 'productivity', label: 'Productivity' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              selectedFilter === tab.id
                ? 'bg-[#151C18] text-[#16C784] border-[#16C784]/40 shadow-sm'
                : 'bg-[#101512] text-[#929C95] border-[#1F2922] hover:text-[#F5F7F5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Challenges Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredChallenges.map((quest) => (
          <div
            key={quest.id}
            className={`rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
              quest.is_completed
                ? 'bg-[#151C18]/60 border-[#16C784]/30'
                : 'bg-[#151C18] border-[#1F2922] hover:border-[#1F2922]/80'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#101512] border border-[#1F2922] flex items-center justify-center shrink-0">
                  {getCategoryIcon(quest.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#101512] text-[9px] font-black uppercase text-[#929C95] tracking-wider border border-[#1F2922]">
                      {quest.category}
                    </span>
                    <span className="text-[10px] text-[#929C95] font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {quest.duration_minutes >= 60 ? `${quest.duration_minutes / 60}h` : `${quest.duration_minutes}m`}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-[#F5F7F5] mt-1">{quest.title}</h3>
                  <p className="text-xs text-[#929C95] mt-1 leading-relaxed">{quest.description}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1F2922] flex items-center justify-between">
              <span className="text-xs font-black text-[#80FF00]">+{quest.xp_reward} XP Points</span>

              {quest.is_completed ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mission Completed</span>
                </div>
              ) : (
                <button
                  onClick={() => completeChallenge(quest.id)}
                  className="px-4 py-2 rounded-xl bg-[#16C784] hover:bg-[#14b677] text-slate-950 font-black text-xs transition-all shadow-md shadow-[#16C784]/20 hover:scale-[1.02]"
                >
                  Complete Mission
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
