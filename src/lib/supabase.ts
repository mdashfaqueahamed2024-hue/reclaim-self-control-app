import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local storage keys for resilient offline operation & demo mode
export const STORAGE_KEYS = {
  PROFILE: 'reclaim_user_profile',
  CHECKINS: 'reclaim_daily_checkins',
  ACHIEVEMENTS: 'reclaim_achievements',
  CHALLENGES: 'reclaim_challenges',
  JOURNAL: 'reclaim_journal_entries',
  RECOVERY: 'reclaim_recovery_sessions',
  XP_LOG: 'reclaim_xp_transactions',
  STORE: 'reclaim_store_items',
  AUTH_SESSION: 'reclaim_auth_session'
};

export function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save to localStorage for key: ${key}`, e);
  }
}
