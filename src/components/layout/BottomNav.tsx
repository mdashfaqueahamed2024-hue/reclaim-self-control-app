import React from 'react';
import {
  Home,
  BarChart2,
  Trophy,
  CheckCircle2,
  Sparkles,
  LifeBuoy
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const BottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    todayCheckIn,
    setShowCheckInModal,
    setShowEmergencyModal
  } = useApp();

  return (
    <div className="md:hidden fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="glass-nav bg-[#101512]/90 border border-[#1F2922] rounded-3xl p-1.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-1">
          {/* Today / Dashboard Tab */}
          <button
            onClick={() => setActiveView('dashboard')}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all ${
              activeView === 'dashboard'
                ? 'bg-[#151C18] text-[#16C784] shadow-sm'
                : 'text-[#929C95] hover:text-[#F5F7F5]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] font-bold mt-1">Today</span>
          </button>

          {/* Progress / Analytics Tab */}
          <button
            onClick={() => setActiveView('analytics')}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all ${
              activeView === 'analytics'
                ? 'bg-[#151C18] text-[#16C784] shadow-sm'
                : 'text-[#929C95] hover:text-[#F5F7F5]'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span className="text-[10px] font-bold mt-1">Progress</span>
          </button>

          {/* Central Glowing Action Button (Matching Image 1 & 4!) */}
          <div className="relative -mt-6 px-1">
            <button
              onClick={() => {
                if (!todayCheckIn) {
                  setShowCheckInModal(true);
                } else {
                  setShowEmergencyModal(true);
                }
              }}
              className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#16C784] to-[#80FF00] p-0.5 shadow-lg shadow-[#80FF00]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
              title={todayCheckIn ? 'Emergency Support' : 'Daily Check-in'}
            >
              <div className="w-full h-full rounded-full bg-[#080B0A] flex items-center justify-center group-hover:bg-[#101512] transition-colors">
                {todayCheckIn ? (
                  <LifeBuoy className="w-5 h-5 text-rose-400 group-hover:text-rose-300" />
                ) : (
                  <Sparkles className="w-5 h-5 text-[#80FF00] group-hover:text-[#16C784]" />
                )}
              </div>
            </button>
          </div>

          {/* Quests / Challenges Tab */}
          <button
            onClick={() => setActiveView('challenges')}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all ${
              activeView === 'challenges'
                ? 'bg-[#151C18] text-[#16C784] shadow-sm'
                : 'text-[#929C95] hover:text-[#F5F7F5]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] font-bold mt-1">Quests</span>
          </button>

          {/* Trophies Tab */}
          <button
            onClick={() => setActiveView('achievements')}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all ${
              activeView === 'achievements'
                ? 'bg-[#151C18] text-[#16C784] shadow-sm'
                : 'text-[#929C95] hover:text-[#F5F7F5]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-[10px] font-bold mt-1">Trophies</span>
          </button>
        </div>
      </div>
    </div>
  );
};
