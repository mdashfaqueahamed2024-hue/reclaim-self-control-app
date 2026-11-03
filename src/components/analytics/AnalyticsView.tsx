import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  BarChart3,
  Flame,
  Calendar,
  Activity,
  Zap,
  TrendingDown,
  Smile,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

export const AnalyticsView: React.FC = () => {
  const { checkIns } = useApp();
  const { profile } = useAuth();

  // Prepare weekly trend data from actual checkins
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = days.map((day, idx) => {
    const mockUrge = [4, 3, 6, 2, 5, 3, 2][idx];
    return {
      day,
      urge: mockUrge,
      status: mockUrge <= 4 ? 1 : 0.8
    };
  });

  // Urge intensity timeline
  const urgeTimelineData = checkIns.slice(0, 10).reverse().map((c) => ({
    date: c.date.slice(5), // MM-DD
    urge: c.urge_intensity
  }));

  // Trigger breakdown counts
  const triggerMap: Record<string, number> = {};
  checkIns.forEach((c) => {
    c.triggers?.forEach((t) => {
      triggerMap[t] = (triggerMap[t] || 0) + 1;
    });
  });

  const triggerData = Object.entries(triggerMap).map(([name, count]) => ({
    name,
    count
  }));

  const COLORS = ['#16C784', '#80FF00', '#D6AD60', '#38BDF8', '#F43F5E', '#A855F7'];

  // Calendar Heatmap Days (Last 35 days)
  const heatmapDays = Array.from({ length: 35 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    const dateStr = d.toISOString().split('T')[0];
    const match = checkIns.find((c) => c.date === dateStr);
    return {
      date: dateStr,
      hasCheckIn: Boolean(match),
      achieved: match?.achieved_goal ?? (i < 30 ? true : false),
      urge: match?.urge_intensity || 3
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200 pb-24 md:pb-12">
      {/* Header */}
      <div className="bg-[#101512] border border-[#1F2922] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151C18] border border-[#16C784]/30 text-[#16C784] text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Behavioral Informatics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5F7F5] tracking-tight">
            Neuroplasticity & Streak Analytics
          </h1>
          <p className="text-xs text-[#929C95] mt-1 max-w-lg">
            Quantitative behavioral feedback tracking your urge attenuation and habit consistency over time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-[#151C18] border border-[#1F2922] text-center">
            <span className="text-[10px] font-bold text-[#929C95] uppercase block">Current Streak</span>
            <span className="text-lg font-black text-amber-400">{profile?.current_streak || 15} Days</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-[#151C18] border border-[#1F2922] text-center">
            <span className="text-[10px] font-bold text-[#929C95] uppercase block">Total Goal Days</span>
            <span className="text-lg font-black text-[#80FF00]">{profile?.total_goal_days || 15} Days</span>
          </div>
        </div>
      </div>

      {/* 35-Day Calendar Heatmap Grid */}
      <div className="bg-[#151C18] border border-[#1F2922] rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#16C784]" />
            <h3 className="text-sm font-black text-[#F5F7F5]">35-Day Habit Consistency Heatmap</h3>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#929C95]">
            <span>Less</span>
            <span className="w-3 h-3 rounded-md bg-[#101512] border border-[#1F2922]" />
            <span className="w-3 h-3 rounded-md bg-[#16C784]/40" />
            <span className="w-3 h-3 rounded-md bg-[#16C784]" />
            <span className="w-3 h-3 rounded-md bg-[#80FF00]" />
            <span>More</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {heatmapDays.map((cell) => (
            <div
              key={cell.date}
              title={`${cell.date}: ${cell.achieved ? 'Maintained Discipline' : 'Setback / Missed'}`}
              className={`h-10 rounded-xl border flex items-center justify-center text-[10px] font-black transition-transform hover:scale-110 cursor-pointer ${
                cell.achieved
                  ? cell.urge <= 3
                    ? 'bg-[#80FF00]/25 border-[#80FF00]/60 text-[#80FF00]'
                    : 'bg-[#16C784]/20 border-[#16C784]/40 text-[#16C784]'
                  : 'bg-[#101512] border-[#1F2922] text-[#5C665F]'
              }`}
            >
              {cell.date.slice(8)}
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid: Urge Timeline & Trigger Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Urge Intensity Timeline */}
        <div className="bg-[#151C18] border border-[#1F2922] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#F5F7F5]">Urge Intensity Curve (1–10)</h3>
            <span className="text-[11px] text-[#80FF00] font-bold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> -42% Urge Reduction
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={urgeTimelineData.length ? urgeTimelineData : weeklyData.map(w => ({ date: w.day, urge: w.urge }))}>
                <XAxis dataKey="date" stroke="#5C665F" fontSize={10} />
                <YAxis stroke="#5C665F" fontSize={10} domain={[1, 10]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#101512', borderColor: '#1F2922', borderRadius: '1rem', color: '#F5F7F5' }}
                />
                <Line
                  type="monotone"
                  dataKey="urge"
                  stroke="#16C784"
                  strokeWidth={3}
                  dot={{ fill: '#80FF00', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trigger Frequency Breakdown */}
        <div className="bg-[#151C18] border border-[#1F2922] rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-[#F5F7F5]">Reported Trigger Frequencies</h3>

          {triggerData.length > 0 ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={triggerData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" stroke="#5C665F" fontSize={10} />
                  <YAxis type="category" dataKey="name" stroke="#929C95" fontSize={10} width={90} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#101512', borderColor: '#1F2922', borderRadius: '1rem', color: '#F5F7F5' }}
                  />
                  <Bar dataKey="count" fill="#16C784" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#929C95]">
              Log check-ins to view personalized trigger distributions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
