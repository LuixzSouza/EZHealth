'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const TimerContext = createContext({
  isTimerEnabled: false,
  setIsTimerEnabled: () => {},
});

export function TimerProvider({ children }) {
  const [isTimerEnabled, setIsTimerEnabled] = useState(false);

  useEffect(() => {
    const storedValue = localStorage.getItem('timerPresentationEnabled');
    if (storedValue !== null) {
      setIsTimerEnabled(JSON.parse(storedValue));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('timerPresentationEnabled', JSON.stringify(isTimerEnabled));
  }, [isTimerEnabled]);

  return (
    <TimerContext.Provider value={{ isTimerEnabled, setIsTimerEnabled }}>
      {children}
    </TimerContext.Provider>
  );
}

export const useTimer = () => useContext(TimerContext);