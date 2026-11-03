import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  Smile,
  Trash2,
  Edit3,
  Lock,
  Tag,
  Save,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { JournalEntry, MoodType } from '@/types';

const MOOD_OPTIONS: { id: MoodType; label: string; emoji: string; color: string }[] = [
  { id: 'focused', label: 'Focused', emoji: '🎯', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'calm', label: 'Calm', emoji: '🌿', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { id: 'happy', label: 'Energized', emoji: '⚡', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'stressed', label: 'Stressed', emoji: '🌊', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
  { id: 'anxious', label: 'Restless', emoji: '🌪️', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { id: 'tired', label: 'Fatigued', emoji: '🌙', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { id: 'unmotivated', label: 'Low Mood', emoji: '🌧️', color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30' }
];

export const JournalView: React.FC = () => {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry, triggerCelebration } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [isComposing, setIsComposing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('focused');
  const [tagsInput, setTagsInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('focused');
    setTagsInput('');
    setIsComposing(false);
    setEditingId(null);
  };

  const handleStartEdit = (entry: JournalEntry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setTagsInput(entry.tags.join(', '));
    setEditingId(entry.id);
    setIsComposing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    if (editingId) {
      updateJournalEntry(editingId, {
        title: title.trim(),
        content: content.trim(),
        mood,
        tags: parsedTags
      });
    } else {
      addJournalEntry({
        title: title.trim(),
        content: content.trim(),
        mood,
        tags: parsedTags.length > 0 ? parsedTags : ['mindset', 'self-discipline']
      });
      triggerCelebration();
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      resetForm();
    }, 900);
  };

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMood = selectedMoodFilter === 'all' || entry.mood === selectedMoodFilter;

    return matchesSearch && matchesMood;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-zinc-950 via-[#101713] to-zinc-950 border border-emerald-500/20 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
              <Lock className="w-3.5 h-3.5" />
              Private & Encrypted Local Vault
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Mindset & Trigger Journal
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl">
              Articulating your triggers neutralizes their emotional pull. Track cognitive shifts, inspect patterns, and solidify new neural pathways.
            </p>
          </div>

          <button
            onClick={() => {
              if (isComposing) {
                resetForm();
              } else {
                setIsComposing(true);
              }
            }}
            className="self-start md:self-auto flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            {isComposing ? (
              <>
                <X className="w-4 h-4" />
                Close Editor
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                New Reflection
              </>
            )}
          </button>
        </div>
      </div>

      {/* Composing / Editing Panel */}
      <AnimatePresence>
        {isComposing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSaveEntry}
              className="bg-[#121814] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5 text-white font-bold text-lg">
                  <Edit3 className="w-5 h-5 text-emerald-400" />
                  {editingId ? 'Edit Reflection' : 'New Cognitive Reflection'}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/60 px-3 py-1 rounded-full border border-zinc-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Zero-judgment safe zone
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                  Title or Core Theme
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Urge surfing during late-night downtime"
                  required
                  className="w-full bg-[#161e19] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Mood Selector */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                  Current Mental State
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {MOOD_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMood(opt.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        mood === opt.id
                          ? opt.color + ' ring-2 ring-emerald-500/50 shadow-md scale-105'
                          : 'bg-[#161e19] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xl mb-1">{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                  Reflection & Trigger Dissection
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={5}
                  placeholder="What triggered your thoughts? How did you respond? What constructive shift did you practice? (e.g., Went for a cold splash, paused for 3 deep breaths, acknowledged the wave without acting on it...)"
                  required
                  className="w-full bg-[#161e19] border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-500 text-sm leading-relaxed focus:outline-none focus:border-emerald-500 transition-colors resize-y"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-semibold text-zinc-400 tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="triggers, evening-habits, mindset, victory, cold-shower"
                  className="w-full bg-[#161e19] border border-zinc-800 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveSuccess}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-zinc-950" />
                      Saved Securely!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingId ? 'Update Reflection' : 'Save Reflection (+15 XP)'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121814] border border-zinc-800/80 rounded-2xl p-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search reflections, triggers, tags, insights..."
            className="w-full bg-[#161e19] border border-zinc-800/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
          />
        </div>

        {/* Mood filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedMoodFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedMoodFilter === 'all'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                : 'bg-[#161e19] text-zinc-400 hover:text-white'
            }`}
          >
            All States ({journalEntries.length})
          </button>
          {MOOD_OPTIONS.slice(0, 4).map(opt => {
            const count = journalEntries.filter(e => e.mood === opt.id).length;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedMoodFilter(opt.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedMoodFilter === opt.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#161e19] text-zinc-400 hover:text-white'
                }`}
              >
                <span>{opt.emoji}</span>
                <span>{opt.label}</span>
                {count > 0 && <span className="opacity-60 text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-[#121814] border border-dashed border-zinc-800 rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No reflections found</h3>
              <p className="text-zinc-400 text-sm max-w-md mx-auto">
                {searchQuery || selectedMoodFilter !== 'all'
                  ? 'No entries match your current search or mood filter. Try resetting filters.'
                  : 'Your journal is clear. Take 2 minutes to write your thoughts or note down an urge you successfully redirected.'}
              </p>
            </div>
            {!isComposing && (
              <button
                onClick={() => setIsComposing(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Write First Reflection
              </button>
            )}
          </div>
        ) : (
          filteredEntries.map(entry => {
            const moodOpt = MOOD_OPTIONS.find(m => m.id === entry.mood) || MOOD_OPTIONS[0];
            const dateDisplay = new Date(entry.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#121814] border border-zinc-800/80 hover:border-emerald-500/30 rounded-2xl p-6 transition-all duration-200 group shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/60">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${moodOpt.color}`}
                    >
                      <span>{moodOpt.emoji}</span>
                      <span>{moodOpt.label}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      {dateDisplay}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleStartEdit(entry)}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                      title="Edit Entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this journal reflection?')) {
                          deleteJournalEntry(entry.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-rose-500/40 text-zinc-400 hover:text-rose-400 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {entry.title}
                  </h3>
                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-4">
                    {entry.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Psychology Tip */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-[#111914] to-[#0f1411] border border-emerald-500/20 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">The Psychology of Written Self-Reflection</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            When compulsive urges spike, the brain's emotional amygdala temporarily out-powers the prefrontal cortex. Taking 3 minutes to label the trigger in writing stimulates prefrontal activity, automatically reducing the visceral urge intensity.
          </p>
        </div>
      </div>
    </div>
  );
};
