
import React, { useState, useEffect } from 'react';
import { getStorageData, saveStorageData, clearStorageData } from '../lib/storage';
import { Linkedin, Instagram, Github, Heart, ExternalLink } from 'lucide-react';

export const Settings: React.FC = () => {
  const [data, setData] = useState(getStorageData());

  useEffect(() => {
    const handleUpdate = () => setData(getStorageData());
    window.addEventListener('studo-theme-update', handleUpdate);
    return () => window.removeEventListener('studo-theme-update', handleUpdate);
  }, []);

  const updateSetting = (key: string, value: any) => {
    const updated = {
      ...data,
      settings: { ...data.settings, [key]: value }
    };
    saveStorageData(updated);
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/yuvan-avinash',
      color: 'hover:text-[#0077b5]'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/yuvan__nash_/',
      color: 'hover:text-[#e4405f]'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/yuvanavinash26',
      color: 'hover:text-[#333]'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-bold dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">Personalize your Studo experience.</p>
      </header>

      <section className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h4 className="font-bold dark:text-white">User Profile</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your name appears on the dashboard.</p>
          </div>
          <input 
            type="text" 
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-accent dark:text-white transition-all"
            value={data.settings.userName}
            onChange={(e) => updateSetting('userName', e.target.value)}
          />
        </div>

        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h4 className="font-bold dark:text-white">Dark Mode</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Toggle for late night study sessions.</p>
          </div>
          <button 
            onClick={() => updateSetting('darkMode', !data.settings.darkMode)}
            className={`w-14 h-8 rounded-full transition-all relative ${data.settings.darkMode ? 'bg-accent' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${data.settings.darkMode ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <h4 className="font-bold dark:text-white mb-1">Accent Color</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Choose your preferred brand color.</p>
          <div className="flex gap-4">
            {['indigo', 'rose', 'emerald', 'amber', 'purple'].map(color => {
              const hexMap: Record<string, string> = {
                indigo: '#4f46e5', rose: '#f43f5e', emerald: '#10b981', amber: '#f59e0b', purple: '#a855f7'
              };
              return (
                <button 
                  key={color}
                  onClick={() => updateSetting('accentColor', color)}
                  className={`w-12 h-12 rounded-2xl transition-all border-4 shadow-sm hover:scale-110 ${
                    data.settings.accentColor === color ? 'border-slate-900 dark:border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: hexMap[color] }}
                ></button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Credits Section */}
      <section className="bg-slate-100 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
            <Heart size={32} className="fill-accent animate-pulse" />
          </div>
          <div>
            <h4 className="text-lg font-bold dark:text-white">About Studo</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">Crafted with focus by Yuvan Avinash</p>
          </div>
          
          <div className="flex items-center gap-6 pt-2">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-white/5 transition-all hover:-translate-y-1 hover:shadow-md ${link.color}`}
                  title={link.name}
                >
                  <Icon size={24} />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-rose-50 dark:bg-rose-900/10 p-8 rounded-3xl border border-rose-100 dark:border-rose-900/30">
        <h4 className="text-rose-600 font-bold mb-2">Danger Zone</h4>
        <p className="text-rose-500 text-sm mb-6">Resetting will permanently delete all local data.</p>
        <button 
          onClick={() => {
            if(confirm("Permanently reset all data?")) clearStorageData();
          }}
          className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/30"
        >
          Reset Application
        </button>
      </section>
    </div>
  );
};
