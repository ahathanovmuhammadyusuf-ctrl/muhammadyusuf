export type PriorityKey = 'low' | 'medium' | 'high';

export type CategoryKey = 'work' | 'study' | 'home' | 'health' | 'family' | 'shopping' | 'other';

export interface Task {
  id: string;
  text: string;
  time: string; // HH:mm
  priority: PriorityKey;
  category: CategoryKey;
  note?: string;
  completed: boolean;
  completedAt?: string; // ISO date string
  createdAt: string; // ISO date string
  order: number;
}

export type Theme = 'dark' | 'light';

export type FilterStatus = 'all' | 'pending' | 'completed';

export type SortOption = 'time' | 'priority' | 'created';

export interface CategoryDef {
  key: CategoryKey;
  label: string;
  icon: string;
  color: string; // Tailwind color class
  bgLight: string;
  bgDark: string;
}

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRtl?: boolean;
}

export interface DayCompletion {
  date: string; // YYYY-MM-DD
  dayName: string;
  completed: number;
  total: number;
}
