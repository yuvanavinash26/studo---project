
import { AppData } from '../types';

const STORAGE_KEY = 'studo_app_data';

const ACCENT_COLORS: Record<string, string> = {
  indigo: '#4f46e5',
  rose: '#f43f5e',
  emerald: '#10b981',
  amber: '#f59e0b',
  purple: '#a855f7'
};

const INITIAL_DATA: AppData = {
  notes: [],
  tasks: [],
  exams: [],
  sessions: [],
  settings: {
    darkMode: false,
    userName: 'Student',
    accentColor: 'indigo',
    pomodoro: {
      work: 25,
      short: 5,
      long: 15
    }
  }
};

export const applyTheme = (settings: AppData['settings']) => {
  const root = document.documentElement;
  
  // Dark Mode
  if (settings.darkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Accent Color
  const hex = ACCENT_COLORS[settings.accentColor] || ACCENT_COLORS.indigo;
  root.style.setProperty('--accent-primary', hex);
  root.style.setProperty('--accent-soft', hex + '1a'); // 10% opacity in hex
};

export const getStorageData = (): AppData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return INITIAL_DATA;
  const parsed = JSON.parse(saved);
  if (!parsed.settings.pomodoro) {
    parsed.settings.pomodoro = INITIAL_DATA.settings.pomodoro;
  }
  return parsed;
};

export const saveStorageData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  applyTheme(data.settings);
  window.dispatchEvent(new Event('studo-theme-update'));
};

export const clearStorageData = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};