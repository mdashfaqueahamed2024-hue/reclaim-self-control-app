import React, { useState, useEffect } from 'react';
import {
  X,
  LifeBuoy,
  Wind,
  Clock,
  CheckCircle2,
  Brain,
  Droplet,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

type Mode = 'menu' | 'breathing' | 'timer' | 'grounding' | 'math' | 'feedback';

export const EmergencyRecoveryModal: React.FC = () => {
  const { showEmergencyModal, setShowEmergencyModal, saveRecoverySession, triggerCelebration } = useApp();

  const [mode, setMode] = useState<Mode>('breathing');
  const [initialUrge, setInitialUrge] = useState<number>(8);
  const [postUrge, setPostUrge] = useState<number>(3);

  // 60-Second Breathing State
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState<number>(60);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(true);

  // 5-Minute Urge Surfing Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(300);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  // Quick Math Distraction State
  const [mathA, setMathA] = useState(17);
  const [mathB, setMathB] = useState(24);
  const [userMathAns, setUserMathAns] = useState('');
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);

  // Breathing timer tick
  useEffect(() => {
    let interval: any = null;
    if (showEmergencyModal && mode === 'breathing' && isBreathingActive && breathSeconds > 0) {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          const next = prev - 1;
          const cycle = (60 - next) % 12;
          if (cycle < 4) setBreathPhase('Inhale');
          else if (cycle < 8) setBreathPhase('Hold');
          else setBreathPhase('Exhale');

          if (next <= 0) {
            setIsBreathingActive(false);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showEmergencyModal, mode, isBreathingActive, breathSeconds]);

  // 5-minute urge timer tick
  useEffect(() => {
    let interval: any = null;
    if (showEmergencyModal && mode === 'timer' && isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showEmergencyModal, mode, isTimerActive, timerSeconds]);

  if (!showEmergencyModal) return null;

  const handleFinishProtocol = () => {
    saveRecoverySession({
      duration_seconds: 60 - breathSeconds,
      breathing_completed: breathSeconds <= 10,
      distraction_completed: mode === 'math' || mode === 'grounding',
      initial_urge_rating: initialUrge,
      post_urge_rating: postUrge,
      exercise_feedback: 'Completed emergency reset protocol'
    });
    triggerCelebration();
    setShowEmergencyModal(false);
    setMode('breathing');
    setBreathSeconds(60);
  };

  const handleCheckMath = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userMathAns) === mathA + mathB) {
      setMathFeedback('Correct! Prefrontal cortex fully activated.');
      setUserMathAns('');
      setMathA(Math.floor(Math.random() * 40) + 15);
      setMathB(Math.floor(Math.random() * 40) + 15);
    } else {
      setMathFeedback('Not quite. Try again — let your logical brain take over.');
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080B0A]/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#101512] border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/40 text-left my-6">
        {/* Close Button */}
        <button
          onClick={() => setShowEmergencyModal(false)}
          className="absolute top-5 right-5 text-[#929C95] hover:text-[#F5F7F5] p-2 rounded-xl hover:bg-[#151C18] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 p-0.5 shadow-lg shadow-rose-500/25 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-[#080B0A] flex items-center justify-center">
              <LifeBuoy className="w-6 h-6 text-rose-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#F5F7F5] tracking-tight">Emergency Urge Protocol</h2>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <p className="text-xs text-[#929C95]">Take a deep breath. You are in safe, non-judgmental space.</p>
          </div>
        </div>

        {/* Protocol Mode Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#151C18] border border-[#1F2922] mb-6 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setMode('breathing')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              mode === 'breathing' ? 'bg-[#101512] text-[#16C784] border border-[#16C784]/30 shadow-sm' : 'text-[#929C95]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>60s Breathing</span>
          </button>

          <button
            onClick={() => setMode('grounding')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              mode === 'grounding' ? 'bg-[#101512] text-[#16C784] border border-[#16C784]/30 shadow-sm' : 'text-[#929C95]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>5-4-3-2-1</span>
          </button>

          <button
            onClick={() => setMode('math')}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              mode === 'math' ? 'bg-[#101512] text-[#16C784] border border-[#16C784]/30 shadow-sm' : 'text-[#929C95]'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Mental Focus</span>
          </button>

          <button
            onClick={() => {
              setMode('timer');
              setIsTimerActive(true);
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              mode === 'timer' ? 'bg-[#101512] text-[#16C784] border border-[#16C784]/30 shadow-sm' : 'text-[#929C95]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Urge Surf (5m)</span>
          </button>
        </div>

        {/* MODE 1: 60-Second Guided Breathing Exercise */}
        {mode === 'breathing' && (
          <div className="text-center py-4 space-y-6">
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              {/* Concentric Breathing Waves */}
              <div
                className={`absolute inset-0 rounded-full border border-[#16C784]/30 transition-all duration-1000 ${
                  breathPhase === 'Inhale' ? 'scale-125 opacity-100 bg-[#16C784]/10' : breathPhase === 'Hold' ? 'scale-125 opacity-70 bg-[#16C784]/15' : 'scale-90 opacity-40 bg-transparent'
                }`}
              />
              <div
                className={`absolute inset-4 rounded-full border border-[#16C784]/50 transition-all duration-700 ${
                  breathPhase === 'Inhale' ? 'scale-110 opacity-100' : 'scale-95 opacity-50'
                }`}
              />
              {/* Center Circle */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-[#16C784] to-[#101512] p-0.5 shadow-2xl shadow-[#16C784]/30 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#080B0A] flex flex-col items-center justify-center">
                  <span className="text-sm font-black text-[#16C784] uppercase tracking-wider">{breathPhase}</span>
                  <span className="text-2xl font-black text-[#F5F7F5]">{breathSeconds}s</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-[#F5F7F5] font-bold">
                {breathPhase === 'Inhale' && 'Slowly breathe in deep through your nose (4 seconds)'}
                {breathPhase === 'Hold' && 'Hold your breath gently. Relax your shoulders (4 seconds)'}
                {breathPhase === 'Exhale' && 'Exhale slowly through your mouth, releasing tension (4 seconds)'}
              </p>
              <p className="text-[11px] text-[#929C95]">
                Neuroscience fact: Deep slow exhalations activate your vagus nerve and downregulate the amygdala craving loop.
              </p>
            </div>

            <button
              onClick={() => setMode('feedback')}
              className="w-full py-3 rounded-2xl bg-[#16C784] hover:bg-[#14b677] text-slate-950 font-black text-xs tracking-wide shadow-lg shadow-[#16C784]/20 transition-all"
            >
              Breathing Done — Check Urge Level
            </button>
          </div>
        )}

        {/* MODE 2: 5-4-3-2-1 Sensory Grounding */}
        {mode === 'grounding' && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-[#929C95]">
              Pull attention away from cravings back into physical reality by observing your environment:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#151C18] border border-[#1F2922] flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0">5</span>
                <span>Identify <strong>5 things you can see</strong> right now (a window, a shadow, a book, your shoes).</span>
              </div>
              <div className="p-3 rounded-xl bg-[#151C18] border border-[#1F2922] flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 font-black flex items-center justify-center shrink-0">4</span>
                <span>Touch <strong>4 physical surfaces</strong> (the desk, your clothing, the wall, the floor).</span>
              </div>
              <div className="p-3 rounded-xl bg-[#151C18] border border-[#1F2922] flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-black flex items-center justify-center shrink-0">3</span>
                <span>Listen for <strong>3 distinct sounds</strong> (traffic, a fan, birds, your breath).</span>
              </div>
              <div className="p-3 rounded-xl bg-[#151C18] border border-[#1F2922] flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0">2</span>
                <span>Identify <strong>2 scents</strong> around you or smell fresh air.</span>
              </div>
              <div className="p-3 rounded-xl bg-[#151C18] border border-[#1F2922] flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 font-black flex items-center justify-center shrink-0">1</span>
                <span>Take <strong>1 sip of cool water</strong> and feel it traveling down.</span>
              </div>
            </div>

            <button
              onClick={() => setMode('feedback')}
              className="w-full py-3 rounded-2xl bg-[#16C784] text-slate-950 font-black text-xs transition-all"
            >
              Grounding Completed
            </button>
          </div>
        )}

        {/* MODE 3: Mental Focus / Quick Math Challenge */}
        {mode === 'math' && (
          <div className="py-4 space-y-4 text-center">
            <p className="text-xs text-[#929C95]">
              Cravings arise from the emotional brain. Force cognitive switching by engaging working memory:
            </p>
            <div className="p-6 rounded-2xl bg-[#151C18] border border-[#1F2922]">
              <span className="text-3xl font-black text-[#F5F7F5] tracking-widest">
                {mathA} + {mathB} = ?
              </span>
            </div>

            <form onSubmit={handleCheckMath} className="flex gap-2">
              <input
                type="number"
                value={userMathAns}
                onChange={(e) => setUserMathAns(e.target.value)}
                placeholder="Enter sum..."
                autoFocus
                className="flex-1 bg-[#151C18] border border-[#1F2922] rounded-xl px-4 py-2.5 text-center text-sm font-bold text-[#F5F7F5] outline-none focus:border-[#16C784]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#16C784] text-slate-950 font-bold text-xs"
              >
                Submit
              </button>
            </form>

            {mathFeedback && (
              <p className="text-xs font-semibold text-[#80FF00] bg-[#151C18] p-2.5 rounded-xl border border-[#1F2922]">
                {mathFeedback}
              </p>
            )}

            <button
              onClick={() => setMode('feedback')}
              className="w-full py-3 rounded-2xl bg-[#151C18] border border-[#1F2922] hover:border-[#16C784] text-[#F5F7F5] font-bold text-xs"
            >
              Check Urge Level Now
            </button>
          </div>
        )}

        {/* MODE 4: 5-Minute Urge Surfing Timer */}
        {mode === 'timer' && (
          <div className="text-center py-6 space-y-5">
            <div className="w-36 h-36 rounded-full border-4 border-[#16C784]/30 border-t-[#16C784] mx-auto flex items-center justify-center animate-spin-slow">
              <span className="text-3xl font-black text-[#F5F7F5]">{formatTimer(timerSeconds)}</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-[#F5F7F5] font-bold">Urge Surfing in Progress</p>
              <p className="text-[11px] text-[#929C95] max-w-sm mx-auto">
                Neurochemical research proves that a biological urge peaks at ~3 minutes and naturally declines. Surf the wave without judging it.
              </p>
            </div>
            <button
              onClick={() => setMode('feedback')}
              className="w-full py-3 rounded-2xl bg-[#16C784] text-slate-950 font-black text-xs"
            >
              Wave Has Passed — Record Status
            </button>
          </div>
        )}

        {/* MODE 5: Feedback & Post Urge Reassessment */}
        {mode === 'feedback' && (
          <div className="space-y-5 py-2">
            <div className="p-4 rounded-2xl bg-[#151C18] border border-[#1F2922] space-y-3">
              <label className="text-xs font-bold text-[#F5F7F5] block">
                How strong does the urge feel right now?
              </label>
              <div className="flex items-center justify-between text-xs font-black text-[#80FF00]">
                <span>Rate: {postUrge} / 10</span>
                <span>{postUrge <= 3 ? '✅ Calmed & Disarmed' : postUrge <= 6 ? '⚡ Reduced' : '🔥 Still Active'}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={postUrge}
                onChange={(e) => setPostUrge(Number(e.target.value))}
                className="w-full h-2 bg-[#101512] rounded-lg appearance-none cursor-pointer accent-[#16C784]"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You chose control over impulse.</span>
              </p>
              <p className="text-[11px] text-emerald-300/80">
                You successfully resisted immediate gratification and gave your brain a chance to self-regulate. Every repetition creates a stronger pathway.
              </p>
            </div>

            <button
              onClick={handleFinishProtocol}
              className="w-full py-3.5 rounded-2xl bg-[#80FF00] hover:bg-[#72e600] text-slate-950 font-black text-xs tracking-wide shadow-xl shadow-[#80FF00]/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete Emergency Protocol (+20 XP)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
