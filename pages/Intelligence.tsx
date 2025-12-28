
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getStorageData } from '../lib/storage';
import { 
  Clock, 
  GraduationCap, 
  Calendar, 
  TrendingUp,
  AlertCircle,
  Zap
} from 'lucide-react';

export const Intelligence: React.FC = () => {
  const data = getStorageData();
  const navigate = useNavigate();

  // Core Analytics Logic
  const analytics = useMemo(() => {
    // 1. Calculate Total Focus Minutes from all Pomodoro sessions
    const totalMinutes = data.sessions.reduce((acc, s) => acc + s.duration, 0);
    
    // 2. Calculate Minutes Today
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const minutesToday = data.sessions
      .filter(s => s.timestamp >= startOfToday)
      .reduce((acc, s) => acc + s.duration, 0);

    // 3. Upcoming Exams Logic
    const sortedExams = [...data.exams]
      .filter(e => new Date(e.date).getTime() >= new Date().setHours(0,0,0,0))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);

    return { totalMinutes, minutesToday, upcomingExams: sortedExams };
  }, [data]);

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
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <TrendingUp className="text-accent" size={24} />
          </div>
          <span className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Academic Intelligence</span>
        </div>
        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Performance Metrics</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Detailed time tracking and exam countdown analytics.</p>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Total Focus Minutes Card */}
        <motion.div 
          variants={item}
          className="relative group overflow-hidden bg-slate-900 dark:bg-slate-900 rounded-[3rem] p-12 border border-white/5 shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-50 pointer-events-none" />
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-accent">
                <Clock size={32} />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Session Total</span>
                <span className="text-xs font-bold text-accent uppercase tracking-tighter">{analytics.minutesToday} mins today</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-[7rem] font-black text-white leading-none tracking-tighter tabular-nums">
                {analytics.totalMinutes}
              </h3>
              <p className="text-2xl font-bold text-accent uppercase tracking-widest">Total Focus Minutes</p>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
              <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">
                Your accumulated focus time across all subjects.
              </p>
              <div className="flex items-center gap-2 text-white/40 font-mono text-xs uppercase tracking-widest">
                <Zap size={14} className="text-amber-400" /> High Efficiency
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
             <Clock size={240} className="text-white" />
          </div>
        </motion.div>

        {/* Nearing Exams Card */}
        <motion.div 
          variants={item}
          className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-200 dark:border-white/5 shadow-sm space-y-8"
        >
          <div className="flex justify-between items-start">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500">
              <GraduationCap size={32} />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Exam Horizon</span>
              <span className="text-xs font-bold dark:text-white uppercase">{analytics.upcomingExams.length} Milestones</span>
            </div>
          </div>

          <div className="space-y-4">
            {analytics.upcomingExams.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <Calendar size={40} className="text-slate-300" />
                <p className="text-slate-500 font-medium">No upcoming exams scheduled.</p>
              </div>
            ) : (
              analytics.upcomingExams.map((exam) => {
                const diff = new Date(exam.date).getTime() - new Date().setHours(0,0,0,0);
                const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
                const isUrgent = daysLeft <= 7;
                
                return (
                  <div key={exam.id} className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-all hover:translate-x-2">
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${isUrgent ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-accent text-white'}`}>
                      <span className="text-xl leading-none">{daysLeft}</span>
                      <span className="text-[8px] uppercase">Days</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-black dark:text-white leading-tight">{exam.subject}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                          exam.priority === 'high' ? 'bg-rose-100 text-rose-600' : 
                          exam.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {exam.priority} Priority
                        </span>
                      </div>
                    </div>
                    {isUrgent && <AlertCircle className="text-rose-500 animate-pulse" size={20} />}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Focus Utilization Footer */}
      <motion.div 
        variants={item}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent/20 rounded-2xl text-accent">
            <Zap size={24} />
          </div>
          <div>
            <h5 className="font-black dark:text-white uppercase tracking-tight">Focus Utilization</h5>
            <p className="text-sm text-slate-500">Each minute logged represents a full Pomodoro work cycle segment.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/study-room')}
          className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/10"
        >
          Resume Protocol
        </button>
      </motion.div>
    </div>
  );
};
