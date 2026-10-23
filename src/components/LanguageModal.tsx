import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Search, X, Sparkles, Check, Loader2 } from 'lucide-react';
import { ALL_LANGUAGES, TranslationDictionary, UZBEK_TRANSLATIONS } from '../data/languages';
import { Theme } from '../types';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: string;
  theme: Theme;
  onSelectLanguage: (code: string, customDict?: TranslationDictionary) => void;
  translations: TranslationDictionary;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  theme,
  onSelectLanguage,
  translations,
}) => {
  const [search, setSearch] = useState('');
  const [customLangName, setCustomLangName] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const filteredLanguages = ALL_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      lang.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCustomTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLangName.trim()) return;

    setIsTranslating(true);
    setTranslateError('');

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage: customLangName.trim(),
          templateStrings: UZBEK_TRANSLATIONS,
        }),
      });

      if (!res.ok) {
        throw new Error('Tarjima qilishda xatolik yuz berdi');
      }

      const data = await res.json();
      if (data.translated) {
        const customCode = `custom-${customLangName.trim().toLowerCase().slice(0, 4)}`;
        onSelectLanguage(customCode, data.translated as TranslationDictionary);
        onClose();
      }
    } catch (err: any) {
      setTranslateError(err.message || 'Tarjima amalga oshmadi. Qaytadan urinib ko‘ring.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className={`w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[85vh] ${
          isDark
            ? 'glass-panel-dark border-white/10 text-white'
            : 'glass-panel-light border-indigo-100 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-700/20 dark:border-slate-700/40 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Tilni tanlang / Select Language</h3>
              <p className="text-xs text-slate-400">47+ tillar & Sun'iy intellekt tarjimasi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-slate-700/20 dark:border-slate-700/40">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidiruv / Search language..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400 ${
                isDark
                  ? 'bg-slate-900/60 text-white border border-slate-700 focus:border-indigo-500'
                  : 'bg-white text-slate-800 border border-slate-200 focus:border-indigo-500 shadow-inner'
              }`}
            />
          </div>
        </div>

        {/* Languages list */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredLanguages.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : isDark
                    ? 'bg-slate-800/40 hover:bg-slate-800/80 text-slate-200 border border-slate-700/40'
                    : 'bg-white/80 hover:bg-indigo-50/80 text-slate-700 border border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="text-xl shrink-0">{lang.flag}</span>
                  <div className="truncate">
                    <p className="text-xs sm:text-sm font-semibold truncate">{lang.nativeName}</p>
                    <p
                      className={`text-[10px] truncate ${
                        isSelected ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      {lang.name} {lang.isRtl ? '• RTL' : ''}
                    </p>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 shrink-0 text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Footer: "Boshqa til" (Gemini AI translation for custom language) */}
        <div className="p-4 border-t border-slate-700/20 dark:border-slate-700/40 bg-black/5 dark:bg-white/5">
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-95 active:scale-95 transition-all shadow-md shadow-purple-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>{translations.otherLanguage} (Gemini AI)</span>
            </button>
          ) : (
            <form onSubmit={handleCustomTranslate} className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">
                {translations.otherLangPrompt}
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customLangName}
                  onChange={(e) => setCustomLangName(e.target.value)}
                  placeholder="Masalan: Esperanto, Lotincha, Mo'g'ulcha..."
                  disabled={isTranslating}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs outline-none ${
                    isDark
                      ? 'bg-slate-900 text-white border border-slate-700'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                />
                <button
                  type="submit"
                  disabled={isTranslating || !customLangName.trim()}
                  className="px-4 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-500/30"
                >
                  {isTranslating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{translations.translating}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tarjima qilish</span>
                    </>
                  )}
                </button>
              </div>

              {translateError && (
                <p className="text-xs text-red-400 mt-1">{translateError}</p>
              )}
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
