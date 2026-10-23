import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Clock, Tag, Flag, FileText } from 'lucide-react';
import { Task, PriorityKey, CategoryKey, Theme } from '../types';
import { CATEGORIES } from '../data/categories';
import { TranslationDictionary } from '../data/languages';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Task) => void;
  theme: Theme;
  translations: TranslationDictionary;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  theme,
  translations,
}) => {
  if (!isOpen || !task) return null;

  const [text, setText] = useState(task.text);
  const [time, setTime] = useState(task.time);
  const [priority, setPriority] = useState<PriorityKey>(task.priority);
  const [category, setCategory] = useState<CategoryKey>(task.category);
  const [note, setNote] = useState(task.note || '');

  const isDark = theme === 'dark';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSave({
      ...task,
      text: text.trim(),
      time,
      priority,
      category,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border p-6 ${
          isDark
            ? 'glass-panel-dark border-white/10 text-white'
            : 'glass-panel-light border-indigo-100 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/20 dark:border-slate-700/40">
          <h3 className="font-bold text-lg">{translations.editTask}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Reja nomi / Task Title
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none ${
                isDark
                  ? 'bg-slate-900 text-white border border-slate-700'
                  : 'bg-white text-slate-800 border border-slate-200'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                {translations.timeLabel}
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold outline-none ${
                  isDark
                    ? 'bg-slate-900 text-white border border-slate-700'
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                {translations.priorityLabel}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityKey)}
                className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold outline-none border cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 text-white border-slate-700'
                    : 'bg-white text-slate-800 border-slate-200'
                }`}
              >
                <option value="low">{translations.priorityLow}</option>
                <option value="medium">{translations.priorityMedium}</option>
                <option value="high">{translations.priorityHigh}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              {translations.categoryLabel}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryKey)}
              className={`w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold outline-none border cursor-pointer ${
                isDark
                  ? 'bg-slate-900 text-white border-slate-700'
                  : 'bg-white text-slate-800 border-slate-200'
              }`}
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              {translations.notePlaceholder}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={translations.notePlaceholder}
              className={`w-full px-4 py-2 text-xs sm:text-sm rounded-xl outline-none ${
                isDark
                  ? 'bg-slate-900 text-white border border-slate-700'
                  : 'bg-white text-slate-800 border border-slate-200'
              }`}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-black/10 dark:hover:bg-white/10"
            >
              {translations.confirmCancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{translations.saveChanges}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
