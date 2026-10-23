/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Moon,
  Globe,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Trash2,
  Sparkles,
  Bell,
  CheckCircle,
} from 'lucide-react';

import { Task, Theme, DayCompletion } from './types';
import {
  ALL_LANGUAGES,
  getTranslations,
  TranslationDictionary,
} from './data/languages';
import { playReminderSound } from './utils/audio';

import { ParticleBackground } from './components/ParticleBackground';
import { MouseTrail } from './components/MouseTrail';
import { IntroScreen } from './components/IntroScreen';
import { ClockGreeting } from './components/ClockGreeting';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { StatisticsSection } from './components/StatisticsSection';
import { LanguageModal } from './components/LanguageModal';
import { EditTaskModal } from './components/EditTaskModal';
import { ConfirmModal } from './components/ConfirmModal';
import { NotificationToast } from './components/NotificationToast';

const STORAGE_KEY_TASKS = 'kunreja_tasks';
const STORAGE_KEY_THEME = 'kunreja_theme';
const STORAGE_KEY_LANG = 'kunreja_lang';
const STORAGE_KEY_SOUND = 'kunreja_sound';
const STORAGE_KEY_CUSTOM_DICTS = 'kunreja_custom_dicts';
const STORAGE_KEY_STREAK = 'kunreja_streak';

export default function App() {
  // Theme state: defaults to device preference or stored
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'dark';
  });

  // Sound toggle state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SOUND);
    return saved !== null ? saved === 'true' : true;
  });

  // Language state: detects browser language or stored
  const [currentLang, setCurrentLang] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    if (saved) return saved;
    if (typeof navigator !== 'undefined') {
      const browserCode = navigator.language.split('-')[0].toLowerCase();
      const match = ALL_LANGUAGES.find((l) => l.code === browserCode);
      if (match) return match.code;
    }
    return 'uz';
  });

  // Custom AI translation cache
  const [customDicts, setCustomDicts] = useState<Record<string, TranslationDictionary>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_DICTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Intro splash state
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Modals state
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Active reminder toast state
  const [activeReminder, setActiveReminder] = useState<Task | null>(null);
  const notifiedTasksRef = useRef<Set<string>>(new Set());

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }

    // Default sample tasks
    const today = new Date().toISOString();
    return [
      {
        id: '1',
        text: 'Kunlik reja tuzish va eng muhim vazifalarni belgilash',
        time: '09:00',
        priority: 'high',
        category: 'work',
        note: 'KunReja tizimida kunlik maqsadlarni tartibga solish',
        completed: true,
        completedAt: today,
        createdAt: today,
        order: 1,
      },
      {
        id: '2',
        text: '30 daqiqa kitob mutolaa qilish yoki yangi til o‘rganish',
        time: '11:30',
        priority: 'medium',
        category: 'study',
        completed: false,
        createdAt: today,
        order: 2,
      },
      {
        id: '3',
        text: 'Sog‘lomlashtiruvchi mashg‘ulot yoki ochiq havoda yurish',
        time: '16:00',
        priority: 'high',
        category: 'health',
        completed: false,
        createdAt: today,
        order: 3,
      },
      {
        id: '4',
        text: 'Oila davrasida kechki dasturxon va samimiy suhbat',
        time: '19:30',
        priority: 'medium',
        category: 'family',
        completed: false,
        createdAt: today,
        order: 4,
      },
      {
        id: '5',
        text: 'Ertangi kun uchun xaridlar va ishlar ro‘yxatini tayyorlash',
        time: '21:00',
        priority: 'low',
        category: 'shopping',
        completed: false,
        createdAt: today,
        order: 5,
      },
    ];
  });

  // Calculate streak count
  const streakCount = (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STREAK);
      if (saved) return parseInt(saved, 10) || 1;
    } catch {
      // fallback
    }
    return 3;
  })();

  // 7-day weekly history mock & calculation
  const weeklyHistory: DayCompletion[] = (() => {
    const result: DayCompletion[] = [];
    const days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];

      if (i === 0) {
        // Today
        result.push({
          date: dateStr,
          dayName,
          completed: tasks.filter((t) => t.completed).length,
          total: tasks.length,
        });
      } else {
        // Mock realistic prior days
        const prevCount = [4, 6, 5, 7, 3, 5][i - 1] || 4;
        result.push({
          date: dateStr,
          dayName,
          completed: prevCount,
          total: prevCount + 1,
        });
      }
    }
    return result;
  })();

  // Translations dictionary
  const translations = getTranslations(currentLang, customDicts);

  // Check if current language is RTL
  const currentLangObj = ALL_LANGUAGES.find((l) => l.code === currentLang);
  const isRtl = Boolean(currentLangObj?.isRtl);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  }, [tasks]);

  // Save theme to localStorage and document class
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Save sound setting
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SOUND, soundEnabled.toString());
  }, [soundEnabled]);

  // Save language
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, currentLang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);
  }, [currentLang, isRtl]);

  // Save custom translations
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CUSTOM_DICTS, JSON.stringify(customDicts));
  }, [customDicts]);

  // Reminder interval check (checks every 30 seconds for scheduled times)
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHourMin = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      tasks.forEach((t) => {
        if (!t.completed && t.time === currentHourMin && !notifiedTasksRef.current.has(t.id)) {
          notifiedTasksRef.current.add(t.id);
          setActiveReminder(t);
          playReminderSound(soundEnabled);

          // System Notification if permitted
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(`KunReja: ${t.text}`, {
                body: `${translations.timeLabel}: ${t.time}`,
                icon: '/favicon.ico',
              });
            } catch {
              // Notification fallback
            }
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 30000);
    checkReminders();
    return () => clearInterval(interval);
  }, [tasks, soundEnabled, translations]);

  // Request browser notification permission gently
  const handleRequestNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        playReminderSound(soundEnabled);
      }
    }
  };

  // Add Task
  const handleAddTask = (newTaskData: {
    text: string;
    time: string;
    priority: Task['priority'];
    category: Task['category'];
    note?: string;
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...newTaskData,
      completed: false,
      createdAt: new Date().toISOString(),
      order: tasks.length + 1,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Toggle complete
  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Edit task save
  const handleSaveEditedTask = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // Clear all
  const handleClearAll = () => {
    setTasks([]);
  };

  // Reorder
  const handleReorder = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  // Export JSON file
  const handleExportData = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tasks,
      theme,
      currentLang,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kunreja_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON file
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.tasks)) {
          setTasks(parsed.tasks);
        }
      } catch (err) {
        console.error('Import failed:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Language selection callback
  const handleSelectLanguage = (code: string, customDict?: TranslationDictionary) => {
    setCurrentLang(code);
    if (customDict) {
      setCustomDicts((prev) => ({ ...prev, [code]: customDict }));
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen relative font-sans transition-colors duration-700 ${
        theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
      }`}
    >
      {/* 1. Interactive 60fps Particle Canvas Background */}
      <ParticleBackground theme={theme} />

      {/* 2. Desktop Starry Mouse Trail */}
      <MouseTrail theme={theme} />

      {/* 3. 2-Second Intro Splash Screen */}
      {showIntro && (
        <IntroScreen
          theme={theme}
          onFinish={() => setShowIntro(false)}
        />
      )}

      {/* Main App Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col min-h-screen">
        {/* A) Top Header Bar */}
        <header className="flex items-center justify-between pb-6 border-b border-slate-700/20 dark:border-slate-800">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transform hover:rotate-6 transition-transform">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {translations.appName}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hidden sm:inline-block">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {translations.tagline}
              </p>
            </div>
          </div>

          {/* Right: Actions (Notification, Sound, Language, Theme, Export/Import, Clear) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* System Notification Perm Button */}
            <button
              onClick={handleRequestNotifications}
              title={translations.enableNotifications}
              className={`p-2 sm:p-2.5 rounded-2xl transition-all duration-200 active:scale-90 ${
                theme === 'dark'
                  ? 'bg-slate-800/80 text-slate-300 hover:text-indigo-400 hover:bg-slate-800 border border-slate-700/60'
                  : 'bg-white text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 shadow-sm'
              }`}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? translations.soundOn : translations.soundOff}
              className={`p-2 sm:p-2.5 rounded-2xl transition-all duration-200 active:scale-90 ${
                soundEnabled
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : theme === 'dark'
                  ? 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 border border-slate-700/60'
                  : 'bg-white text-slate-400 hover:bg-slate-100 border border-slate-200 shadow-sm'
              }`}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Language Selector Button */}
            <button
              onClick={() => setIsLangModalOpen(true)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl transition-all duration-200 active:scale-95 text-xs sm:text-sm font-semibold ${
                theme === 'dark'
                  ? 'bg-slate-800/80 text-slate-200 hover:bg-slate-800 border border-slate-700/60'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm'
              }`}
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>{currentLangObj?.flag || '🌐'}</span>
              <span className="hidden md:inline-block max-w-[80px] truncate">
                {currentLangObj?.nativeName || 'Til'}
              </span>
            </button>

            {/* Dark / Light Mode Toggle Button with spinning morph */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘i rejim'}
              className={`p-2 sm:p-2.5 rounded-2xl transition-all duration-300 active:scale-90 relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-slate-800/80 text-amber-300 hover:bg-slate-800 border border-slate-700/60 shadow-lg shadow-black/20'
                  : 'bg-white text-indigo-600 hover:bg-slate-100 border border-slate-200 shadow-sm'
              }`}
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </motion.div>
            </button>
          </div>
        </header>

        {/* B, C, D) Greeting, Big Digital Clock, and Typewriter Motivational Quote */}
        <section className="my-4">
          <ClockGreeting
            theme={theme}
            langCode={currentLang}
            translations={translations}
          />
        </section>

        {/* E) Add Plan Block */}
        <section className="my-3">
          <TaskForm
            theme={theme}
            translations={translations}
            onAddTask={handleAddTask}
          />
        </section>

        {/* F) Task List (Search, Filters, Sort, 3D Cards, Drag & Drop) */}
        <section className="my-4">
          <TaskList
            tasks={tasks}
            theme={theme}
            translations={translations}
            soundEnabled={soundEnabled}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={(task) => setEditingTask(task)}
            onReorder={handleReorder}
          />
        </section>

        {/* G) Statistics Section (Circular %, Streak flame, Weekly 7-day bars, Grand celebration) */}
        <section className="my-4">
          <StatisticsSection
            tasks={tasks}
            theme={theme}
            translations={translations}
            soundEnabled={soundEnabled}
            streakCount={streakCount}
            weeklyHistory={weeklyHistory}
          />
        </section>

        {/* Bottom Utility Bar: Export, Import, Clear All */}
        <footer className="mt-auto pt-8 pb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-700/20 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            {/* Export */}
            <button
              onClick={handleExportData}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all ${
                theme === 'dark'
                  ? 'hover:bg-slate-800 hover:text-slate-200'
                  : 'hover:bg-slate-200 hover:text-slate-800'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{translations.exportData}</span>
            </button>

            {/* Import */}
            <label
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'hover:bg-slate-800 hover:text-slate-200'
                  : 'hover:bg-slate-200 hover:text-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{translations.importData}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            {/* Clear all */}
            <button
              onClick={() => setIsConfirmClearOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{translations.clearAll}</span>
            </button>
          </div>

          <p className="text-[11px] opacity-70">
            KunReja • 60 FPS • Barcha ma'lumotlar qurilmangizda saqlanadi
          </p>
        </footer>
      </div>

      {/* Language Selection Modal */}
      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLang={currentLang}
        theme={theme}
        onSelectLanguage={handleSelectLanguage}
        translations={translations}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEditedTask}
        theme={theme}
        translations={translations}
      />

      {/* Clear All Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        onConfirm={handleClearAll}
        theme={theme}
        translations={translations}
      />

      {/* In-App Reminder Toast */}
      <NotificationToast
        task={activeReminder}
        onDismiss={() => setActiveReminder(null)}
        onComplete={handleToggleComplete}
        theme={theme}
        translations={translations}
      />
    </div>
  );
}
