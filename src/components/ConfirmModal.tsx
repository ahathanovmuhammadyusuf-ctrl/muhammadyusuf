import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Theme } from '../types';
import { TranslationDictionary } from '../data/languages';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  theme: Theme;
  translations: TranslationDictionary;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  theme,
  translations,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border p-6 text-center ${
          isDark
            ? 'glass-panel-dark border-white/10 text-white'
            : 'glass-panel-light border-indigo-100 text-slate-900'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold mb-2">{translations.clearConfirmTitle}</h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          {translations.clearConfirmDesc}
        </p>

        <div className="flex items-center justify-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            {translations.confirmCancel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center space-x-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{translations.confirmYes}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
