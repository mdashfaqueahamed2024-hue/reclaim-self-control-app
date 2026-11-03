import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { supabase, isSupabaseConfigured, getLocalItem, setLocalItem, STORAGE_KEYS } from '@/lib/supabase';
import { LEVEL_DEFINITIONS } from '@/lib/constants';

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (email: string, username: string, password?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addXP: (amount: number, source: string, description: string) => Promise<void>;
  recordGoalCheckIn: (achieved: boolean) => Promise<void>;
}

const DEFAULT_DEMO_PROFILE: UserProfile = {
  id: 'demo-user-101',
  email: 'alex.reclaim@pulse.io',
  username: 'Alex Vanguard',
  avatar_index: 1,
  personal_goal: 'Reclaiming mental clarity, healthy dopamine pathways, and high energy',
  created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  daily_reminder_time: '21:00',
  notifications_enabled: true,
  current_streak: 15,
  longest_streak: 15,
  total_goal_days: 15,
  total_xp: 420,
  level: 3, // Disciplined
  points_balance: 2602,
  theme_preference: 'dark-emerald'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load active session on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email || '' });
            // Fetch profile
            const { data: profData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profData) {
              setProfile(profData as UserProfile);
            }
          }
        } catch (err) {
          console.warn('Supabase auth session fetch error:', err);
        }
      } else {
        // Local mode
        const savedSession = getLocalItem<{ id: string; email: string } | null>(STORAGE_KEYS.AUTH_SESSION, {
          id: DEFAULT_DEMO_PROFILE.id,
          email: DEFAULT_DEMO_PROFILE.email
        });
        const savedProfile = getLocalItem<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_DEMO_PROFILE);

        if (savedSession) {
          setUser(savedSession);
          setProfile(savedProfile);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const calculateLevel = (xp: number): number => {
    for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_DEFINITIONS[i].minXp) {
        return LEVEL_DEFINITIONS[i].level;
      }
    }
    return 1;
  };

  const signIn = async (email: string, password?: string) => {
    if (isSupabaseConfigured && supabase && password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email || '' });
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (prof) setProfile(prof as UserProfile);
      }
      return {};
    } else {
      // Local demo sign in
      const newSession = { id: `user-${Date.now()}`, email };
      const currentProf = getLocalItem<UserProfile>(STORAGE_KEYS.PROFILE, {
        ...DEFAULT_DEMO_PROFILE,
        email,
        username: email.split('@')[0]
      });
      setUser(newSession);
      setProfile(currentProf);
      setLocalItem(STORAGE_KEYS.AUTH_SESSION, newSession);
      return {};
    }
  };

  const signUp = async (email: string, username: string, password?: string) => {
    if (isSupabaseConfigured && supabase && password) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });
      if (error) return { error: error.message };

      if (data.user) {
        const newProf: UserProfile = {
          ...DEFAULT_DEMO_PROFILE,
          id: data.user.id,
          email,
          username,
          current_streak: 0,
          longest_streak: 0,
          total_goal_days: 0,
          total_xp: 20,
          level: 1,
          points_balance: 100
        };
        await supabase.from('profiles').insert(newProf);
        setUser({ id: data.user.id, email });
        setProfile(newProf);
      }
      return {};
    } else {
      // Local demo registration
      const newSession = { id: `user-${Date.now()}`, email };
      const newProf: UserProfile = {
        ...DEFAULT_DEMO_PROFILE,
        id: newSession.id,
        email,
        username,
        current_streak: 1,
        longest_streak: 1,
        total_goal_days: 1,
        total_xp: 50,
        level: 1,
        points_balance: 500
      };
      setUser(newSession);
      setProfile(newProf);
      setLocalItem(STORAGE_KEYS.AUTH_SESSION, newSession);
      setLocalItem(STORAGE_KEYS.PROFILE, newProf);
      return {};
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    setProfile(updated);
    setLocalItem(STORAGE_KEYS.PROFILE, updated);

    if (isSupabaseConfigured && supabase && user) {
      await supabase.from('profiles').update(updates).eq('id', user.id);
    }
  };

  const addXP = async (amount: number, source: string, description: string) => {
    if (!profile) return;
    const newXP = profile.total_xp + amount;
    const newPoints = profile.points_balance + amount;
    const newLevel = calculateLevel(newXP);

    const updates: Partial<UserProfile> = {
      total_xp: newXP,
      points_balance: newPoints,
      level: newLevel
    };

    await updateProfile(updates);

    // Save transaction
    const tx = {
      id: `xp-${Date.now()}`,
      user_id: profile.id,
      amount,
      source,
      description,
      created_at: new Date().toISOString()
    };
    const currentTx = getLocalItem<any[]>(STORAGE_KEYS.XP_LOG, []);
    setLocalItem(STORAGE_KEYS.XP_LOG, [tx, ...currentTx]);
  };

  const recordGoalCheckIn = async (achieved: boolean) => {
    if (!profile) return;

    if (achieved) {
      const nextStreak = profile.current_streak + 1;
      const nextLongest = Math.max(nextStreak, profile.longest_streak);
      const nextTotal = profile.total_goal_days + 1;

      await updateProfile({
        current_streak: nextStreak,
        longest_streak: nextLongest,
        total_goal_days: nextTotal
      });
      await addXP(25, 'daily_checkin', `Goal completed! Day ${nextStreak} streak unlocked.`);
    } else {
      // Non-judgmental restart: preserves total_goal_days and historical achievements!
      await updateProfile({
        current_streak: 0
      });
      await addXP(10, 'daily_checkin', 'Honest check-in registered. Courage to restart.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        updateProfile,
        addXP,
        recordGoalCheckIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
