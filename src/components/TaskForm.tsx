import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Plus, Clock, Tag, Flag, FileText, AlertCircle } from 'lucide-react';
import { PriorityKey, CategoryKey, Theme } from '../types';
import { CATEGORIES } from '../data/categories';
import { TranslationDictionary } from '../data/languages';

interface TaskFormProps {
  theme: Theme;
  translations: TranslationDictionary;
  onAddTask: (task: {
    text: string;
    time: string;
    priority: PriorityKey;
    category: CategoryKey;
    note?: string;
  }) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  theme,
  translations,
  onAddTask,
}) => {
  const [text, setText] = useState('');
  // Default to nearest upcoming half hour (e.g., 10:00, 14:30)
  const defaultTime = (() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 30);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  })();

  const [time, setTime] = useState(defaultTime);
  const [priority, setPriority] = useState<PriorityKey>('medium');
  const [category, setCategory] = useState<CategoryKey>('work');
  const [note, setNote] = useState('');
  const [showNoteField, setShowNoteField] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const isDark = theme === 'dark';

  const triggerShake = (msg: string) => {
    setErrorMessage(msg);
    setIsShaking(true);
    if (inputRef.current) inputRef.current.focus();
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  const handleCreateRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!text.trim()) {
      triggerShake(translations.validationEmpty);
      return;
    }

    onAddTask({
      text: text.trim(),
      time: time || defaultTime,
      priority,
      category,
      note: note.trim() || undefined,
    });

    // Reset inputs
    setText('');
    setNote('');
    setShowNoteField(false);
    setErrorMessage('');
    if (inputRef.current) inputRef.current.focus();
  };

  const getPriorityLabel = (p: PriorityKey) => {
    switch (p) {
      case 'low': return translations.priorityLow;
      case 'medium': return translations.priorityMedium;
      case 'high': return translations.priorityHigh;
    }
  };

  const getCategoryLabel = (k: CategoryKey) => {
    switch (k) {
      case 'work': return translations.catWork;
      case 'study': return translations.catStudy;
      case 'home': return translations.catHome;
      case 'health': return translations.catHealth;
      case 'family': return translations.catFamily;
      case 'shopping': return translations.catShopping;
      case 'other': return translations.catOther;
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={`w-full max-w-3xl mx-auto p-5 sm:p-7 rounded-3xl backdrop-blur-2xl shadow-2xl transition-all duration-300 relative border ${
        isDark
          ? 'glass-panel-dark border-white/10'
          : 'glass-panel-light border-indigo-100/80 shadow-indigo-500/10'
      }`}
    >
      {/* Main task title input */}
      <div className="relative mb-5">
        <div
          className={`relative rounded-2xl transition-all ${
            isShaking ? 'shake-field ring-2 ring-red-500 bg-red-500/10' : ''
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder={translations.inputPlaceholder}
            className={`w-full px-5 py-4 text-base sm:text-lg font-medium rounded-2xl outline-none transition-all placeholder:text-slate-400 ${
              isDark
                ? 'bg-slate-900/60 text-white border border-slate-700/60 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                : 'bg-white/90 text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-inner'
            }`}
          />
        </div>

        {/* Validation warning */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-1.5 text-xs text-red-500 font-semibold mt-2 px-1"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </div>

      {/* Row of quick selectors: Category, Priority, Time, Note */}
      <div className="space-y-4">
        {/* Category selector pills */}
        <div>
          <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            <Tag className="w-3.5 h-3.5" />
            <span>{translations.categoryLabel}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.key;
              return (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-400/40`
                      : isDark
                      ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/40'
                      : 'bg-white/80 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{getCategoryLabel(cat.key)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom row: Priority, Time, Note Toggle, and Add Button */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-2">
          {/* Priority */}
          <div className="sm:col-span-5">
            <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              <Flag className="w-3.5 h-3.5" />
              <span>{translations.priorityLabel}</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {/* Low */}
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
                  priority === 'low'
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : isDark
                    ? 'bg-slate-800/60 text-emerald-400 border border-emerald-900/40 hover:bg-slate-800'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {getPriorityLabel('low')}
              </button>
              {/* Medium */}
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
                  priority === 'medium'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                    : isDark
                    ? 'bg-slate-800/60 text-amber-400 border border-amber-900/40 hover:bg-slate-800'
                    : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                {getPriorityLabel('medium')}
              </button>
              {/* High */}
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
                  priority === 'high'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 ring-2 ring-rose-400/40'
                    : isDark
                    ? 'bg-slate-800/60 text-rose-400 border border-rose-900/40 hover:bg-slate-800'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                {getPriorityLabel('high')}
              </button>
            </div>
          </div>

          {/* Time picker */}
          <div className="sm:col-span-3">
            <label className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>{translations.timeLabel}</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`w-full py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold outline-none transition-all ${
                isDark
                  ? 'bg-slate-800/80 text-white border border-slate-700 focus:border-indigo-500'
                  : 'bg-white text-slate-800 border border-slate-200 focus:border-indigo-500 shadow-sm'
              }`}
            />
          </div>

          {/* Add Button with Ripple */}
          <div className="sm:col-span-4 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowNoteField(!showNoteField)}
              title="Izoh qo'shish / Add note"
              className={`p-2.5 rounded-xl border transition-all ${
                showNoteField || note
                  ? 'bg-indigo-500 text-white border-indigo-400 shadow-sm'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-5 h-5" />
            </button>

            <button
              type="submit"
              onClick={handleCreateRipple}
              className="relative overflow-hidden flex-1 py-2.5 px-5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {/* Ripple circles */}
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                  }}
                  className="absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 animate-ping pointer-events-none"
                />
              ))}

              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>{translations.addButton}</span>
            </button>
          </div>
        </div>

        {/* Optional note accordion */}
        {showNoteField && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-1"
          >
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={translations.notePlaceholder}
              className={`w-full px-4 py-2 text-xs sm:text-sm rounded-xl outline-none transition-all placeholder:text-slate-400 ${
                isDark
                  ? 'bg-slate-900/60 text-slate-200 border border-slate-700 focus:border-indigo-500'
                  : 'bg-white/80 text-slate-700 border border-slate-200 focus:border-indigo-500'
              }`}
            />
          </motion.div>
        )}
      </div>
    </motion.form>
  );
};
