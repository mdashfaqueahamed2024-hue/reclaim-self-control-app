import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Shield,
  Zap,
  Award,
  HeartPulse,
  Brain,
  Lock,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Clock,
  EyeOff,
  Activity
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

export const LandingPage: React.FC = () => {
  const { setActiveView, setShowAuthModal, setAuthMode, triggerCelebration } = useApp();
  const { user } = useAuth();

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [previewDays, setPreviewDays] = useState(30);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleStartJourney = () => {
    triggerCelebration();
    setActiveView('dashboard');
  };

  const FAQS = [
    {
      q: 'Why does RECLAIM emphasize a "zero-shame" methodology?',
      a: 'Modern behavioral neuroscience proves that guilt and shame trigger severe cortisol spikes. Cortisol diminishes the prefrontal cortex\'s executive decision-making power, triggering the very impulsive loops people try to escape. RECLAIM treats setbacks as clinical data points to study triggers and build sustainable neural control.'
    },
    {
      q: 'Is my personal habit and journal data strictly private?',
      a: 'Yes, 100%. RECLAIM utilizes end-to-end encrypted local client storage with optional Supabase Row-Level Security (RLS). Your reflections, streak logs, and urge records are never tracked, sold, or surfaced to third parties.'
    },
    {
      q: 'What is Urge Surfing and how does the SOS tool work?',
      a: 'Pioneered by clinical psychologist Dr. Alan Marlatt, urge surfing views cravings like ocean waves that naturally crest within 3 to 10 minutes and subside. The RECLAIM Emergency SOS module guides you through paced 4-7-8 autonomic breathing and cognitive grounding exercises to surf the wave safely.'
    },
    {
      q: 'Can I use this completely free without an account?',
      a: 'Yes. You can explore all modules, track streaks, journal, and run emergency urge-surfing immediately in demo/offline mode. You can optionally link an account to sync across devices.'
    }
  ];

  return (
    <div className="min-h-screen text-zinc-100 space-y-24 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-[#80FF00]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 relative z-10">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>The Science-Backed Self-Control Engine</span>
          </motion.div>

          {/* Master Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Your Mind.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#80FF00] to-emerald-500">
              Your Rules.
            </span>{' '}
            <br className="hidden sm:inline" />
            Your Journey.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed"
          >
            Take control of compulsive urges, rewire dopamine pathways, and forge unbreakable self-discipline. Built on neuroplasticity, zero-shame accountability, and real-time urge management.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={handleStartJourney}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-base bg-gradient-to-r from-emerald-400 to-[#80FF00] hover:from-emerald-300 hover:to-[#70ea00] text-zinc-950 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Begin Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('methodology');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl font-bold text-base bg-[#141b16] hover:bg-[#1a231d] border border-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Brain className="w-5 h-5 text-emerald-400" />
              <span>Explore The Science</span>
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-zinc-500 font-medium"
          >
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> 100% Private & Anonymous
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Zero Shame Philosophy
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Real-time Urge SOS
            </span>
          </motion.div>
        </div>

        {/* Live Interactive Streak Simulator Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 pt-12"
        >
          <div className="bg-[#101713]/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Column: Interactive slider */}
              <div className="space-y-4 flex-1 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Activity className="w-3.5 h-3.5" />
                  Live Neuroplasticity Simulator
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Experience Your Dopamine Reset Curve
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Drag the slider to see how neurotransmitter sensitivity, mental clarity, and prefrontal control compound over time:
                </p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                    <span>Selected Milestone</span>
                    <span className="text-emerald-400 font-extrabold">{previewDays} Days Clean</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={previewDays}
                    onChange={e => setPreviewDays(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#80FF00]"
                  />
                  <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                    <span>Day 1: Acute Urge</span>
                    <span>Day 30: Reset</span>
                    <span>Day 90: Mastery</span>
                  </div>
                </div>

                {/* Outcome card */}
                <div className="p-4 rounded-xl bg-[#161e19] border border-zinc-800 text-xs space-y-1">
                  <p className="text-zinc-200 font-semibold">
                    {previewDays < 7 && 'Phase 1: Breaking the Automatic Trigger Loop'}
                    {previewDays >= 7 && previewDays < 30 && 'Phase 2: Baseline Dopamine Receptor Upregulation'}
                    {previewDays >= 30 && previewDays < 90 && 'Phase 3: Prefrontal Cortex Structural Reinforcement'}
                    {previewDays >= 90 && 'Phase 4: Complete Identity Transformation & Habit Mastery'}
                  </p>
                  <p className="text-zinc-400">
                    {previewDays < 7 && 'High urge intensity. Focus on 60-second breathing and immediate environment shifts.'}
                    {previewDays >= 7 && previewDays < 30 && 'Mental fog begins clearing. Energy spikes and motivation normalizes.'}
                    {previewDays >= 30 && previewDays < 90 && 'Urges feel like faint background noise. High self-trust and laser focus.'}
                    {previewDays >= 90 && 'Self-control is now second nature. Relapse risk drops below 5%.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Visual Preview Card */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-[#152019] to-[#0c120e] border border-emerald-500/40 w-full md:w-64 text-center space-y-4 shrink-0 shadow-lg">
                <div className="relative w-28 h-28 rounded-full border-4 border-emerald-500/20 flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-[#80FF00] border-t-transparent animate-spin-slow"
                    style={{
                      transform: `rotate(${Math.min(360, (previewDays / 100) * 360)}deg)`
                    }}
                  />
                  <div className="text-center">
                    <span className="text-3xl font-black text-white">{previewDays}</span>
                    <span className="block text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Days
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">Confidence Score</div>
                  <div className="text-emerald-400 font-extrabold text-lg">
                    {Math.min(99, 45 + Math.floor(previewDays * 0.55))}%
                  </div>
                  <p className="text-[11px] text-zinc-500">Autonomous Prefrontal Control</p>
                </div>

                <button
                  onClick={handleStartJourney}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors"
                >
                  Start This Streak
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Pillar Grid */}
      <section id="methodology" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Real-World Neural Discipline
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Every feature in RECLAIM is engineered around cognitive behavioral therapy, impulse delay intervals, and behavioral economics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-[#121814] border border-zinc-800/80 hover:border-emerald-500/40 rounded-2xl p-6 space-y-4 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              Zero-Shame Architecture
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Guilt fuels relapses. RECLAIM replaces shame with analytical self-compassion. If a slip occurs, reset without judgment and log what triggered it.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#121814] border border-zinc-800/80 hover:border-[#80FF00]/40 rounded-2xl p-6 space-y-4 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 text-[#80FF00] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-[#80FF00] transition-colors">
              Emergency Urge Surfing SOS
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              When an urge strikes, hit the red SOS button. Access guided 4-7-8 breathing rings, sensory 5-4-3-2-1 grounding, and mental focus challenges to ride the wave safely.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#121814] border border-zinc-800/80 hover:border-amber-500/40 rounded-2xl p-6 space-y-4 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              Metallic Trophies & Gamification
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Celebrate genuine neural milestones. Unlock 8 physical-style metallic badges from Bronze initiate to Diamond Sovereign, with leveling and rewards.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#121814] border border-zinc-800/80 hover:border-cyan-500/40 rounded-2xl p-6 space-y-4 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              Deep Analytics & Heatmaps
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Inspect your 35-day consistency calendar, identify your peak trigger days (like weekends or late nights), and watch urge intensity decline over weeks.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-[#121814] border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl p-6 space-y-4 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
              Private Encrypted Journal
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Write reflections on your mental state, track recurring triggers, and record personal victories. Protected securely in your private local browser vault.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-[#121814] border border-zinc-800/80 hover:border-emerald-500/40 rounded-2xl p-6 space-y-4 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              Daily & Weekly Missions
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Cold showers, evening digital curfew, 20-minute physical training, and mindfulness prompts designed to channel restless dopamine into physical vigor.
            </p>
          </div>
        </div>
      </section>

      {/* Scientific Neurobiology Overview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#121b15] via-[#0d1410] to-[#080b0a] border border-emerald-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              Behavioral Neuroscience
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              The 3 Rules of Permanent Habit Transformation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="space-y-2">
                <span className="text-emerald-400 font-mono text-sm font-bold">01. Delay & Breathe</span>
                <h4 className="text-white font-bold text-base">The 10-Minute Dopamine Curve</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Impulses feel endless, but neurochemical spikes typically plateau and decrease within 600 seconds if unrewarded by physical action.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-emerald-400 font-mono text-sm font-bold">02. Replace, Don't Suppress</span>
                <h4 className="text-white font-bold text-base">Active Channeling</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Suppressing a thought intensifies it. RECLAIM immediately offers constructive physical or mental substitutes like cold showers or breathwork.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-emerald-400 font-mono text-sm font-bold">03. Study Setbacks Scientifically</span>
                <h4 className="text-white font-bold text-base">Root-Cause Analysis</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every slip is preceded by a trigger (fatigue, late phone use, boredom). Identify the trigger, adjust your environment, and advance forward.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Frequently Answered Questions
          </h2>
          <p className="text-zinc-400 text-sm">
            Everything you need to know about RECLAIM's principles and mechanics.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-800/80 bg-[#121814] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-emerald-950/70 via-[#101913] to-emerald-950/70 border border-emerald-500/40 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Reclaim Your Focus?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base">
              Join thousands rebuilding discipline, clarity, and self-confidence one intentional day at a time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartJourney}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-emerald-400 to-[#80FF00] hover:from-emerald-300 hover:to-[#70ea00] text-zinc-950 shadow-xl shadow-emerald-500/25 active:scale-95 transition-all"
            >
              Open Live Dashboard
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-sm bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white transition-colors"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-[10px]">
            R
          </div>
          <span className="font-bold text-zinc-400">RECLAIM</span>
          <span>• Take Control. Rebuild Discipline. Become Stronger.</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Private Client Storage</span>
          <span>•</span>
          <span>Zero Telemetry</span>
          <span>•</span>
          <span className="text-emerald-400 font-mono">v1.0.0 Production</span>
        </div>
      </footer>
    </div>
  );
};
