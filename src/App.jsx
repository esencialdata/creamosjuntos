import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Habits from './pages/Habits';
import Library from './pages/Library';
import Favorites from './pages/Favorites';
import Backstage from './pages/Backstage';

import './index.css';

import { initializeDefaultData } from './services/firestoreService';
import { getLocalTodayDate } from './utils/dateUtils';

import PWAInstallBanner from './components/PWAInstallBanner';
import StickyBottomPlayer from './components/StickyBottomPlayer';
import { GlobalPlayerProvider } from './context/GlobalPlayerContext';

import AutoRefresh from './components/AutoRefresh';

function App() {
  // State for tracking completed habits: Array of { id: number, date: string (ISO date part) }
  const [completedHabits, setCompletedHabits] = useState(() => {
    try {
      const stored = localStorage.getItem('completedHabits');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error reading completedHabits", e);
      return [];
    }
  });

  useEffect(() => {
    initializeDefaultData();

    // Handle hash scrolling on page load
    const hash = window.location.hash;
    if (hash && hash.includes('?anchor=')) {
      setTimeout(() => {
        const id = hash.split('?anchor=')[1];
        if (id) {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 800); // Increased delay for slower renders
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('completedHabits', JSON.stringify(completedHabits));
  }, [completedHabits]);

  // Helper to get local date string YYYY-MM-DD
  // Imported from utils now
  // const getLocalTodayDate = ... (removed)

  const toggleHabit = (habitId) => {
    const today = getLocalTodayDate();
    setCompletedHabits(prev => {
      const isCompletedToday = prev.some(h => h.id === habitId && h.date === today);
      if (isCompletedToday) {
        // Remove if already completed today
        return prev.filter(h => !(h.id === habitId && h.date === today));
      } else {
        // Add new completion
        return [...prev, { id: habitId, date: today }];
      }
    });
  };

  const isHabitCompletedToday = (habitId) => {
    const today = getLocalTodayDate();
    return completedHabits.some(h => h.id === habitId && h.date === today);
  };

  const getBrickCount = () => {
    return completedHabits.length;
  };

  return (
    <GlobalPlayerProvider>
      <Router>
        <AutoRefresh />
        <PWAInstallBanner />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                toggleHabit={toggleHabit}
                isHabitCompletedToday={isHabitCompletedToday}
                brickCount={getBrickCount()}
              />
            }
          />
          <Route
            path="/habitos"
            element={
              <Habits
                toggleHabit={toggleHabit}
                isHabitCompletedToday={isHabitCompletedToday}
              />
            }
          />
          <Route
            path="/recursos"
            element={<Library />}
          />
          <Route
            path="/favoritos"
            element={<Favorites />}
          />
          <Route
            path="/servicio"
            element={<Backstage />}
          />

        </Routes>
        <StickyBottomPlayer />
      </Router>
    </GlobalPlayerProvider>
  );
}

export default App;
