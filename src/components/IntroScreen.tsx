import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Theme } from '../types';

interface IntroScreenProps {
  theme: Theme;
  onFinish: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ theme, onFinish }) => {
  const [stage, setStage] = useState<'animating' | 'splitting' | 'done'>('animating');
  const appLetters = ['K', 'u', 'n', 'R', 'e', 'j', 'a'];

  useEffect(() => {
    // Stage 1: Letter reveal & particle orbit (1.4s)
    const timer1 = setTimeout(() => {
      setStage('splitting');
    }, 1800);

    // Stage 2: Split doors open (0.6s)
    const timer2 = setTimeout(() => {
      setStage('done');
      onFinish();
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  if (stage === 'done') return null;

  const isDark = theme === 'dark';

  return (
    <div
      onClick={() => {
        setStage('done');
        onFinish();
      }}
      className="fixed inset-0 z-50 overflow-hidden cursor-pointer flex items-center justify-center select-none"
    >
      {/* Left split door */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: stage === 'splitting' ? '-100%' : 0 }}
        transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
        className={`absolute top-0 left-0 bottom-0 w-1/2 ${
          isDark
            ? 'bg-gradient-to-br from-[#070b16] via-[#0b1020] to-[#121933] border-r border-indigo-500/20'
            : 'bg-gradient-to-br from-[#e0e7ff] via-[#f4f7ff] to-[#ffffff] border-r border-indigo-200'
        }`}
      />

      {/* Right split door */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: stage === 'splitting' ? '100%' : 0 }}
        transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
        className={`absolute top-0 right-0 bottom-0 w-1/2 ${
          isDark
            ? 'bg-gradient-to-bl from-[#070b16] via-[#0b1020] to-[#121933] border-l border-indigo-500/20'
            : 'bg-gradient-to-bl from-[#e0e7ff] via-[#f4f7ff] to-[#ffffff] border-l border-indigo-200'
        }`}
      />

      {/* Center content */}
      <AnimatePresence>
        {stage === 'animating' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col items-center justify-center p-8"
          >
            {/* Orbiting particles ring */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-indigo-400/40"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-2 rounded-full border border-dashed border-purple-400/30"
              />

              {/* Orbiting dots */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50 absolute -top-1.5 left-1/2 -translate-x-1/2" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 shadow-lg shadow-purple-500/50 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
              </motion.div>

              {/* Center icon */}
              <motion.div
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-xl ${
                  isDark
                    ? 'bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-white/20 shadow-indigo-500/20'
                    : 'bg-white/80 border border-indigo-100 shadow-indigo-200'
                }`}
              >
                <Sparkles className="w-12 h-12 text-indigo-400 animate-pulse" />
              </motion.div>
            </div>

            {/* Letter by letter reveal */}
            <div className="flex items-center space-x-1 sm:space-x-2 text-4xl sm:text-6xl font-extrabold tracking-tight">
              {appLetters.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    delay: 0.15 + index * 0.1,
                    duration: 0.45,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className={`mt-4 text-xs sm:text-sm font-medium tracking-widest uppercase ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Kunlik ish rejasi • Daily Planner
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
