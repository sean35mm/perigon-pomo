import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimerState, TimerSettings, PomodoroSession } from '../types';
import { generateFakeData } from '../utils/fakeData';

interface TimerStore extends TimerState {
  settings: TimerSettings;
  sessions: PomodoroSession[];

  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  completeSession: () => void;
  updateSettings: (settings: Partial<TimerSettings>) => void;
  setTimeRemaining: (time: number) => void;
  tick: () => void;
}

const defaultSettings: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
  soundVolume: 0.5,
};

const getNextSessionType = (
  completedSessions: number,
  sessionsUntilLongBreak: number
): 'work' | 'shortBreak' | 'longBreak' => {
  if (
    completedSessions % (sessionsUntilLongBreak * 2) ===
    sessionsUntilLongBreak * 2 - 1
  ) {
    return 'longBreak';
  }
  return completedSessions % 2 === 0 ? 'work' : 'shortBreak';
};

const getDurationForType = (
  type: 'work' | 'shortBreak' | 'longBreak',
  settings: TimerSettings
): number => {
  switch (type) {
    case 'work':
      return settings.workDuration;
    case 'shortBreak':
      return settings.shortBreakDuration;
    case 'longBreak':
      return settings.longBreakDuration;
  }
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isRunning: false,
      isPaused: false,
      currentSession: null,
      timeRemaining: defaultSettings.workDuration * 60,
      currentType: 'work',
      completedSessions: 0,
      totalWorkSessions: 0,
      settings: defaultSettings,
      sessions: generateFakeData(), // Populate with fake data for testing

      // Actions
      startTimer: () => {
        const state = get();
        if (!state.currentSession) {
          const newSession: PomodoroSession = {
            id: crypto.randomUUID(),
            type: state.currentType,
            startTime: new Date(),
            duration: getDurationForType(state.currentType, state.settings),
            completed: false,
            interrupted: false,
          };

          set({
            isRunning: true,
            isPaused: false,
            currentSession: newSession,
          });
        } else {
          set({ isRunning: true, isPaused: false });
        }
      },

      pauseTimer: () => {
        set({ isRunning: false, isPaused: true });
      },

      resetTimer: () => {
        const state = get();
        const duration = getDurationForType(state.currentType, state.settings);

        set({
          isRunning: false,
          isPaused: false,
          currentSession: null,
          timeRemaining: duration * 60,
        });
      },

      completeSession: () => {
        const state = get();
        if (state.currentSession) {
          const completedSession: PomodoroSession = {
            ...state.currentSession,
            endTime: new Date(),
            completed: true,
          };

          const newCompletedSessions = state.completedSessions + 1;
          const newTotalWorkSessions =
            state.currentType === 'work'
              ? state.totalWorkSessions + 1
              : state.totalWorkSessions;

          const nextType = getNextSessionType(
            newCompletedSessions,
            state.settings.sessionsUntilLongBreak
          );
          const nextDuration = getDurationForType(nextType, state.settings);

          set({
            sessions: [...state.sessions, completedSession],
            completedSessions: newCompletedSessions,
            totalWorkSessions: newTotalWorkSessions,
            currentSession: null,
            currentType: nextType,
            timeRemaining: nextDuration * 60,
            isRunning: false,
            isPaused: false,
          });
        }
      },

      updateSettings: (newSettings) => {
        const state = get();
        const updatedSettings = { ...state.settings, ...newSettings };

        set({
          settings: updatedSettings,
          timeRemaining: !state.isRunning
            ? getDurationForType(state.currentType, updatedSettings) * 60
            : state.timeRemaining,
        });
      },

      setTimeRemaining: (time) => {
        set({ timeRemaining: time });
      },

      tick: () => {
        const state = get();
        if (state.isRunning && state.timeRemaining > 0) {
          set({ timeRemaining: state.timeRemaining - 1 });
        } else if (state.isRunning && state.timeRemaining <= 0) {
          state.completeSession();
        }
      },
    }),
    {
      name: 'pomodoro-timer-storage',
      partialize: (state) => ({
        settings: state.settings,
        sessions: state.sessions,
        completedSessions: state.completedSessions,
        totalWorkSessions: state.totalWorkSessions,
      }),
    }
  )
);
