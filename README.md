# RECLAIM — Private Habit Management & Self-Control Platform

> **Take Control. Rebuild Discipline. Become Stronger.**

RECLAIM is a premium, privacy-first web application designed to help individuals overcome compulsive masturbation and digital dopamine habits, rebuild focus, and forge long-term self-discipline. Built around behavioral neuroscience, impulse delay protocols, and positive reinforcement.

---

## 🌟 Philosophy & Principles

- **Zero-Shame Accountability**: Guilt and shame trigger cortisol spikes that degrade prefrontal cortex function, worsening relapse cycles. RECLAIM views setbacks as clinical data points to study triggers and build resilience.
- **Urge Surfing & Delay Intervals**: Cravings operate like ocean waves that crest within 3–10 minutes. The emergency SOS module guides users through 4-7-8 autonomic breathing and cognitive grounding to surf the impulse safely.
- **Physical-Feel Gamification**: Celebrate real neurological adaptation. Earn XP, level up across 6 mastery tiers, and unlock 8 metallic trophy badges (Bronze, Silver, Gold, Platinum, Diamond).
- **100% Privacy by Default**: Local client encrypted vault by default with optional Supabase Cloud sync and Row-Level Security (RLS). No third-party ad tracking or invasive telemetry.

---

## 🚀 Key Features

| Module | Features & Capabilities |
| :--- | :--- |
| **Landing Page** | Cinematic hero, live dopamine reset simulator slider, methodology breakdown, interactive streak calculator, neurobiology pillars, and FAQ. |
| **Dashboard** | Circular streak counter, 78% lime progress bar, daily quote, AI mindset companion card, quick action tiles, and live daily habits checklist. |
| **Daily Check-in** | 6-factor accountability modal: Goal achievement toggle, 1–10 urge intensity slider, mood picker, trigger identification, coping strategy selection, and reflection notes (+25 XP). |
| **Urge Surfing SOS** | Guided 60-second expanding breathing rings (4-7-8 rhythm), 5-minute timer, 5-4-3-2-1 sensory grounding, mental math challenges, and pre/post urge reassessment (+30 XP). |
| **Trophy Vault & Store** | 8 metallic badge shields with ribbon headers, level progression bar, points balance, and in-app unlockable rewards (themes, avatar crests, soundscapes). |
| **Private Journal** | Encrypted self-reflection vault, keyword search, mood filters, tag support (#triggers, #breakthrough), and inline editor (+15 XP). |
| **Analytics & Heatmap** | 35-day consistency calendar heatmap, 1–10 urge intensity curve, trigger frequency charts, and relapse risk analysis. |
| **Account & Settings** | Custom avatar crests, display name, personal North Star goal, daily reminder time, theme switcher, and 1-click JSON data export. |

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Custom CSS Animations, Dark Cinematic Theme (`#080B0A`, `#101512`, `#16C784`, `#80FF00`, `#D6AD60`)
- **Animations & Effects**: Framer Motion, Canvas Confetti
- **Icons**: Lucide React
- **Data Visualization**: Recharts (Heatmap, Line charts, Bar charts)
- **Backend & Database**: Supabase (Auth, PostgreSQL, Row Level Security) + Resilient Offline Local Storage Fallback
- **Hosting & CI/CD**: Vercel + GitHub Actions

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/mdashfaqueahamed2024-hue/reclaim-self-control-app.git

# Navigate into project directory
cd reclaim-self-control-app

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🗄️ Database Setup (Supabase)

If you wish to enable cloud synchronization:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in the Supabase Dashboard.
3. Run the SQL script found in `supabase/migrations/20261103_reclaim_schema.sql`.
4. Add your project credentials to a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

*Note: If no Supabase credentials are provided, RECLAIM automatically runs in resilient offline mode with 100% full local functionality.*

---

## 🚢 Production Build

```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

MIT © RECLAIM Platform. Built for personal empowerment and self-mastery.
