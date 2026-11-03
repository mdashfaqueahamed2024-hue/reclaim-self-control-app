import { Achievement, Challenge, StoreRewardItem } from '@/types';

export const LEVEL_DEFINITIONS = [
  { level: 1, name: 'Beginner', minXp: 0, maxXp: 99, color: 'text-emerald-400', badge: '🌱' },
  { level: 2, name: 'Focused', minXp: 100, maxXp: 299, color: 'text-teal-400', badge: '🎯' },
  { level: 3, name: 'Disciplined', minXp: 300, maxXp: 699, color: 'text-cyan-400', badge: '⚡' },
  { level: 4, name: 'Determined', minXp: 700, maxXp: 1499, color: 'text-amber-400', badge: '🛡️' },
  { level: 5, name: 'Resilient', minXp: 1500, maxXp: 2999, color: 'text-rose-400', badge: '🔥' },
  { level: 6, name: 'Mastery', minXp: 3000, maxXp: 999999, color: 'text-yellow-400', badge: '👑' }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    tagline: 'The Journey Begins',
    description: 'Completed your very first successful goal check-in.',
    icon: 'Footprints',
    tier: 'bronze',
    milestone_days: 1,
    xp_reward: 20,
    is_unlocked: true,
    unlocked_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    image_type: 'shield'
  },
  {
    id: 'three-day-momentum',
    title: 'Three-Day Momentum',
    tagline: 'Building the Spark',
    description: 'Maintained 3 consecutive days of discipline and self-control.',
    icon: 'Zap',
    tier: 'bronze',
    milestone_days: 3,
    xp_reward: 40,
    is_unlocked: true,
    unlocked_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    image_type: 'medal'
  },
  {
    id: 'one-week-strong',
    title: 'One Week Strong',
    tagline: 'Habit Formation',
    description: 'Conquered 7 days straight without succumbing to urges.',
    icon: 'Shield',
    tier: 'silver',
    milestone_days: 7,
    xp_reward: 100,
    is_unlocked: true,
    unlocked_at: new Date(Date.now() - 86400000).toISOString(),
    image_type: 'shield'
  },
  {
    id: 'two-weeks-progress',
    title: 'Two Weeks of Progress',
    tagline: 'Mental Clarity',
    description: '14 consecutive days of active impulse regulation.',
    icon: 'Flame',
    tier: 'silver',
    milestone_days: 14,
    xp_reward: 150,
    is_unlocked: false,
    image_type: 'trophy'
  },
  {
    id: 'one-month-milestone',
    title: 'One Month Milestone',
    tagline: 'Rewiring the Brain',
    description: '30 full days of unwavering resolve and commitment.',
    icon: 'Trophy',
    tier: 'gold',
    milestone_days: 30,
    xp_reward: 300,
    is_unlocked: false,
    image_type: 'trophy'
  },
  {
    id: 'sixty-day-resilience',
    title: 'Sixty-Day Resilience',
    tagline: 'Iron Discipline',
    description: '60 days of self-command, healthy coping, and high energy.',
    icon: 'Award',
    tier: 'platinum',
    milestone_days: 60,
    xp_reward: 500,
    is_unlocked: false,
    image_type: 'medal'
  },
  {
    id: 'ninety-day-mastery',
    title: 'Ninety-Day Mastery',
    tagline: 'Total Transformation',
    description: 'The golden 90-day neurological reset. You have reclaimed your mind.',
    icon: 'Crown',
    tier: 'diamond',
    milestone_days: 90,
    xp_reward: 1000,
    is_unlocked: false,
    image_type: 'trophy'
  },
  {
    id: 'century-legend',
    title: 'Century Legend (100 Days)',
    tagline: 'Master of Self',
    description: 'Triple digits of pure focus, discipline, and unstoppable grit.',
    icon: 'Sparkles',
    tier: 'diamond',
    milestone_days: 100,
    xp_reward: 1500,
    is_unlocked: false,
    image_type: 'trophy'
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'walk-15',
    title: '15-Minute Outdoor Walk',
    description: 'Step away from all screens, breathe fresh air, and reset dopamine receptors.',
    category: 'physical',
    duration_minutes: 15,
    xp_reward: 30,
    icon: 'Compass',
    is_completed: false,
    is_daily: true
  },
  {
    id: 'read-20',
    title: 'Read 20 Minutes of a Book',
    description: 'Engage in deep, sustained focus without instant gratification.',
    category: 'productivity',
    duration_minutes: 20,
    xp_reward: 25,
    icon: 'BookOpen',
    is_completed: false,
    is_daily: true
  },
  {
    id: 'detox-60',
    title: '60-Minute Digital Detox',
    description: 'Put your phone in another room for one full uninterrupted hour.',
    category: 'digital-detox',
    duration_minutes: 60,
    xp_reward: 40,
    icon: 'SmartphoneOff',
    is_completed: false,
    is_daily: true
  },
  {
    id: 'breathe-5',
    title: '5-Minute Mindful Breathing',
    description: 'Practice 4-7-8 breathing or box breathing when an urge appears.',
    category: 'mindfulness',
    duration_minutes: 5,
    xp_reward: 20,
    icon: 'Wind',
    is_completed: false,
    is_daily: true
  },
  {
    id: 'cold-splash',
    title: 'Cold Water Facial Reset',
    description: 'Activate your mammalian dive reflex with 30 seconds of cold water on the face.',
    category: 'mental-strength',
    duration_minutes: 2,
    xp_reward: 20,
    icon: 'Droplet',
    is_completed: false,
    is_daily: true
  },
  {
    id: 'night-protocol',
    title: 'No Phone in Bed Tonight',
    description: 'Keep your phone across the room before turning the lights off.',
    category: 'digital-detox',
    duration_minutes: 480,
    xp_reward: 45,
    icon: 'Moon',
    is_completed: false,
    is_daily: false
  }
];

export const INITIAL_STORE_ITEMS: StoreRewardItem[] = [
  {
    id: 'theme-pure-black',
    title: 'OLED Pure Black Theme',
    description: 'Ultra high-contrast true black background designed for AMOLED screens.',
    category: 'theme',
    cost_xp: 150,
    icon: 'Palette',
    is_purchased: true,
    is_equipped: false
  },
  {
    id: 'theme-midnight-gold',
    title: 'Midnight Gold Prestige Theme',
    description: 'Warm gold ambient lighting and golden metallic card highlights.',
    category: 'theme',
    cost_xp: 350,
    icon: 'Sparkles',
    is_purchased: false,
    is_equipped: false
  },
  {
    id: 'frame-phoenix',
    title: 'Phoenix Rebirth Avatar Frame',
    description: 'Animated flame-embossed avatar border symbolizing renewed strength.',
    category: 'frame',
    cost_xp: 250,
    icon: 'Flame',
    is_purchased: false,
    is_equipped: false
  },
  {
    id: 'frame-titan',
    title: 'Titanium Shield Avatar Frame',
    description: 'Hardened metallic border signifying unshakeable impulse control.',
    category: 'frame',
    cost_xp: 500,
    icon: 'Shield',
    is_purchased: false,
    is_equipped: false
  }
];

export const MOTIVATIONAL_AFFIRMATIONS = [
  "You are not fighting your desires; you are simply choosing a greater destiny.",
  "Every time you let an urge pass without acting, you physically strengthen your prefrontal cortex.",
  "Discipline is choosing between what you want now and what you want most.",
  "A single moment of impulse is not worth trading for hours of self-respect.",
  "You don't need to be perfect; you just need to be present and choose strength today.",
  "Your mind belongs to you. No craving can force your hand without your permission.",
  "Comfort is the enemy of progress. Embrace the mild friction of growth."
];
