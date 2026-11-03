export type MoodType = 'happy' | 'focused' | 'calm' | 'stressed' | 'anxious' | 'tired' | 'unmotivated';

export type TriggerType =
  | 'Boredom'
  | 'Stress'
  | 'Loneliness'
  | 'Social media'
  | 'Late-night browsing'
  | 'Fatigue'
  | 'Anxiety'
  | 'Idle time'
  | 'Other';

export type ChallengeCategory = 'mindfulness' | 'physical' | 'digital-detox' | 'productivity' | 'mental-strength';

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  avatar_index?: number;
  personal_goal: string;
  created_at: string;
  timezone: string;
  daily_reminder_time: string;
  notifications_enabled: boolean;
  current_streak: number;
  longest_streak: number;
  total_goal_days: number;
  total_xp: number;
  level: number;
  points_balance: number;
  theme_preference: 'dark-emerald' | 'pure-black' | 'midnight-gold';
}

export interface DailyCheckIn {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  achieved_goal: boolean;
  urge_intensity: number; // 1 to 10
  mood: MoodType;
  triggers: TriggerType[];
  coping_strategies: string[];
  accomplishments: string;
  journal_notes?: string;
  xp_earned: number;
  created_at: string;
}

export interface StreakRecord {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_checkin_date: string;
  start_date: string;
  total_successful_days: number;
}

export interface XPTransaction {
  id: string;
  user_id: string;
  amount: number;
  source: 'daily_checkin' | 'milestone' | 'challenge' | 'recovery_complete' | 'bonus';
  description: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string; // lucide icon identifier
  tier: BadgeTier;
  milestone_days: number;
  xp_reward: number;
  is_unlocked: boolean;
  unlocked_at?: string;
  image_type?: 'trophy' | 'shield' | 'star' | 'medal';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  duration_minutes: number;
  xp_reward: number;
  icon: string;
  is_completed: boolean;
  completed_at?: string;
  is_daily: boolean;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: MoodType;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface RecoverySession {
  id: string;
  user_id: string;
  duration_seconds: number;
  breathing_completed: boolean;
  distraction_completed: boolean;
  initial_urge_rating: number; // 1 to 10
  post_urge_rating: number; // 1 to 10
  exercise_feedback?: string;
  created_at: string;
}

export interface StoreRewardItem {
  id: string;
  title: string;
  description: string;
  category: 'theme' | 'frame' | 'sound';
  cost_xp: number;
  icon: string;
  is_purchased: boolean;
  is_equipped: boolean;
}

export type ActiveView =
  | 'landing'
  | 'dashboard'
  | 'checkin'
  | 'challenges'
  | 'achievements'
  | 'recovery'
  | 'journal'
  | 'analytics'
  | 'settings';
