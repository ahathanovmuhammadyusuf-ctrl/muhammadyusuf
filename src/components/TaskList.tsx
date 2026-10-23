import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, ArrowUpDown, Filter, Sparkles, CheckCircle2, ListTodo } from 'lucide-react';
import { Task, Theme, FilterStatus, SortOption, CategoryKey } from '../types';
import { CATEGORIES } from '../data/categories';
import { TranslationDictionary } from '../data/languages';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  theme: Theme;
  translations: TranslationDictionary;
  soundEnabled: boolean;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onReorder: (newTasks: Task[]) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  theme,
  translations,
  soundEnabled,
  onToggleComplete,
  onDelete,
  onEdit,
  onReorder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('time');

  // Drag and drop state
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Status filter
    if (filterStatus === 'pending') {
      result = result.filter((t) => !t.completed);
    } else if (filterStatus === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.text.toLowerCase().includes(q) ||
          (t.note && t.note.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'time') {
        return a.time.localeCompare(b.time);
      } else if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      } else {
        // created
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [tasks, filterStatus, selectedCategory, searchQuery, sortBy]);

  // Drag and drop handlers
  const handleDragStart = (_e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, overId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === overId) return;

    const fromIndex = tasks.findIndex((t) => t.id === draggingId);
    const toIndex = tasks.findIndex((t) => t.id === overId);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...tasks];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    onReorder(reordered);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pt-4">
      {/* Search and Filters Header */}
      <div
        className={`p-4 sm:p-5 rounded-3xl backdrop-blur-xl shadow-lg border transition-all ${
          isDark
            ? 'glass-panel-dark border-white/10'
            : 'glass-panel-light border-indigo-100/80 shadow-indigo-500/10'
        }`}
      >
        {/* Search Input Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className={`w-full pl-11 pr-4 py-2.5 rounded-2xl text-sm font-medium outline-none transition-all placeholder:text-slate-400 ${
              isDark
                ? 'bg-slate-900/60 text-white border border-slate-700/60 focus:border-indigo-500'
                : 'bg-white text-slate-800 border border-slate-200 focus:border-indigo-500 shadow-inner'
            }`}
          />
        </div>

        {/* Status Filters + Sort Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status buttons */}
          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-black/5 dark:bg-white/5">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {translations.filterAll} ({tasks.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                filterStatus === 'pending'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {translations.filterPending} ({tasks.filter((t) => !t.completed).length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                filterStatus === 'completed'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {translations.filterCompleted} ({tasks.filter((t) => t.completed).length})
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className={`text-xs font-semibold py-1.5 px-3 rounded-xl outline-none border cursor-pointer ${
                isDark
                  ? 'bg-slate-800 text-slate-200 border-slate-700'
                  : 'bg-white text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              <option value="time">{translations.sortTime}</option>
              <option value="priority">{translations.sortPriority}</option>
              <option value="created">{translations.sortCreated}</option>
            </select>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-3 pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isDark
                ? 'bg-slate-800/80 text-slate-400 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {translations.filterAll}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-sm ring-1 ring-white/40`
                  : isDark
                  ? 'bg-slate-800/80 text-slate-400 hover:text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task List or Empty State */}
      <div className="space-y-3 min-h-[160px]">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedTasks.length > 0 ? (
            filteredAndSortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                theme={theme}
                translations={translations}
                soundEnabled={soundEnabled}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onEdit={onEdit}
                isDragging={draggingId === task.id}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className={`p-10 rounded-3xl flex flex-col items-center justify-center text-center backdrop-blur-xl border ${
                isDark
                  ? 'glass-panel-dark border-white/5 text-slate-400'
                  : 'glass-panel-light border-indigo-100/50 text-slate-500'
              }`}
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 border border-indigo-400/20 animate-bounce">
                <ListTodo className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                {translations.emptyStateTitle}
              </h3>
              <p className="text-xs sm:text-sm max-w-sm opacity-80">
                {translations.emptyStateSub}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
