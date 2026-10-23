import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Flame, TrendingUp, PieChart, CheckCircle2, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, Theme, DayCompletion } from '../types';
import { CATEGORIES } from '../data/categories';
import { TranslationDictionary } from '../data/languages';
import { playCelebrationSound } from '../utils/audio';

interface StatisticsSectionProps {
  tasks: Task[];
  theme: Theme;
  translations: TranslationDictionary;
  soundEnabled: boolean;
  streakCount: number;
  weeklyHistory: DayCompletion[];
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  tasks,
  theme,
  translations,
  soundEnabled,
  streakCount,
  weeklyHistory,
}) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const isDark = theme === 'dark';

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const targetPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Animate percent count-up
  useEffect(() => {
    let start = 0;
    const duration = 800; // ms
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = targetPercent / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetPercent) {
        setAnimatedPercent(targetPercent);
        clearInterval(timer);
      } else {
        setAnimatedPercent(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetPercent]);

  // Check for all completed grand celebration!
  useEffect(() => {
    if (totalTasks > 0 && completedTasks === totalTasks && !hasCelebrated) {
      setHasCelebrated(true);
      setShowCelebrationBanner(true);
      playCelebrationSound(soundEnabled);

      // Grand full screen confetti fireworks shower
      const end = Date.now() + 2500;
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } else if (completedTasks < totalTasks) {
      setHasCelebrated(false);
      setShowCelebrationBanner(false);
    }
  }, [completedTasks, totalTasks, hasCelebrated, soundEnabled]);

  // Category breakdown calculation
  const categoryCounts = CATEGORIES.map((cat) => {
    const count = tasks.filter((t) => t.category === cat.key).length;
    const completedCount = tasks.filter((t) => t.category === cat.key && t.completed).length;
    return {
      ...cat,
      count,
      completedCount,
      percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0,
    };
  }).filter((c) => c.count > 0);

  // SVG Circular progress math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercent / 100) * circumference;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pt-6 pb-12">
      {/* Grand Celebration Alert Overlay */}
      <AnimatePresence>
        {showCelebrationBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`p-6 sm:p-8 rounded-3xl relative overflow-hidden backdrop-blur-2xl border shadow-2xl text-center ${
              isDark
                ? 'bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-pink-950/80 border-indigo-500/40 shadow-indigo-500/20'
                : 'bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 border-indigo-300 shadow-indigo-200'
            }`}
          >
            <button
              onClick={() => setShowCelebrationBanner(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 mb-3 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              {translations.allDoneTitle}
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-medium text-slate-300 dark:text-slate-300 max-w-md mx-auto">
              {translations.allDoneSub}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left: Circular Progress Ring & Completed Count */}
        <div
          className={`md:col-span-5 p-6 rounded-3xl backdrop-blur-2xl shadow-xl flex flex-col items-center justify-center text-center border ${
            isDark
              ? 'glass-panel-dark border-white/10'
              : 'glass-panel-light border-indigo-100/80 shadow-indigo-500/10'
          }`}
        >
          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            <svg className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={isDark ? 'stroke-slate-800' : 'stroke-slate-200'}
                strokeWidth="12"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-indigo-500 transition-all duration-700 ease-out"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))',
                }}
              />
            </svg>

            {/* Center percentage label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {animatedPercent}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                {translations.completedToday}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm font-bold text-slate-300 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {translations.completedToday}: {completedTasks} / {totalTasks}
            </span>
          </div>
        </div>

        {/* Right: Streak & Weekly 7-day Bar Chart */}
        <div
          className={`md:col-span-7 p-6 rounded-3xl backdrop-blur-2xl shadow-xl flex flex-col justify-between border ${
            isDark
              ? 'glass-panel-dark border-white/10'
              : 'glass-panel-light border-indigo-100/80 shadow-indigo-500/10'
          }`}
        >
          {/* Top: Streak Counter */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/30 dark:border-slate-700/30">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-orange-500/30 flex items-center justify-center shadow-lg shadow-orange-500/10">
                <span className="text-2xl flame-animated">🔥</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {translations.streakDays}
                </p>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-orange-400">
                    {streakCount}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {streakCount === 1 ? 'kun' : 'kun ketma-ket'}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-1 text-xs text-slate-400 font-medium">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>{translations.weeklyStats}</span>
            </div>
          </div>

          {/* 7-Day Weekly Bar Chart */}
          <div className="pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 sm:hidden">
              {translations.weeklyStats}
            </p>

            <div className="flex items-end justify-between h-28 pt-2 px-1">
              {weeklyHistory.map((day, idx) => {
                const maxVal = Math.max(...weeklyHistory.map((d) => d.completed), 5);
                const barHeightPercent = day.completed > 0 ? Math.min(100, Math.round((day.completed / maxVal) * 100)) : 10;
                const isToday = idx === weeklyHistory.length - 1;

                return (
                  <div key={day.date} className="flex flex-col items-center flex-1 mx-1 group">
                    <span className="text-[10px] font-mono font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 mb-1">
                      {day.completed}
                    </span>
                    <div className="w-full max-w-[28px] h-20 bg-black/10 dark:bg-white/5 rounded-xl flex items-end overflow-hidden p-0.5">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${barHeightPercent}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.08, ease: 'easeOut' }}
                        className={`w-full rounded-lg transition-all ${
                          isToday
                            ? 'bg-gradient-to-t from-blue-500 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/40'
                            : day.completed > 0
                            ? 'bg-gradient-to-t from-indigo-600/70 to-indigo-400/80'
                            : 'bg-slate-700/20'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-medium mt-1.5 capitalize ${
                        isToday ? 'font-bold text-indigo-400' : 'text-slate-400'
                      }`}
                    >
                      {day.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution Breakdown */}
      {categoryCounts.length > 0 && (
        <div
          className={`p-6 rounded-3xl backdrop-blur-2xl shadow-xl border ${
            isDark
              ? 'glass-panel-dark border-white/10'
              : 'glass-panel-light border-indigo-100/80 shadow-indigo-500/10'
          }`}
        >
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {translations.categoryDistribution}
            </h4>
          </div>

          <div className="space-y-3">
            {categoryCounts.map((cat) => (
              <div key={cat.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center space-x-1.5 text-slate-300 dark:text-slate-300">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </span>
                  <span className="font-mono text-slate-400">
                    {cat.completedCount} / {cat.count} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
