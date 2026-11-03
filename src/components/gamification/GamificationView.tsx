import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Zap,
  Shield,
  Star,
  Flame,
  Crown,
  Lock,
  Check,
  ShoppingBag,
  Sparkles,
  Info
} from 'lucide-react';
import { Achievement, StoreRewardItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { LEVEL_DEFINITIONS } from '@/lib/constants';

export const GamificationView: React.FC = () => {
  const { achievements, storeItems, buyStoreItem, equipStoreItem } = useApp();
  const { profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [activeTab, setActiveTab] = useState<'trophies' | 'store'>('trophies');
  const [inspectedAchievement, setInspectedAchievement] = useState<Achievement | null>(null);

  const currentLevelInfo = LEVEL_DEFINITIONS.find((l) => l.level === (profile?.level || 1)) || LEVEL_DEFINITIONS[0];
  const nextLevelInfo = LEVEL_DEFINITIONS.find((l) => l.level === (profile?.level || 1) + 1) || LEVEL_DEFINITIONS[LEVEL_DEFINITIONS.length - 1];

  const currentXp = profile?.total_xp || 0;
  const progressInLevel = Math.min(
    100,
    Math.max(0, ((currentXp - currentLevelInfo.minXp) / (nextLevelInfo.minXp - currentLevelInfo.minXp)) * 100)
  );

  const filteredAchievements = achievements.filter((a) => {
    if (selectedCategory === 'unlocked') return a.is_unlocked;
    if (selectedCategory === 'locked') return !a.is_unlocked;
    return true;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'from-amber-700/80 to-amber-900/90 text-amber-300 border-amber-600/40';
      case 'silver':
        return 'from-slate-400/80 to-slate-700/90 text-slate-200 border-slate-400/40';
      case 'gold':
        return 'from-yellow-400/80 to-amber-600/90 text-yellow-200 border-yellow-500/50 shadow-amber-500/20';
      case 'platinum':
        return 'from-cyan-400/80 to-blue-700/90 text-cyan-200 border-cyan-400/40 shadow-cyan-500/20';
      case 'diamond':
        return 'from-emerald-400/80 to-teal-800/90 text-emerald-200 border-emerald-400/50 shadow-emerald-500/30';
      default:
        return 'from-[#1F2922] to-[#151C18] text-[#929C95] border-[#1F2922]';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Gamification Header matching Image 2 & 3 */}
      <div className="bg-[#101512] border border-[#1F2922] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#16C784]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151C18] border border-[#16C784]/30 text-[#16C784] text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Gamified Mastery Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight">
              Trophies & Reward Vault
            </h1>
            <p className="text-xs text-[#929C95] mt-1 max-w-lg">
              Earn XP with daily discipline, unlock metallic achievement badges, and redeem prestige profile themes.
            </p>
          </div>

          {/* Metric Badges Matching Image 2 */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-[#151C18] border border-[#1F2922] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#929C95] uppercase block">Total Points</span>
                <span className="text-sm font-black text-[#F5F7F5]">{profile?.points_balance || 2602}</span>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#151C18] border border-[#1F2922] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#80FF00]/20 flex items-center justify-center text-[#80FF00]">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#929C95] uppercase block">Total XP</span>
                <span className="text-sm font-black text-[#80FF00]">{profile?.total_xp || 420}</span>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-[#151C18] border border-[#1F2922] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#929C95] uppercase block">Rank Tier</span>
                <span className="text-sm font-black text-emerald-400">Level {profile?.level || 3}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="mt-8 pt-6 border-t border-[#1F2922] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[#F5F7F5]">
              <span>{currentLevelInfo.badge}</span>
              <span>Level {currentLevelInfo.level}: {currentLevelInfo.name}</span>
            </span>
            <span className="text-[#929C95]">
              Next: <strong className="text-emerald-400">Level {nextLevelInfo.level} ({nextLevelInfo.name})</strong> • {nextLevelInfo.minXp - currentXp} XP needed
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#080B0A] overflow-hidden p-0.5 border border-[#1F2922]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#16C784] via-[#80FF00] to-emerald-400 transition-all duration-700 shadow-sm shadow-[#80FF00]/40"
              style={{ width: `${progressInLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs: Trophies vs Reward Store */}
      <div className="flex items-center justify-between gap-4 border-b border-[#1F2922] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('trophies')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'trophies'
                ? 'bg-[#151C18] text-[#16C784] border border-[#16C784]/30 shadow-sm'
                : 'text-[#929C95] hover:text-[#F5F7F5]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Trophy Gallery ({achievements.filter((a) => a.is_unlocked).length}/{achievements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'store'
                ? 'bg-[#151C18] text-[#16C784] border border-[#16C784]/30 shadow-sm'
                : 'text-[#929C95] hover:text-[#F5F7F5]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Reward Store</span>
          </button>
        </div>

        {activeTab === 'trophies' && (
          <div className="flex items-center gap-1.5 bg-[#151C18] p-1 rounded-xl border border-[#1F2922] text-xs">
            {(['all', 'unlocked', 'locked'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                  selectedCategory === cat ? 'bg-[#101512] text-[#F5F7F5] shadow-xs' : 'text-[#929C95]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: TROPHY & MEDAL SHOWCASE (Matching Image 2 & 3) */}
      {activeTab === 'trophies' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAchievements.map((badge) => {
            const tierStyle = getTierColor(badge.tier);
            return (
              <div
                key={badge.id}
                onClick={() => setInspectedAchievement(badge)}
                className={`relative rounded-3xl p-5 border text-center transition-all cursor-pointer group flex flex-col items-center justify-between ${
                  badge.is_unlocked
                    ? 'bg-[#151C18] hover:border-[#16C784]/50 hover:scale-[1.02] shadow-lg shadow-black/40'
                    : 'bg-[#101512]/50 border-[#1F2922]/60 opacity-60 hover:opacity-85'
                }`}
              >
                {/* Top Badge Tier Pill */}
                <div className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-wider mb-3">
                  <span className={`px-2 py-0.5 rounded-md border ${tierStyle}`}>
                    {badge.tier}
                  </span>
                  <span className="text-[#80FF00]">+{badge.xp_reward} XP</span>
                </div>

                {/* Metallic Emblem Graphic (Matching Image 2 & 3!) */}
                <div className="my-4 relative">
                  <div
                    className={`w-24 h-24 rounded-2xl p-1 bg-gradient-to-br ${
                      badge.is_unlocked
                        ? 'from-[#D6AD60] via-[#FCE49C] to-[#8A6720] shadow-xl shadow-amber-500/20'
                        : 'from-[#1F2922] to-[#101512]'
                    } flex items-center justify-center transform group-hover:rotate-6 transition-transform`}
                  >
                    <div className="w-full h-full rounded-[14px] bg-[#080B0A] flex flex-col items-center justify-center relative overflow-hidden">
                      {badge.is_unlocked ? (
                        <>
                          <Trophy className="w-10 h-10 text-amber-300 drop-shadow-md" />
                          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent pointer-events-none" />
                        </>
                      ) : (
                        <Lock className="w-8 h-8 text-[#5C665F]" />
                      )}
                    </div>
                  </div>

                  {/* Ribbon Banner for Unlocked */}
                  {badge.is_unlocked && (
                    <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-md">
                      Unlocked
                    </div>
                  )}
                </div>

                {/* Titles */}
                <div className="space-y-1 w-full">
                  <h3 className="font-extrabold text-xs text-[#F5F7F5] truncate">{badge.title}</h3>
                  <p className="text-[10px] text-[#929C95] truncate">{badge.tagline}</p>
                </div>

                {/* Milestone Requirement */}
                <div className="mt-3 pt-2.5 border-t border-[#1F2922] w-full text-[10px] text-[#929C95] font-semibold flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>{badge.milestone_days} Days Streak Goal</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: REWARD STORE */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#151C18] border border-[#1F2922] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#80FF00]" />
              <div>
                <h4 className="text-xs font-bold text-[#F5F7F5]">Discipline Rewards Store</h4>
                <p className="text-[11px] text-[#929C95]">Redeem your hard-earned points for custom UI skins and prestige frames.</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#929C95] uppercase font-bold block">Available Balance</span>
              <span className="text-sm font-black text-[#80FF00]">{profile?.points_balance || 0} XP</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {storeItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-[#151C18] border border-[#1F2922] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#101512] border border-[#1F2922] flex items-center justify-center text-amber-400">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#F5F7F5]">{item.title}</h4>
                    <p className="text-[11px] text-[#929C95] mt-0.5">{item.description}</p>
                    <span className="text-[10px] font-bold text-[#80FF00] mt-1 block">Cost: {item.cost_xp} XP</span>
                  </div>
                </div>

                <div>
                  {item.is_purchased ? (
                    <button
                      onClick={() => equipStoreItem(item)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        item.is_equipped
                          ? 'bg-[#16C784]/20 border border-[#16C784] text-[#16C784]'
                          : 'bg-[#101512] border border-[#1F2922] text-[#929C95] hover:text-[#F5F7F5]'
                      }`}
                    >
                      {item.is_equipped ? 'Equipped' : 'Equip'}
                    </button>
                  ) : (
                    <button
                      onClick={() => buyStoreItem(item)}
                      disabled={(profile?.points_balance || 0) < item.cost_xp}
                      className="px-4 py-2 rounded-xl bg-[#16C784] hover:bg-[#14b677] text-slate-950 text-xs font-black disabled:opacity-40 transition-all shadow-md"
                    >
                      Unlock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Detail Popover Modal */}
      {inspectedAchievement && (
        <div className="fixed inset-0 z-50 bg-[#080B0A]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#101512] border border-[#1F2922] rounded-3xl p-6 max-w-sm w-full text-center relative space-y-4">
            <button
              onClick={() => setInspectedAchievement(null)}
              className="absolute top-4 right-4 text-[#929C95] hover:text-[#F5F7F5]"
            >
              ✕
            </button>
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 mx-auto flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#F5F7F5]">{inspectedAchievement.title}</h3>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">{inspectedAchievement.tagline}</p>
            </div>
            <p className="text-xs text-[#929C95] leading-relaxed">{inspectedAchievement.description}</p>
            <div className="p-3 rounded-xl bg-[#151C18] border border-[#1F2922] text-xs font-semibold flex items-center justify-between">
              <span>Reward:</span>
              <span className="font-black text-[#80FF00]">+{inspectedAchievement.xp_reward} XP Points</span>
            </div>
            <button
              onClick={() => setInspectedAchievement(null)}
              className="w-full py-2.5 rounded-xl bg-[#151C18] text-[#F5F7F5] font-bold text-xs hover:bg-[#1F2922]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
