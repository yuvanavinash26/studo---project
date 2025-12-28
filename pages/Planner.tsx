
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorageData, saveStorageData } from '../lib/storage';
import { Task } from '../types';
import { Calendar, Trash2, CheckCircle2, AlertCircle, Clock, PlusCircle } from 'lucide-react';

export const Planner: React.FC = () => {
  const [data, setData] = useState(getStorageData());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');

  useEffect(() => {
    const handleUpdate = () => setData(getStorageData());
    window.addEventListener('studo-theme-update', handleUpdate);
    return () => window.removeEventListener('studo-theme-update', handleUpdate);
  }, []);

  const existingSubjects = useMemo(() => {
    const subjects = new Set(data.tasks.map(t => t.subject));
    data.notes.forEach(n => subjects.add(n.subject));
    data.exams.forEach(e => subjects.add(e.subject));
    return Array.from(subjects).filter(Boolean);
  }, [data]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      subject: newTaskSubject || 'General',
      completed: false,
      date: new Date().toISOString(),
      deadline: newTaskDeadline || undefined
    };
    const updated = { ...data, tasks: [...data.tasks, task] };
    saveStorageData(updated);
    setNewTaskTitle('');
    setNewTaskSubject('');
    setNewTaskDeadline('');
  };

  const toggleTask = (id: string) => {
    const updated = {
      ...data,
      tasks: data.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    };
    saveStorageData(updated);
  };

  const removeTask = (id: string) => {
    const updated = { ...data, tasks: data.tasks.filter(t => t.id !== id) };
    saveStorageData(updated);
  };

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(deadline);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const sortedTasks = useMemo(() => {
    return [...data.tasks].sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      
      // Both incomplete: sort by deadline
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      
      // No deadline: sort by creation date
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [data.tasks]);

  const progress = data.tasks.length > 0 ? (data.tasks.filter(t => t.completed).length / data.tasks.length) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <header className="space-y-2">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Study Planner</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Define your milestones and set strict deadlines for accountability.</p>
      </header>

      <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl">
        <form onSubmit={addTask} className="space-y-6 mb-12">
          <div className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Objective</label>
             <input 
               type="text" 
               placeholder="What do you need to accomplish?" 
               className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-accent dark:text-white font-bold text-lg"
               value={newTaskTitle}
               onChange={(e) => setNewTaskTitle(e.target.value)}
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Area</label>
              <div className="relative">
                <input 
                  list="planner-subjects"
                  placeholder="e.g. Mathematics, History" 
                  className="w-full px-8 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-none outline-none focus:ring-2 focus:ring-accent dark:text-white font-bold"
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                />
                <datalist id="planner-subjects">
                  {existingSubjects.map(sub => <option key={sub} value={sub} />)}
                </datalist>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-accent">Completion Deadline</label>
              <div className="relative group">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-accent" size={18} />
                <input 
                  type="date" 
                  className="w-full pl-16 pr-8 py-4 rounded-2xl bg-accent-soft border border-accent/20 outline-none focus:ring-2 focus:ring-accent dark:text-white font-bold appearance-none cursor-pointer"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-accent text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-accent/30 flex items-center justify-center gap-3 active:scale-[0.98]">
            <PlusCircle size={20} /> Add To Roadmap
          </button>
        </form>

        <div className="mb-12 p-8 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-3 w-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-accent" />
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Protocol Completion</span>
              </div>
              <span className="text-accent font-black text-sm">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 h-3 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-accent h-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-6 px-8 border-l border-slate-200 dark:border-white/10 hidden md:flex">
             <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                <p className="text-2xl font-black dark:text-white">{data.tasks.length}</p>
             </div>
             <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Open</p>
                <p className="text-2xl font-black text-accent">{data.tasks.filter(t => !t.completed).length}</p>
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {sortedTasks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-slate-400 py-20 flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                   <Clock size={32} className="opacity-30" />
                </div>
                <p className="font-bold text-lg">Your study roadmap is empty.</p>
                <p className="text-sm max-w-xs opacity-60">Start adding tasks with deadlines to keep your academic progress on track.</p>
              </motion.div>
            )}
            {sortedTasks.map(task => {
              const daysLeft = getDaysRemaining(task.deadline);
              const isOverdue = daysLeft !== null && daysLeft < 0;
              const isToday = daysLeft === 0;
              const isImminent = daysLeft !== null && daysLeft > 0 && daysLeft <= 2;

              return (
                <motion.div 
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex items-center justify-between p-6 rounded-3xl border transition-all group ${
                    task.completed 
                      ? 'bg-slate-50/50 dark:bg-white/2 border-slate-100 dark:border-white/2 opacity-60' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`shrink-0 w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20' 
                          : 'border-slate-200 dark:border-white/10 hover:border-accent hover:scale-110'
                      }`}
                    >
                      {task.completed && <CheckCircle2 size={20} className="text-white" />}
                    </button>
                    <div className="min-w-0 space-y-1">
                      <h4 className={`text-xl font-black tracking-tight truncate ${task.completed ? 'line-through text-slate-400' : 'dark:text-white'}`}>
                        {task.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-accent px-3 py-1 bg-accent/10 rounded-lg">
                          {task.subject}
                        </span>
                        {task.deadline && !task.completed && (
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                            isOverdue 
                              ? 'bg-rose-50 text-rose-500 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20' 
                              : isToday 
                                ? 'bg-amber-50 text-amber-500 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20'
                                : isImminent
                                  ? 'bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20'
                                  : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-white/5 dark:border-white/10'
                          }`}>
                            <Calendar size={10} />
                            {isOverdue 
                              ? `Overdue (${Math.abs(daysLeft)}d)` 
                              : isToday 
                                ? 'Due Today' 
                                : `Due in ${daysLeft}d`}
                          </div>
                        )}
                        {task.deadline && task.completed && (
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeTask(task.id)} 
                    className="ml-4 p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
