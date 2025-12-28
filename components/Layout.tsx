
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorageData } from '../lib/storage';
import { useTimer } from '../context/TimerContext';
import { Home, Timer, BookText, Calendar, GraduationCap, Brain, Settings as SettingsIcon, Clock, CalendarDays, User, Sparkles } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/study-room', label: 'Study Room', icon: Timer },
  { path: '/notes', label: 'Notes', icon: BookText },
  { path: '/planner', label: 'Planner', icon: Calendar },
  { path: '/exams', label: 'Exams', icon: GraduationCap },
  { path: '/intelligence', label: 'Intelligence', icon: Brain },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const { timeLeft, isActive, formatTime, mode } = useTimer();
  const [settings, setSettings] = useState(getStorageData().settings);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleUpdate = () => setSettings(getStorageData().settings);
    window.addEventListener('studo-theme-update', handleUpdate);
    return () => {
      clearInterval(timer);
      window.removeEventListener('studo-theme-update', handleUpdate);
    };
  }, []);

  const formatParts = (date: Date) => {
    const hours = date.getHours();
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return { displayHours, minutes, ampm };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const { displayHours, minutes, ampm } = formatParts(time);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <aside className="w-full md:w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-white/5 md:h-screen sticky top-0 z-50">
        <div className="p-8 flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-accent via-purple-500 to-rose-500 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent"></div>
              <Sparkles className="text-accent relative z-10 w-6 h-6 animate-pulse-slow" />
              <span className="absolute -bottom-1 -right-1 text-[10px] font-black text-accent/20 select-none">S</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight dark:text-white leading-none">STUDO</h1>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Crafted by Yuvan Avinash</span>
          </div>
        </div>
        
        <nav className="flex md:flex-col overflow-x-auto md:overflow-y-auto px-4 gap-1.5 pb-4 md:pb-8">
          {navItems.map((item) => {
            const isActivePage = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative group outline-none"
              >
                <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 relative z-10 ${
                  isActivePage
                    ? 'text-accent'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}>
                  <Icon size={20} className={`transition-transform duration-300 ${isActivePage ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                </div>
                {isActivePage && (
                  <motion.div 
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-accent-soft rounded-2xl border border-accent/20"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-24 px-10 flex items-center justify-between shrink-0 z-40 relative">
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col">
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em] leading-tight mb-1 opacity-80">Current Workspace</span>
              <span className="text-xl font-black text-slate-900 dark:text-white capitalize">
                {location.pathname === '/' ? 'Home Dashboard' : location.pathname.substring(1).replace('-', ' ')}
              </span>
            </div>
            
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Link to="/study-room" className="flex items-center gap-4 px-5 py-2.5 bg-accent/10 rounded-2xl border border-accent/20 group hover:bg-accent/15 transition-all">
                    <div className="relative">
                      <Timer size={18} className="text-accent animate-spin-slow" />
                      <div className="absolute inset-0 bg-accent/20 blur-md rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-accent uppercase tracking-widest leading-none mb-0.5">{mode} session</span>
                      <span className="text-sm font-mono-timer font-bold dark:text-white">{formatTime(timeLeft)}</span>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-5 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl backdrop-blur-md">
               <CalendarDays size={16} className="text-slate-400" />
               <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">
                 {formatDate(time)}
               </span>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl backdrop-blur-md shadow-sm">
               <Clock size={18} className="text-accent" />
               <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">{displayHours}:{minutes}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">{ampm}</span>
               </div>
            </div>
            
            <Link 
              to="/settings"
              className="group relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border border-white/20 shadow-inner overflow-hidden transition-all group-hover:scale-105 group-active:scale-95 group-hover:shadow-lg">
                <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" />
                <span className="text-lg font-black text-slate-600 dark:text-slate-300 uppercase tracking-tighter">
                  {settings.userName.charAt(0) || <User size={18} />}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full shadow-sm" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
