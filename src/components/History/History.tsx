import React, { useState, useMemo } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Play } from 'lucide-react';
import {
  useTimer,
  formatTime,
  getSessionTypeLabel,
  getSessionTypeColor,
} from '../../hooks/useTimer';
import { getDateString } from '../../utils/fakeData';

const History: React.FC = () => {
  const { sessions } = useTimer();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [sessionTypeFilter, setSessionTypeFilter] = useState<
    'all' | 'work' | 'shortBreak' | 'longBreak'
  >('all');

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const dateMatch =
        !selectedDate || getDateString(session.startTime) === selectedDate;
      const typeMatch =
        sessionTypeFilter === 'all' || session.type === sessionTypeFilter;
      return dateMatch && typeMatch;
    });
  }, [sessions, selectedDate, sessionTypeFilter]);

  const stats = useMemo(() => {
    const totalSessions = filteredSessions.length;
    const completedSessions = filteredSessions.filter(
      (s) => s.completed
    ).length;
    const workSessions = filteredSessions.filter(
      (s) => s.type === 'work'
    ).length;
    const totalWorkTime = filteredSessions
      .filter((s) => s.type === 'work' && s.completed)
      .reduce((acc, s) => acc + s.duration, 0);

    return {
      totalSessions,
      completedSessions,
      workSessions,
      totalWorkTime,
      completionRate:
        totalSessions > 0
          ? Math.round((completedSessions / totalSessions) * 100)
          : 0,
    };
  }, [filteredSessions]);

  const uniqueDates = useMemo(() => {
    const dates = sessions.map((session) => getDateString(session.startTime));
    return [...new Set(dates)].sort().reverse();
  }, [sessions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className='pt-20 min-h-screen p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-3xl shadow-xl p-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-8'>
            Session History
          </h1>

          {/* Stats Summary */}
          <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-8'>
            <div className='bg-blue-50 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {stats.totalSessions}
              </div>
              <div className='text-sm text-blue-600'>Total Sessions</div>
            </div>
            <div className='bg-green-50 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {stats.completedSessions}
              </div>
              <div className='text-sm text-green-600'>Completed</div>
            </div>
            <div className='bg-red-50 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold text-red-600'>
                {stats.workSessions}
              </div>
              <div className='text-sm text-red-600'>Work Sessions</div>
            </div>
            <div className='bg-purple-50 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold text-purple-600'>
                {Math.floor(stats.totalWorkTime / 60)}h{' '}
                {stats.totalWorkTime % 60}m
              </div>
              <div className='text-sm text-purple-600'>Focus Time</div>
            </div>
            <div className='bg-yellow-50 rounded-lg p-4 text-center'>
              <div className='text-2xl font-bold text-yellow-600'>
                {stats.completionRate}%
              </div>
              <div className='text-sm text-yellow-600'>Completion Rate</div>
            </div>
          </div>

          {/* Filters */}
          <div className='flex flex-col md:flex-row gap-4 mb-6'>
            <div className='flex items-center gap-2'>
              <Calendar size={20} className='text-gray-500' />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value=''>All dates</option>
                {uniqueDates.map((date) => (
                  <option key={date} value={date}>
                    {formatDate(date)}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex items-center gap-2'>
              <Play size={20} className='text-gray-500' />
              <select
                value={sessionTypeFilter}
                onChange={(e) => setSessionTypeFilter(e.target.value as any)}
                className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='all'>All types</option>
                <option value='work'>Work Sessions</option>
                <option value='shortBreak'>Short Breaks</option>
                <option value='longBreak'>Long Breaks</option>
              </select>
            </div>
          </div>

          {/* Sessions List */}
          <div className='space-y-3 max-h-96 overflow-y-auto'>
            {filteredSessions.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <Clock size={48} className='mx-auto mb-4 text-gray-300' />
                <p>No sessions found for the selected filters.</p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={`
                    flex items-center justify-between p-4 rounded-lg border-l-4 bg-gray-50
                    ${
                      session.completed
                        ? 'border-green-400'
                        : session.interrupted
                        ? 'border-orange-400'
                        : 'border-red-400'
                    }
                  `}
                >
                  <div className='flex items-center space-x-4'>
                    <div
                      className='w-3 h-3 rounded-full'
                      style={{
                        backgroundColor: getSessionTypeColor(session.type),
                      }}
                    />
                    <div>
                      <div className='font-medium text-gray-800'>
                        {getSessionTypeLabel(session.type)}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {formatDateTime(session.startTime)}
                        {session.endTime &&
                          ` - ${formatDateTime(session.endTime)}`}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='text-right'>
                      <div className='text-sm text-gray-600'>
                        {session.duration} min
                      </div>
                      <div className='text-xs text-gray-500'>
                        {session.endTime &&
                          formatTime(
                            Math.floor(
                              (session.endTime.getTime() -
                                session.startTime.getTime()) /
                                1000
                            )
                          )}{' '}
                        actual
                      </div>
                    </div>

                    {session.completed ? (
                      <CheckCircle size={24} className='text-green-500' />
                    ) : session.interrupted ? (
                      <XCircle size={24} className='text-orange-500' />
                    ) : (
                      <XCircle size={24} className='text-red-500' />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
