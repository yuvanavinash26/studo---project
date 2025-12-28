
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { TimerMode, AppData } from '../types';
import { getStorageData, saveStorageData } from '../lib/storage';

interface TimerContextType {
  timeLeft: number;
  isActive: boolean;
  mode: TimerMode;
  selectedTaskId: string;
  progress: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  switchMode: (newMode: TimerMode) => void;
  setSelectedTaskId: (id: string) => void;
  formatTime: (seconds: number) => string;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(getStorageData());
  const [mode, setMode] = useState<TimerMode>(TimerMode.WORK);
  const [timeLeft, setTimeLeft] = useState(data.settings.pomodoro.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  
  const secondsCounterRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  // Sync with storage updates (e.g. from settings)
  useEffect(() => {
    const handleUpdate = () => {
      const newData = getStorageData();
      setData(newData);
    };
    window.addEventListener('studo-theme-update', handleUpdate);
    return () => window.removeEventListener('studo-theme-update', handleUpdate);
  }, []);

  // Update timeLeft when mode or settings change, but only if NOT active
  useEffect(() => {
    if (!isActive) {
      const mins = data.settings.pomodoro[mode as keyof typeof data.settings.pomodoro] || 25;
      setTimeLeft(mins * 60);
    }
  }, [mode, data.settings.pomodoro]);

  const logFocusMinute = () => {
    const storageData = getStorageData();
    const newSession = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      duration: 1,
      taskId: selectedTaskId || undefined
    };
    storageData.sessions.push(newSession);
    saveStorageData(storageData);
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    if (mode === TimerMode.WORK && secondsCounterRef.current > 30) {
      logFocusMinute();
    }
    secondsCounterRef.current = 0;
    
    // Play sound
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play().catch(() => {});
    
    alert(mode === TimerMode.WORK ? "Focus session complete! Take a break." : "Break over! Ready to focus?");
    
    const nextMins = data.settings.pomodoro[mode as keyof typeof data.settings.pomodoro];
    setTimeLeft(nextMins * 60);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          const newTime = prev - 1;
          
          if (mode === TimerMode.WORK) {
            secondsCounterRef.current += 1;
            if (secondsCounterRef.current >= 60) {
              logFocusMinute();
              secondsCounterRef.current = 0;
            }
          }
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    secondsCounterRef.current = 0;
    const mins = data.settings.pomodoro[mode as keyof typeof data.settings.pomodoro];
    setTimeLeft(mins * 60);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    secondsCounterRef.current = 0;
    const mins = data.settings.pomodoro[newMode as keyof typeof data.settings.pomodoro];
    setTimeLeft(mins * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const initialTimeForMode = data.settings.pomodoro[mode as keyof typeof data.settings.pomodoro] * 60;
  const progress = (timeLeft / initialTimeForMode) * 100;

  return (
    <TimerContext.Provider value={{
      timeLeft, isActive, mode, selectedTaskId, progress,
      toggleTimer, resetTimer, switchMode, setSelectedTaskId, formatTime
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error('useTimer must be used within TimerProvider');
  return context;
};
