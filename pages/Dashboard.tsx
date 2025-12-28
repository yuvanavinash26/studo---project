
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getStorageData } from '../lib/storage';
import { getMotivationalQuote } from '../services/gemini';
// Fixed: Imported missing icons from lucide-react
import { Clock, CheckCircle2, FileText, Calendar, ArrowUpRight, Brain, GraduationCap } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState(getStorageData());
  const [quote, setQuote] = useState('Elevating your productivity architecture...');

  useEffect(() => {
    getMotivationalQuote().then(setQuote);
    const handleUpdate = () => setData(getStorageData());
    window.addEventListener('studo-theme-update', handleUpdate);
    return () => window.removeEventListener('studo-theme-update', handleUpdate);
  }, []);

  const totalFocusTime = data.sessions.reduce((acc, s) => acc + s.duration, 0);
  const pendingTasks = data.tasks.filter(t => !t.completed).length;
  const notesCount = data.notes.length;
  const upcomingExams = data.exams.length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header className="space-y-2">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter"
        >
          Welcome back, {data.settings.userName}.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 dark:text-slate-400 text-xl font-medium"
        >
          Your roadmap is clear. You have {pendingTasks} tasks waiting.
        </motion.p>
      </header>

      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative group p-12 rounded-[3rem] bg-slate-900 dark:bg-accent border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-transparent pointer-events-none opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em] backdrop-blur-md border border-white/10">Insight of the Day</span>
            </div>
            <p className="text-3xl md:text-4xl font-bold leading-[1.1] text-white tracking-tight italic">
              "{quote}"
            </p>
          </div>
          <Link 
            to="/study-room" 
            className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all hover:translate-y-[-4px] active:translate-y-0 shadow-xl"
          >
            Start Session <ArrowUpRight size={18} />
          </Link>
        </div>
        
        {/* Animated background blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[100%] bg-accent/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[60%] bg-blue-500/20 rounded-full blur-[100px]"></div>
      </motion.section>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <DashboardCard variants={item} label="Focus Units" value={`${totalFocusTime}m`} icon={Clock} trend="Today" />
        <DashboardCard variants={item} label="Pending Load" value={pendingTasks} icon={CheckCircle2} trend="In List" />
        <DashboardCard variants={item} label="Archived Knowledge" value={notesCount} icon={FileText} trend="Resources" />
        <DashboardCard variants={item} label="Exam Horizon" value={upcomingExams} icon={Calendar} trend="Events" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <div className="glass-panel p-10 rounded-[2.5rem] space-y-6 group overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl font-black dark:text-white flex items-center gap-3">
              System Health <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Your productivity metrics are looking optimal today.</p>
            <div className="pt-8">
              <Link 
                to="/intelligence" 
                className="text-accent font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
              >
                Deep Analytics <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <Brain size={200} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-accent-soft rounded-3xl flex items-center justify-center text-accent">
            <GraduationCap size={40} />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-black dark:text-white">Exam Coming Up?</h4>
            <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium leading-relaxed">Schedule your milestones to see the countdown and priority levels.</p>
          </div>
          <Link to="/exams" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Schedule Now</Link>
        </div>
      </motion.div>
    </div>
  );
};

const DashboardCard: React.FC<{ label: string; value: string | number; icon: any; trend: string; variants: any }> = ({ label, value, icon: Icon, trend, variants }) => (
  <motion.div 
    variants={variants}
    whileHover={{ y: -8 }}
    className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-2xl hover:border-accent/30 transition-all group"
  >
    <div className="flex justify-between items-start mb-8">
      <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
        <Icon size={32} />
      </div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trend}</span>
    </div>
    <div className="space-y-1">
      <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest opacity-80">{label}</p>
      <p className="text-4xl font-black dark:text-white tracking-tighter tabular-nums">{value}</p>
    </div>
  </motion.div>
);
