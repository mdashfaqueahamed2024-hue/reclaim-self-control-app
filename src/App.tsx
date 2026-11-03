import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';

// Views
import { LandingPage } from '@/components/landing/LandingPage';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { ChallengesView } from '@/components/challenges/ChallengesView';
import { GamificationView } from '@/components/gamification/GamificationView';
import { JournalView } from '@/components/journal/JournalView';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { SettingsView } from '@/components/settings/SettingsView';

// Modals
import { DailyCheckInModal } from '@/components/checkin/DailyCheckInModal';
import { EmergencyRecoveryModal } from '@/components/recovery/EmergencyRecoveryModal';
import { MilestoneModal } from '@/components/modals/MilestoneModal';
import { AuthModal } from '@/components/auth/AuthModal';

const MainShell: React.FC = () => {
  const { activeView, setActiveView, setShowEmergencyModal } = useApp();
  const { isLoading } = useAuth();

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080B0A] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-[#80FF00] p-0.5 animate-spin">
          <div className="w-full h-full bg-[#080B0A] rounded-[14px]" />
        </div>
        <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">Loading RECLAIM Engine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B0A] text-[#F5F7F5] selection:bg-emerald-500/30 selection:text-white relative flex flex-col font-sans">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'challenges' && <ChallengesView />}
        {activeView === 'achievements' && <GamificationView />}
        {activeView === 'journal' && <JournalView />}
        {activeView === 'analytics' && <AnalyticsView />}
        {activeView === 'settings' && <SettingsView />}
        {activeView === 'recovery' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-3xl font-extrabold text-white">Emergency Support Center</h1>
              <p className="text-zinc-400 text-sm mt-1">Guided protocols for overcoming intense impulses</p>
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="mt-6 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-extrabold text-sm shadow-xl shadow-rose-500/30 active:scale-95 transition-all"
              >
                Launch Urge Surfing SOS Protocol
              </button>
            </div>
            <DashboardView />
          </div>
        )}
      </main>

      {/* Mobile Floating Bottom Dock */}
      <BottomNav />

      {/* Global Interactive Modals */}
      <DailyCheckInModal />
      <EmergencyRecoveryModal />
      <MilestoneModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainShell />
      </AppProvider>
    </AuthProvider>
  );
}
