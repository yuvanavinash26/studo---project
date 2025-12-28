import React, { useState, useMemo, useEffect } from 'react';
import { getStorageData, saveStorageData } from '../lib/storage';
import { Exam } from '../types';

export const Exams: React.FC = () => {
  const [data, setData] = useState(getStorageData());
  const [examForm, setExamForm] = useState({ subject: '', date: '', priority: 'medium' as Exam['priority'] });

  useEffect(() => {
    const handleUpdate = () => setData(getStorageData());
    window.addEventListener('studo-theme-update', handleUpdate);
    return () => window.removeEventListener('studo-theme-update', handleUpdate);
  }, []);

  const existingSubjects = useMemo(() => {
    const subjects = new Set(data.exams.map(e => e.subject));
    data.tasks.forEach(t => subjects.add(t.subject));
    data.notes.forEach(n => subjects.add(n.subject));
    return Array.from(subjects).filter(Boolean);
  }, [data]);

  const addExam = () => {
    if (!examForm.subject || !examForm.date) return;
    const exam: Exam = {
      id: crypto.randomUUID(),
      ...examForm
    };
    const updated = { ...data, exams: [...data.exams, exam] };
    saveStorageData(updated);
    setExamForm({ subject: '', date: '', priority: 'medium' });
  };

  const removeExam = (id: string) => {
    const updated = { ...data, exams: data.exams.filter(e => e.id !== id) };
    saveStorageData(updated);
  };

  const getDaysLeft = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const sortedExams = [...data.exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <h2 className="text-3xl font-bold dark:text-white">Exam Timeline</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Add Upcoming Exam</h3>
            <div className="space-y-4">
              <input 
                list="exam-subjects"
                type="text" placeholder="Subject Name" 
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-none outline-none dark:text-white focus:ring-2 focus:ring-accent"
                value={examForm.subject}
                onChange={e => setExamForm({...examForm, subject: e.target.value})}
              />
              <datalist id="exam-subjects">
                {existingSubjects.map(sub => <option key={sub} value={sub} />)}
              </datalist>
              <input 
                type="date" 
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-none outline-none dark:text-white focus:ring-2 focus:ring-accent"
                value={examForm.date}
                onChange={e => setExamForm({...examForm, date: e.target.value})}
              />
              <select 
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-none outline-none dark:text-white focus:ring-2 focus:ring-accent"
                value={examForm.priority}
                onChange={e => setExamForm({...examForm, priority: e.target.value as Exam['priority']})}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button onClick={addExam} className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-accent/20">Schedule Exam</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {sortedExams.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 italic">
              <span className="text-4xl mb-4 opacity-30">🗓️</span>
              <p>No exams scheduled yet.</p>
            </div>
          )}
          {sortedExams.map(exam => {
            const daysLeft = getDaysLeft(exam.date);
            const isUrgent = daysLeft <= 3 && daysLeft >= 0;
            return (
              <div key={exam.id} className={`flex items-center gap-6 p-6 rounded-3xl border transition-all ${isUrgent ? 'bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-900/30' : 'bg-white border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 shadow-sm hover:shadow-md'}`}>
                <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-bold ${isUrgent ? 'bg-rose-500 text-white' : 'bg-accent-soft text-accent'}`}>
                  <span className="text-2xl">{daysLeft < 0 ? '✓' : daysLeft}</span>
                  <span className="text-[10px] uppercase">{daysLeft < 0 ? 'Done' : 'Days'}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xl font-bold dark:text-white">{exam.subject}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      exam.priority === 'high' ? 'bg-rose-100 text-rose-600' : 
                      exam.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {exam.priority}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{new Date(exam.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <button onClick={() => removeExam(exam.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-2">✕</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};