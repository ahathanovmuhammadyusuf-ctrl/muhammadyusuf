import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Trash2, Edit2, Check, AlertCircle, GripVertical, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, Theme } from '../types';
import { CATEGORIES } from '../data/categories';
import { TranslationDictionary } from '../data/languages';
import { playTaskCompleteSound } from '../utils/audio';

interface TaskCardProps {
  task: Task;
  theme: Theme;
  translations: TranslationDictionary;
  soundEnabled: boolean;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragEnd?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  theme,
  translations,
  soundEnabled,
  onToggleComplete,
  onDelete,
  onEdit,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const isDark = theme === 'dark';
  const categoryDef = CATEGORIES.find((c) => c.key === task.category) || CATEGORIES[0];

  // Check if overdue
  const isOverdue = (() => {
    if (task.completed) return false;
    const now = new Date();
    const currentHourMin = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return task.time < currentHourMin;
  })();

  // 3D Tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5.5;
    const rotateY = ((x - centerX) / centerX) * 5.5;

    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glowX, glowY });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed) {
      // Confetti burst from element coordinates
      const rect = cardRef.current?.getBoundingClientRect();
      const originX = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
      const originY = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { x: originX, y: originY },
        colors: ['#60a5fa', '#a78bfa', '#34d399', '#f472b6', '#fbbf24'],
        disableForReducedMotion: true,
      });

      playTaskCompleteSound(soundEnabled);
    }
    onToggleComplete(task.id);
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case 'high':
        return {
          label: translations.priorityHigh,
          badgeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
        };
      case 'medium':
        return {
          label: translations.priorityMedium,
          badgeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        };
      case 'low':
        return {
          label: translations.priorityLow,
          badgeClass: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        };
    }
  };

  const priorityBadge = getPriorityBadge();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 25, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e as unknown as React.DragEvent<HTMLDivElement>, task.id)}
      onDragOver={(e) => onDragOver && onDragOver(e as unknown as React.DragEvent<HTMLDivElement>, task.id)}
      onDragEnd={onDragEnd}
      style={{
        perspective: '1000px',
      }}
      className={`relative group touch-manipulation select-none cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-40 scale-95' : ''
      }`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.015, 1.015, 1.015)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.45s ease-out',
        }}
        className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-300 border ${
          task.priority === 'high' && !task.completed ? 'priority-high-pulse' : ''
        } ${
          task.completed
            ? isDark
              ? 'bg-slate-900/30 border-slate-800 text-slate-500 opacity-75'
              : 'bg-slate-100/70 border-slate-200 text-slate-400 opacity-80'
            : isDark
            ? 'glass-card-dark shadow-xl hover:border-indigo-500/40'
            : 'glass-card-light shadow-md hover:border-indigo-400 hover:shadow-indigo-500/10'
        }`}
      >
        {/* Mouse spotlight glow inside the card */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, ${
                isDark ? 'rgba(99, 102, 241, 0.16)' : 'rgba(99, 102, 241, 0.1)'
              } 0%, transparent 60%)`,
            }}
          />
        )}

        <div className="relative z-10 flex items-start space-x-3.5 sm:space-x-4">
          {/* Drag grip handle */}
          <div
            title={translations.dragHint}
            className="mt-1 text-slate-400 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block cursor-grab"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Animated SVG Checkbox */}
          <button
            type="button"
            onClick={handleToggle}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 transition-all duration-300 active:scale-90 cursor-pointer ${
              task.completed
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-emerald-400 shadow-lg shadow-emerald-500/30 text-white'
                : isDark
                ? 'border-slate-600 hover:border-indigo-400 bg-slate-800/60'
                : 'border-slate-300 hover:border-indigo-500 bg-white shadow-sm'
            }`}
          >
            {task.completed && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </motion.div>
            )}
          </button>

          {/* Task Info & Body */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {/* Category Badge */}
              <span
                className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                  isDark ? categoryDef.bgDark : categoryDef.bgLight
                }`}
              >
                <span>{categoryDef.icon}</span>
                <span>{categoryDef.label}</span>
              </span>

              {/* Priority Badge */}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold tracking-wide ${priorityBadge.badgeClass}`}
              >
                {priorityBadge.label}
              </span>

              {/* Scheduled Time */}
              <span
                className={`inline-flex items-center space-x-1 text-xs font-mono font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <Clock className="w-3.5 h-3.5 opacity-70" />
                <span>{task.time}</span>
              </span>

              {/* Overdue Alert Badge */}
              {isOverdue && (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-red-500/20 text-red-500 border border-red-500/40 animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  <span>{translations.overdue}</span>
                </span>
              )}
            </div>

            {/* Title with strikethrough animation */}
            <div className="relative">
              <p
                className={`text-sm sm:text-base font-semibold leading-relaxed transition-all duration-300 break-words ${
                  task.completed
                    ? 'line-through text-slate-500 dark:text-slate-500 italic'
                    : isDark
                    ? 'text-slate-100'
                    : 'text-slate-800'
                }`}
              >
                {task.text}
              </p>
            </div>

            {/* Note if present */}
            {task.note && (
              <div
                className={`mt-1.5 text-xs flex items-center space-x-1 font-normal ${
                  task.completed ? 'text-slate-500 line-through' : isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0 opacity-70" />
                <span className="italic">{task.note}</span>
              </div>
            )}
          </div>

          {/* Action buttons (Edit & Delete) */}
          <div className="flex items-center space-x-1 self-center shrink-0">
            <button
              type="button"
              onClick={() => onEdit(task)}
              title={translations.editTask}
              className={`p-2 rounded-xl transition-all duration-200 active:scale-95 ${
                isDark
                  ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(task.id)}
              title={translations.clearAll}
              className={`p-2 rounded-xl transition-all duration-200 active:scale-95 text-slate-400 hover:text-red-500 ${
                isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
