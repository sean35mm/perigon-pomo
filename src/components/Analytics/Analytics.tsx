import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Clock, Target, Calendar } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';
import { getDateString } from '../../utils/fakeData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics: React.FC = () => {
  const { sessions } = useTimer();

  const analyticsData = useMemo(() => {
    // Group sessions by date
    const sessionsByDate = sessions.reduce((acc, session) => {
      const date = getDateString(session.startTime);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(session);
      return acc;
    }, {} as Record<string, typeof sessions>);

    // Calculate daily stats
    const dailyStats = Object.entries(sessionsByDate)
      .map(([date, daySessions]) => {
        const workSessions = daySessions.filter((s) => s.type === 'work');
        const completedWork = workSessions.filter((s) => s.completed);
        const totalWorkTime = completedWork.reduce(
          (acc, s) => acc + s.duration,
          0
        );
        const totalSessions = daySessions.length;
        const completedSessions = daySessions.filter((s) => s.completed).length;

        return {
          date,
          workSessions: workSessions.length,
          completedWork: completedWork.length,
          totalWorkTime,
          totalSessions,
          completedSessions,
          completionRate:
            totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    // Get last 14 days
    const last14Days = dailyStats.slice(-14);

    return {
      dailyStats,
      last14Days,
      totalSessions: sessions.length,
      totalWorkSessions: sessions.filter((s) => s.type === 'work').length,
      completedSessions: sessions.filter((s) => s.completed).length,
      totalFocusTime: sessions
        .filter((s) => s.type === 'work' && s.completed)
        .reduce((acc, s) => acc + s.duration, 0),
    };
  }, [sessions]);

  // Daily Activity Chart
  const dailyActivityData = {
    labels: analyticsData.last14Days.map((day) => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }),
    datasets: [
      {
        label: 'Work Sessions',
        data: analyticsData.last14Days.map((day) => day.workSessions),
        backgroundColor: '#dc2626',
        borderRadius: 4,
      },
      {
        label: 'Completed Sessions',
        data: analyticsData.last14Days.map((day) => day.completedWork),
        backgroundColor: '#059669',
        borderRadius: 4,
      },
    ],
  };

  // Completion Rate Trend
  const completionTrendData = {
    labels: analyticsData.last14Days.map((day) => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }),
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: analyticsData.last14Days.map((day) => day.completionRate),
        borderColor: '#7c3aed',
        backgroundColor: '#7c3aed',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Session Type Distribution
  const sessionTypeData = {
    labels: ['Work Sessions', 'Short Breaks', 'Long Breaks'],
    datasets: [
      {
        data: [
          sessions.filter((s) => s.type === 'work').length,
          sessions.filter((s) => s.type === 'shortBreak').length,
          sessions.filter((s) => s.type === 'longBreak').length,
        ],
        backgroundColor: ['#dc2626', '#059669', '#7c3aed'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className='pt-20 min-h-screen p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='bg-white rounded-3xl shadow-xl p-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-8'>
            Analytics Dashboard
          </h1>

          {/* Key Metrics */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
            <div className='bg-blue-50 rounded-xl p-6 text-center'>
              <Calendar className='w-8 h-8 text-blue-600 mx-auto mb-2' />
              <div className='text-2xl font-bold text-blue-600'>
                {analyticsData.totalSessions}
              </div>
              <div className='text-sm text-blue-600'>Total Sessions</div>
            </div>

            <div className='bg-red-50 rounded-xl p-6 text-center'>
              <Target className='w-8 h-8 text-red-600 mx-auto mb-2' />
              <div className='text-2xl font-bold text-red-600'>
                {analyticsData.totalWorkSessions}
              </div>
              <div className='text-sm text-red-600'>Work Sessions</div>
            </div>

            <div className='bg-green-50 rounded-xl p-6 text-center'>
              <TrendingUp className='w-8 h-8 text-green-600 mx-auto mb-2' />
              <div className='text-2xl font-bold text-green-600'>
                {Math.round(
                  (analyticsData.completedSessions /
                    analyticsData.totalSessions) *
                    100
                )}
                %
              </div>
              <div className='text-sm text-green-600'>Completion Rate</div>
            </div>

            <div className='bg-purple-50 rounded-xl p-6 text-center'>
              <Clock className='w-8 h-8 text-purple-600 mx-auto mb-2' />
              <div className='text-2xl font-bold text-purple-600'>
                {Math.floor(analyticsData.totalFocusTime / 60)}h{' '}
                {analyticsData.totalFocusTime % 60}m
              </div>
              <div className='text-sm text-purple-600'>Total Focus Time</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Daily Activity */}
            <div className='bg-gray-50 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                Daily Activity (Last 14 Days)
              </h3>
              <Bar data={dailyActivityData} options={chartOptions} />
            </div>

            {/* Session Type Distribution */}
            <div className='bg-gray-50 rounded-xl p-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                Session Distribution
              </h3>
              <div className='max-w-xs mx-auto'>
                <Doughnut data={sessionTypeData} options={doughnutOptions} />
              </div>
            </div>

            {/* Completion Rate Trend */}
            <div className='bg-gray-50 rounded-xl p-6 lg:col-span-2'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                Completion Rate Trend
              </h3>
              <Line data={completionTrendData} options={lineChartOptions} />
            </div>
          </div>

          {/* Weekly Summary */}
          <div className='mt-8 bg-gray-50 rounded-xl p-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Weekly Summary
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='text-center'>
                <div className='text-xl font-bold text-gray-700'>
                  {analyticsData.last14Days
                    .slice(-7)
                    .reduce((acc, day) => acc + day.workSessions, 0)}
                </div>
                <div className='text-sm text-gray-600'>
                  Work Sessions This Week
                </div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-gray-700'>
                  {Math.floor(
                    analyticsData.last14Days
                      .slice(-7)
                      .reduce((acc, day) => acc + day.totalWorkTime, 0) / 60
                  )}
                  h{' '}
                  {analyticsData.last14Days
                    .slice(-7)
                    .reduce((acc, day) => acc + day.totalWorkTime, 0) % 60}
                  m
                </div>
                <div className='text-sm text-gray-600'>
                  Focus Time This Week
                </div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-gray-700'>
                  {Math.round(
                    analyticsData.last14Days
                      .slice(-7)
                      .reduce((acc, day) => acc + day.completionRate, 0) / 7
                  )}
                  %
                </div>
                <div className='text-sm text-gray-600'>Avg Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
