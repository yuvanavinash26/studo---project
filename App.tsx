
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { StudyRoom } from './pages/StudyRoom';
import { Notes } from './pages/Notes';
import { Planner } from './pages/Planner';
import { Exams } from './pages/Exams';
import { Settings } from './pages/Settings';
import { Intelligence } from './pages/Intelligence';
import { getStorageData, applyTheme } from './lib/storage';
import { TimerProvider } from './context/TimerContext';

const App: React.FC = () => {
  const [data, setData] = useState(getStorageData());

  useEffect(() => {
    applyTheme(data.settings);
    
    const handleThemeUpdate = () => {
      setData(getStorageData());
    };

    window.addEventListener('studo-theme-update', handleThemeUpdate);
    return () => window.removeEventListener('studo-theme-update', handleThemeUpdate);
  }, []);

  return (
    <TimerProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/study-room" element={<StudyRoom />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/intelligence" element={<Intelligence />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </TimerProvider>
  );
};

export default App;
