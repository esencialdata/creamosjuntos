import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Habits from './pages/Habits';
import Backstage from './pages/Backstage';
import './index.css';

import { initializeDefaultData } from './services/firestoreService';

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
  }, []);

  useEffect(() => {
    localStorage.setItem('completedHabits', JSON.stringify(completedHabits));
  }, [completedHabits]);

  const toggleHabit = (habitId) => {
    const today = new Date().toISOString().split('T')[0];
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
    const today = new Date().toISOString().split('T')[0];
    return completedHabits.some(h => h.id === habitId && h.date === today);
  };

  const getBrickCount = () => {
    return completedHabits.length;
  };

  return (
    <Router>
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
          path="/servicio"
          element={<Backstage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
