import type { PomodoroSession } from '../types';

export const generateFakeData = (): PomodoroSession[] => {
  const sessions: PomodoroSession[] = [];
  const now = new Date();

  // Generate data for the last 30 days
  for (let dayOffset = 30; dayOffset >= 0; dayOffset--) {
    const date = new Date(now);
    date.setDate(date.getDate() - dayOffset);

    // Random number of sessions per day (0-8)
    const sessionsPerDay = Math.floor(Math.random() * 9);

    for (let i = 0; i < sessionsPerDay; i++) {
      const sessionDate = new Date(date);
      // Random time during work hours (9 AM - 6 PM)
      sessionDate.setHours(9 + Math.floor(Math.random() * 9));
      sessionDate.setMinutes(Math.floor(Math.random() * 60));

      // Determine session type (mostly work sessions)
      let sessionType: 'work' | 'shortBreak' | 'longBreak';
      const rand = Math.random();
      if (rand < 0.7) {
        sessionType = 'work';
      } else if (rand < 0.95) {
        sessionType = 'shortBreak';
      } else {
        sessionType = 'longBreak';
      }

      const duration =
        sessionType === 'work' ? 25 : sessionType === 'shortBreak' ? 5 : 15;
      const completed = Math.random() > 0.15; // 85% completion rate
      const interrupted = !completed && Math.random() > 0.5;

      const endTime = new Date(sessionDate);
      if (completed) {
        endTime.setMinutes(endTime.getMinutes() + duration);
      } else {
        // Interrupted sessions end early
        endTime.setMinutes(
          endTime.getMinutes() +
            Math.floor(duration * 0.3 + Math.random() * duration * 0.4)
        );
      }

      sessions.push({
        id: `fake-${dayOffset}-${i}-${Date.now()}`,
        type: sessionType,
        startTime: sessionDate,
        endTime: completed || interrupted ? endTime : undefined,
        duration,
        completed,
        interrupted,
      });
    }
  }

  return sessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

export const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getWeekString = (date: Date): string => {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  return getDateString(weekStart);
};
