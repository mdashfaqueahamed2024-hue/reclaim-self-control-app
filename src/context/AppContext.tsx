import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ActiveView,
  DailyCheckIn,
  Achievement,
  Challenge,
  JournalEntry,
  RecoverySession,
  StoreRewardItem
} from '@/types';
import {
  INITIAL_ACHIEVEMENTS,
  INITIAL_CHALLENGES,
  INITIAL_STORE_ITEMS
} from '@/lib/constants';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Check-ins
  checkIns: DailyCheckIn[];
  todayCheckIn: DailyCheckIn | null;
  submitCheckIn: (checkInData: Omit<DailyCheckIn, 'id' | 'user_id' | 'created_at' | 'xp_earned'>) => Promise<void>;

  // Achievements & Gamification
  achievements: Achievement[];
  storeItems: StoreRewardItem[];
  buyStoreItem: (item: StoreRewardItem) => boolean;
  equipStoreItem: (item: StoreRewardItem) => void;

  // Challenges
  challenges: Challenge[];
  completeChallenge: (challengeId: string) => Promise<void>;

  // Private Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;

  // Emergency Recovery Mode
  recoverySessions: RecoverySession[];
  saveRecoverySession: (session: Omit<RecoverySession, 'id' | 'user_id' | 'created_at'>) => void;
  showEmergencyModal: boolean;
  setShowEmergencyModal: (show: boolean) => void;

  // Modals
  showCheckInModal: boolean;
  setShowCheckInModal: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;
  showMilestoneModal: boolean;
  setShowMilestoneModal: (show: boolean) => void;
  activeMilestone: Achievement | null;

  triggerCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate sample past check-ins for demo visualization
const generatePastCheckIns = (userId: string): DailyCheckIn[] => {
  const result: DailyCheckIn[] = [];
  const now = new Date();

  for (let i = 14; i >= 1; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    result.push({
      id: `checkin-past-${i}`,
      user_id: userId,
      date: dateStr,
      achieved_goal: true,
      urge_intensity: Math.max(1, Math.min(8, Math.floor(Math.random() * 6) + 2)),
      mood: i % 3 === 0 ? 'focused' : i % 2 === 0 ? 'calm' : 'happy',
      triggers: i % 4 === 0 ? ['Social media', 'Boredom'] : ['Idle time'],
      coping_strategies: ['Cold shower', '15-min walk', 'Breathing exercise'],
      accomplishments: `Maintained self-control throughout day ${15 - i}. Read for 30 minutes.`,
      xp_earned: 25,
      created_at: d.toISOString()
    });
  }
  return result;
};

const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'journal-1',
    user_id: 'demo-user-101',
    title: 'Breaking the late-night browsing loop',
    content: 'Noticed that my strongest triggers happen after 11 PM when I bring my phone into the bedroom. Decided to leave the phone on the kitchen counter tonight. Woke up feeling clear-headed and fully in control.',
    mood: 'focused',
    tags: ['Sleep', 'Environment Design', 'Victory'],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'journal-2',
    user_id: 'demo-user-101',
    title: 'Surfing the Urge: 10 minutes that changed everything',
    content: 'Had a strong urge around 4 PM while feeling stressed with work. Used the 60-second breathing timer in RECLAIM and immediately went for a walk outside. The craving peaked at 3 minutes and completely vanished by minute 7. The wave always passes if you do not fight it head-on.',
    mood: 'calm',
    tags: ['Urge Surfing', 'Mindfulness', 'Stress'],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, addXP, recordGoalCheckIn } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(() => {
    return getLocalItem<DailyCheckIn[]>(STORAGE_KEYS.CHECKINS, generatePastCheckIns('demo-user-101'));
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    return getLocalItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS);
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    return getLocalItem<Challenge[]>(STORAGE_KEYS.CHALLENGES, INITIAL_CHALLENGES);
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    return getLocalItem<JournalEntry[]>(STORAGE_KEYS.JOURNAL, INITIAL_JOURNAL_ENTRIES);
  });

  const [recoverySessions, setRecoverySessions] = useState<RecoverySession[]>(() => {
    return getLocalItem<RecoverySession[]>(STORAGE_KEYS.RECOVERY, []);
  });

  const [storeItems, setStoreItems] = useState<StoreRewardItem[]>(() => {
    return getLocalItem<StoreRewardItem[]>(STORAGE_KEYS.STORE, INITIAL_STORE_ITEMS);
  });

  // Modal States
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<Achievement | null>(null);

  // Today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIn = checkIns.find((c) => c.date === todayStr) || null;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#16C784', '#80FF00', '#D6AD60', '#F5F7F5']
    });
  };

  const submitCheckIn = async (checkInData: Omit<DailyCheckIn, 'id' | 'user_id' | 'created_at' | 'xp_earned'>) => {
    const userId = user?.id || 'demo-user-101';
    const xpReward = checkInData.achieved_goal ? 30 : 15;

    const newCheckIn: DailyCheckIn = {
      ...checkInData,
      id: `checkin-${Date.now()}`,
      user_id: userId,
      xp_earned: xpReward,
      created_at: new Date().toISOString()
    };

    // Replace if already checked in today, otherwise append
    const existingIdx = checkIns.findIndex((c) => c.date === checkInData.date);
    let updatedCheckIns: DailyCheckIn[];
    if (existingIdx >= 0) {
      updatedCheckIns = [...checkIns];
      updatedCheckIns[existingIdx] = newCheckIn;
    } else {
      updatedCheckIns = [newCheckIn, ...checkIns];
    }

    setCheckIns(updatedCheckIns);
    setLocalItem(STORAGE_KEYS.CHECKINS, updatedCheckIns);

    // Update streak and XP in auth context
    await recordGoalCheckIn(checkInData.achieved_goal);

    triggerCelebration();

    // Check for newly unlocked milestone achievement
    const newStreak = checkInData.achieved_goal ? (profile?.current_streak || 0) + 1 : 0;
    const matchingBadge = achievements.find(
      (a) => !a.is_unlocked && a.milestone_days <= newStreak
    );

    if (matchingBadge) {
      const updatedBadges = achievements.map((a) =>
        a.id === matchingBadge.id ? { ...a, is_unlocked: true, unlocked_at: new Date().toISOString() } : a
      );
      setAchievements(updatedBadges);
      setLocalItem(STORAGE_KEYS.ACHIEVEMENTS, updatedBadges);
      setActiveMilestone(matchingBadge);
      setShowMilestoneModal(true);
      await addXP(matchingBadge.xp_reward, 'milestone', `Unlocked ${matchingBadge.title}!`);
    }

    setShowCheckInModal(false);
  };

  const completeChallenge = async (challengeId: string) => {
    const target = challenges.find((c) => c.id === challengeId);
    if (!target || target.is_completed) return;

    const updated = challenges.map((c) =>
      c.id === challengeId ? { ...c, is_completed: true, completed_at: new Date().toISOString() } : c
    );
    setChallenges(updated);
    setLocalItem(STORAGE_KEYS.CHALLENGES, updated);

    await addXP(target.xp_reward, 'challenge', `Completed mission: ${target.title}`);
    triggerCelebration();
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      user_id: user?.id || 'demo-user-101',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const updated = [newEntry, ...journalEntries];
    setJournalEntries(updated);
    setLocalItem(STORAGE_KEYS.JOURNAL, updated);
    addXP(10, 'bonus', 'Wrote in private reflection journal');
  };

  const updateJournalEntry = (id: string, updates: Partial<JournalEntry>) => {
    const updated = journalEntries.map((e) =>
      e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e
    );
    setJournalEntries(updated);
    setLocalItem(STORAGE_KEYS.JOURNAL, updated);
  };

  const deleteJournalEntry = (id: string) => {
    const updated = journalEntries.filter((e) => e.id !== id);
    setJournalEntries(updated);
    setLocalItem(STORAGE_KEYS.JOURNAL, updated);
  };

  const saveRecoverySession = (session: Omit<RecoverySession, 'id' | 'user_id' | 'created_at'>) => {
    const newSession: RecoverySession = {
      ...session,
      id: `recovery-${Date.now()}`,
      user_id: user?.id || 'demo-user-101',
      created_at: new Date().toISOString()
    };
    const updated = [newSession, ...recoverySessions];
    setRecoverySessions(updated);
    setLocalItem(STORAGE_KEYS.RECOVERY, updated);
    addXP(20, 'recovery_complete', 'Completed emergency impulse regulation protocol');
  };

  const buyStoreItem = (item: StoreRewardItem): boolean => {
    if (!profile || profile.points_balance < item.cost_xp || item.is_purchased) {
      return false;
    }
    const updated = storeItems.map((s) => (s.id === item.id ? { ...s, is_purchased: true } : s));
    setStoreItems(updated);
    setLocalItem(STORAGE_KEYS.STORE, updated);
    addXP(-item.cost_xp, 'bonus', `Redeemed store reward: ${item.title}`);
    triggerCelebration();
    return true;
  };

  const equipStoreItem = (item: StoreRewardItem) => {
    const updated = storeItems.map((s) => {
      if (s.category === item.category) {
        return { ...s, is_equipped: s.id === item.id };
      }
      return s;
    });
    setStoreItems(updated);
    setLocalItem(STORAGE_KEYS.STORE, updated);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        checkIns,
        todayCheckIn,
        submitCheckIn,
        achievements,
        storeItems,
        buyStoreItem,
        equipStoreItem,
        challenges,
        completeChallenge,
        journalEntries,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        recoverySessions,
        saveRecoverySession,
        showEmergencyModal,
        setShowEmergencyModal,
        showCheckInModal,
        setShowCheckInModal,
        showAuthModal,
        setShowAuthModal,
        authMode,
        setAuthMode,
        showMilestoneModal,
        setShowMilestoneModal,
        activeMilestone,
        triggerCelebration
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
