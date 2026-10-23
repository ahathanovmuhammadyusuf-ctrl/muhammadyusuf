import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sunrise, Sun, Sunset, Moon, Sparkles, RefreshCw, Quote } from 'lucide-react';
import { Theme } from '../types';
import { TranslationDictionary } from '../data/languages';
import { getDailyQuote, QuoteItem, QUOTES } from '../data/quotes';

interface ClockGreetingProps {
  theme: Theme;
  langCode: string;
  translations: TranslationDictionary;
}

export const ClockGreeting: React.FC<ClockGreetingProps> = ({
  theme,
  langCode,
  translations,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayedQuote, setDisplayedQuote] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const isDark = theme === 'dark';

  // Tick clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  // Greeting & time icon calculation
  let greetingText = translations.greetingDay;
  let GreetingIcon = Sun;
  let iconAnimation = 'animate-spin-slow';
  let badgeColors = 'from-amber-400 to-yellow-500 text-amber-950';

  if (hours >= 5 && hours < 12) {
    greetingText = translations.greetingMorning;
    GreetingIcon = Sunrise;
    badgeColors = 'from-orange-400 to-amber-500 text-orange-950';
  } else if (hours >= 12 && hours < 18) {
    greetingText = translations.greetingDay;
    GreetingIcon = Sun;
    badgeColors = 'from-yellow-400 to-amber-400 text-amber-950';
  } else if (hours >= 18 && hours < 22) {
    greetingText = translations.greetingEvening;
    GreetingIcon = Sunset;
    badgeColors = 'from-purple-400 to-pink-500 text-purple-950';
  } else {
    greetingText = translations.greetingNight;
    GreetingIcon = Moon;
    badgeColors = 'from-indigo-400 to-blue-500 text-indigo-950';
  }

  // Localized date formatting with Intl.DateTimeFormat
  const formattedDate = (() => {
    try {
      const formatter = new Intl.DateTimeFormat(langCode || 'uz', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return formatter.format(currentTime);
    } catch {
      return currentTime.toLocaleDateString();
    }
  })();

  // Quotes list based on language
  const quotesList = QUOTES[langCode] || QUOTES['uz'] || QUOTES['en'];
  const currentQuoteItem: QuoteItem = quotesList[quoteIndex % quotesList.length] || getDailyQuote(langCode);

  // Typewriter effect for motivational quote
  useEffect(() => {
    setIsTyping(true);
    setDisplayedQuote('');
    const fullText = `"${currentQuoteItem.quote}" — ${currentQuoteItem.author}`;
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedQuote(fullText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 38);

    return () => clearInterval(interval);
  }, [quoteIndex, currentQuoteItem.quote, currentQuoteItem.author]);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => prev + 1);
  };

  return (
    <div className="w-full flex flex-col items-center text-center space-y-6 pt-4 pb-2">
      {/* Time-of-day Badge & Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-3"
      >
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-tr ${badgeColors} shadow-amber-500/20`}
        >
          <GreetingIcon className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
          {greetingText}
        </h1>
      </motion.div>

      {/* Big Digital Clock with Sliding Digits */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`px-8 py-5 rounded-3xl backdrop-blur-2xl inline-flex flex-col items-center shadow-xl ${
          isDark
            ? 'glass-panel-dark border-white/10 shadow-black/40'
            : 'glass-panel-light border-white/80 shadow-indigo-500/10'
        }`}
      >
        <div className="flex items-center font-mono font-bold tracking-tight text-4xl sm:text-6xl select-none">
          {/* Hours */}
          <div className="flex space-x-1">
            <span className="w-8 sm:w-11 text-center">{formattedHours[0]}</span>
            <span className="w-8 sm:w-11 text-center">{formattedHours[1]}</span>
          </div>

          <span className="mx-1 text-indigo-400 animate-pulse">:</span>

          {/* Minutes */}
          <div className="flex space-x-1">
            <span className="w-8 sm:w-11 text-center">{formattedMinutes[0]}</span>
            <span className="w-8 sm:w-11 text-center">{formattedMinutes[1]}</span>
          </div>

          <span className="mx-1 text-indigo-400 animate-pulse">:</span>

          {/* Seconds */}
          <div className="relative overflow-hidden h-12 sm:h-16 flex items-center text-indigo-400">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={formattedSeconds}
                initial={{ y: 22, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -22, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="flex space-x-1"
              >
                <span className="w-8 sm:w-11 text-center">{formattedSeconds[0]}</span>
                <span className="w-8 sm:w-11 text-center">{formattedSeconds[1]}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Date and weekday */}
        <p
          className={`mt-2 text-sm sm:text-base font-medium capitalize tracking-wide ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {formattedDate}
        </p>
      </motion.div>

      {/* Motivational Quote with Typewriter Effect */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`max-w-2xl px-6 py-4 rounded-2xl backdrop-blur-xl flex items-center justify-between space-x-3 mx-4 text-left border ${
          isDark
            ? 'bg-slate-900/40 border-slate-700/50 text-slate-200'
            : 'bg-white/60 border-indigo-100 text-slate-700 shadow-sm'
        }`}
      >
        <Quote className="w-5 h-5 text-indigo-400 shrink-0 self-start mt-0.5 opacity-80" />
        <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed italic">
          <span>{displayedQuote}</span>
          {isTyping && (
            <span className="inline-block w-1.5 h-3.5 ml-1 bg-indigo-400 animate-pulse align-middle" />
          )}
        </div>
        <button
          onClick={handleNextQuote}
          title="Yangi gap / Next quote"
          className="p-1.5 rounded-xl hover:bg-indigo-500/20 active:scale-95 transition-all text-indigo-400 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};
