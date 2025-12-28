
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorageData, saveStorageData } from '../lib/storage';
import { TimerMode } from '../types';
import { useTimer } from '../context/TimerContext';
import { Settings, Play, Pause, RotateCcw, Sparkles, Target, Zap } from 'lucide-react';

export const StudyRoom: React.FC = () => {
  const [data, setData] = useState(getStorageData());
  const { 
    timeLeft, isActive, mode, selectedTaskId, progress,
    toggleTimer, resetTimer, switchMode, setSelectedTaskId, formatTime 
  } = useTimer();
  
  const [showSettings, setShowSettings] = useState(false);
  const [distractionFree, setDistractionFree] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setData(getStorageData());
    window.addEventListener('studo-theme-update', handleUpdate);
    return () => window.removeEventListener('studo-theme-update', handleUpdate);
  }, []);

  const currentTask = useMemo(() => 
    data.tasks.find(t => t.id === selectedTaskId), 
    [selectedTaskId, data.tasks]
  );

  const pendingTasks = useMemo(() => 
    data.tasks.filter(t => !t.completed), 
    [data.tasks]
  );

  return (
    <div className={`h-full flex flex-col items-center justify-center transition-all duration-1000 rounded-[3rem] ${distractionFree ? 'bg-slate-950 p-0 m-0 fixed inset-0 z-[100]' : 'p-4'}`}>
      
      {/* Background Zen Animation */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[150px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px]"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full max-w-5xl z-10 flex flex-col items-center space-y-12 transition-all duration-700 ${distractionFree ? 'scale-110' : ''}`}>
        
        <header className={`text-center space-y-4 transition-all duration-500 ${distractionFree ? 'opacity-0 scale-90 translate-y-[-20px]' : 'opacity-100'}`}>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-soft rounded-full border border-accent/20"
          >
            <Zap size={14} className="text-accent fill-accent" />
            <span className="text-[10px] font-black text-accent uppercase tracking-widest">Focus Engine v1.0</span>
          </motion.div>
          <h2 className="text-5xl font-black tracking-tighter dark:text-white">Deep Work Protocol</h2>
        </header>

        <div className="relative group">
          {/* Animated rings */}
          <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${
            isActive ? 'bg-accent/20 scale-125 opacity-100' : 'bg-transparent scale-100 opacity-0'
          }`}></div>

          <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-2xl">
              <circle cx="50" cy="50" r="48" className="stroke-slate-100 dark:stroke-white/5 fill-transparent" strokeWidth="2" />
              <motion.circle
                cx="50" cy="50" r="48"
                className="stroke-accent fill-transparent"
                strokeWidth="3"
                strokeDasharray="301.6"
                strokeDashoffset={`${301.6 - (progress / 100) * 301.6}`}
                strokeLinecap="round"
                style={{ filter: isActive ? 'drop-shadow(0 0 12px var(--accent-primary))' : 'none' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={timeLeft}
                  initial={{ opacity: 0.8, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-7xl md:text-8xl font-black font-mono-timer tracking-tighter text-accent dark:text-accent tabular-nums leading-none select-none"
                >
                  {formatTime(timeLeft)}
                </motion.span>
              </AnimatePresence>
              <div className="flex items-center gap-2 mt-6">
                <div className={`w-3 h-3 rounded-full bg-accent ${isActive ? 'animate-pulse' : ''}`}></div>
                <span className="text-accent/70 dark:text-accent/80 uppercase tracking-[2px] text-xs font-black">
                  {mode.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          {!isActive && !distractionFree && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 shadow-xl"
            >
              {[TimerMode.WORK, TimerMode.SHORT_BREAK, TimerMode.LONG_BREAK].map(m => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                    mode === m 
                      ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {m === TimerMode.WORK ? 'Deep Focus' : m === TimerMode.SHORT_BREAK ? 'Short Gap' : 'Long Gap'}
                </button>
              ))}
            </motion.div>
          )}

          <div className="flex items-center gap-4">
            {!distractionFree && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-5 rounded-3xl transition-all hover:rotate-90 hover:bg-slate-100 dark:hover:bg-white/5 ${showSettings ? 'text-accent bg-accent-soft' : 'text-slate-400'}`}
              >
                <Settings size={28} />
              </button>
            )}
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTimer}
              className={`w-16 h-16 rounded-lg flex items-center justify-center shadow-md transition-all transform hover:scale-105 border-2 ${
                isActive 
                  ? 'bg-rose-500 border-rose-400/50 text-white shadow-rose-500/20' 
                  : 'bg-accent border-accent/60 text-white shadow-accent/20'
              }`}
            >
              {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-0.5" fill="currentColor" />}
            </motion.button>

            {!distractionFree && (
              <button
                onClick={() => setDistractionFree(true)}
                className="p-5 rounded-3xl transition-all hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400"
              >
                <Sparkles size={28} />
              </button>
            )}

            {distractionFree && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setDistractionFree(false)}
                className="fixed top-12 right-12 p-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                <Sparkles size={28} />
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showSettings && !distractionFree && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-xl font-black dark:text-white tracking-tight">Interval Configuration</h4>
                <button onClick={() => resetTimer()} className="p-2 text-slate-400 hover:text-accent transition-colors">
                  <RotateCcw size={18} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {['work', 'short', 'long'].map((m) => (
                  <div key={m} className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m}</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl p-4 text-center dark:text-white font-bold outline-none focus:ring-2 focus:ring-accent transition-all"
                      value={(data.settings.pomodoro as any)[m]}
                      onChange={(e) => {
                        const num = Math.max(1, parseInt(e.target.value) || 1);
                        const newData = { ...data };
                        (newData.settings.pomodoro as any)[m] = num;
                        saveStorageData(newData);
                        setData(newData);
                      }}
                    />
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowSettings(false)}
                className="w-full mt-8 bg-accent text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Save Settings
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
