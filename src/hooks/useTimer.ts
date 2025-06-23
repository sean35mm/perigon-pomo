import { useEffect } from 'react';
import { useTimerStore } from '../stores/timerStore';

export const useTimer = () => {
  const { isRunning, tick } = useTimerStore();

  useEffect(() => {
    let interval: number | undefined;

    if (isRunning) {
      interval = window.setInterval(tick, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, tick]);

  return useTimerStore();
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};

export const getSessionTypeLabel = (
  type: 'work' | 'shortBreak' | 'longBreak'
): string => {
  switch (type) {
    case 'work':
      return 'Work Session';
    case 'shortBreak':
      return 'Short Break';
    case 'longBreak':
      return 'Long Break';
  }
};

export const getSessionTypeColor = (
  type: 'work' | 'shortBreak' | 'longBreak'
): string => {
  switch (type) {
    case 'work':
      return '#dc2626'; // red-600
    case 'shortBreak':
      return '#059669'; // emerald-600
    case 'longBreak':
      return '#7c3aed'; // violet-600
  }
};
