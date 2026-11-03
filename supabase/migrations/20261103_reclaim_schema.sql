-- =========================================================================
-- RECLAIM SELF-CONTROL & HABIT REWIRING PLATFORM — SUPABASE POSTGRESQL SCHEMA
-- Migration: 20261103_reclaim_schema.sql
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  avatar_index INT DEFAULT 1,
  personal_goal TEXT DEFAULT 'Mastering impulse control and building unshakeable mental clarity',
  timezone TEXT DEFAULT 'UTC',
  daily_reminder_time TIME DEFAULT '20:00:00',
  notifications_enabled BOOLEAN DEFAULT true,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_goal_days INT DEFAULT 0,
  total_xp INT DEFAULT 0,
  level INT DEFAULT 1,
  points_balance INT DEFAULT 0,
  theme_preference TEXT DEFAULT 'dark-emerald',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER GOALS TABLE
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  goal_title TEXT NOT NULL,
  target_days INT DEFAULT 90,
  start_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DAILY CHECK-INS TABLE
CREATE TABLE IF NOT EXISTS public.daily_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  achieved_goal BOOLEAN NOT NULL,
  urge_intensity INT CHECK (urge_intensity BETWEEN 1 AND 10),
  mood TEXT NOT NULL,
  triggers TEXT[] DEFAULT '{}',
  coping_strategies TEXT[] DEFAULT '{}',
  accomplishments TEXT,
  journal_notes TEXT,
  xp_earned INT DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_daily_checkin UNIQUE (user_id, date)
);

-- 4. STREAK RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.streak_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_checkin_date DATE,
  start_date DATE DEFAULT CURRENT_DATE,
  total_successful_days INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. XP TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount INT NOT NULL,
  source TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ACHIEVEMENTS CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  milestone_days INT NOT NULL,
  xp_reward INT NOT NULL,
  image_type TEXT DEFAULT 'trophy'
);

-- 7. USER ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

-- 8. CHALLENGES CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  duration_minutes INT DEFAULT 15,
  xp_reward INT DEFAULT 25,
  icon TEXT NOT NULL,
  is_daily BOOLEAN DEFAULT true
);

-- 9. CHALLENGE COMPLETIONS TABLE
CREATE TABLE IF NOT EXISTS public.challenge_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id TEXT REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  completed_date DATE DEFAULT CURRENT_DATE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_daily_challenge_user UNIQUE (user_id, challenge_id, completed_date)
);

-- 10. PRIVATE JOURNAL TABLE
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  mood TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. RECOVERY SESSIONS (EMERGENCY MODE) TABLE
CREATE TABLE IF NOT EXISTS public.recovery_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  duration_seconds INT DEFAULT 60,
  breathing_completed BOOLEAN DEFAULT true,
  distraction_completed BOOLEAN DEFAULT false,
  initial_urge_rating INT CHECK (initial_urge_rating BETWEEN 1 AND 10),
  post_urge_rating INT CHECK (post_urge_rating BETWEEN 1 AND 10),
  exercise_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  daily_reminder BOOLEAN DEFAULT true,
  milestone_alerts BOOLEAN DEFAULT true,
  streak_freeze_reminder BOOLEAN DEFAULT true,
  motivational_quotes BOOLEAN DEFAULT true
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read and update their own profile
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Daily Checkins: Private to owner
CREATE POLICY "Users view own checkins" ON public.daily_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own checkins" ON public.daily_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own checkins" ON public.daily_checkins FOR UPDATE USING (auth.uid() = user_id);

-- Journal Entries: Strict owner isolation
CREATE POLICY "Users view own journal" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own journal" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own journal" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own journal" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Recovery Sessions: Strict owner isolation
CREATE POLICY "Users view own recovery" ON public.recovery_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own recovery" ON public.recovery_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Streak Records & XP: Strict owner isolation
CREATE POLICY "Users view own streaks" ON public.streak_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own streaks" ON public.streak_records FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users view own xp" ON public.xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own xp" ON public.xp_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own challenge completions" ON public.challenge_completions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);

-- Public Read for Catalog Data
CREATE POLICY "Achievements are public" ON public.achievements FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Challenges are public" ON public.challenges FOR SELECT TO authenticated, anon USING (true);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON public.daily_checkins(user_id, date);
CREATE INDEX IF NOT EXISTS idx_journal_user_date ON public.journal_entries(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_xp_user ON public.xp_transactions(user_id);
