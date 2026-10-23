import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Clock, X, Check } from 'lucide-react';
import { Task, Theme } from '../types';
import { TranslationDictionary } from '../data/languages';
import { CATEGORIES } from '../data/categories';

interface NotificationToastProps {
  task: Task | null;
  onDismiss: () => void;
  onComplete: (id: string) => void;
  theme: Theme;
  translations: TranslationDictionary;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  task,
  onDismiss,
  onComplete,
  theme,
  translations,
}) => {
  if (!task) return null;

  const isDark = theme === 'dark';
  const cat = CATEGORIES.find((c) => c.key === task.category) || CATEGORIES[0];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full select-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20 }}
          className={`p-4 rounded-3xl backdrop-blur-2xl shadow-2xl border flex flex-col space-y-3 ${
            isDark
              ? 'glass-panel-dark border-indigo-500/40 shadow-indigo-500/20 text-white'
              : 'glass-panel-light border-indigo-200 shadow-indigo-500/20 text-slate-800'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500 text-white flex items-center justify-center animate-bounce shadow-md shadow-indigo-500/30">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  {translations.remindNotificationTitle}
                </p>
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-mono">{task.time}</span>
                  <span>•</span>
                  <span>{cat.icon} {cat.label}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onDismiss}
              className="p-1 rounded-full text-slate-400 hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm font-semibold line-clamp-2 px-1">
            {task.text}
          </p>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => {
                onComplete(task.id);
                onDismiss();
              }}
              className="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center space-x-1 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{translations.filterCompleted}</span>
            </button>
            <button
              onClick={onDismiss}
              className="py-1.5 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:bg-black/10 dark:hover:bg-white/10"
            >
              {translations.confirmCancel}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
