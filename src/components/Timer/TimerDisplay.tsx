import React from 'react';
import {
  useTimer,
  formatTime,
  getSessionTypeLabel,
  getSessionTypeColor,
} from '../../hooks/useTimer';

interface CircularProgressProps {
  progress: number;
  color: string;
  size: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  color,
  size,
}) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className='relative inline-flex items-center justify-center'>
      <svg
        width={size}
        height={size}
        className='timer-circle'
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='currentColor'
          strokeWidth='4'
          fill='transparent'
          className='text-gray-200'
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth='4'
          fill='transparent'
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className='timer-progress'
          strokeLinecap='round'
        />
      </svg>
    </div>
  );
};

const TimerDisplay: React.FC = () => {
  const { timeRemaining, currentType, settings } = useTimer();

  const totalDuration = (() => {
    switch (currentType) {
      case 'work':
        return settings.workDuration * 60;
      case 'shortBreak':
        return settings.shortBreakDuration * 60;
      case 'longBreak':
        return settings.longBreakDuration * 60;
    }
  })();

  const progress = ((totalDuration - timeRemaining) / totalDuration) * 100;
  const color = getSessionTypeColor(currentType);

  return (
    <div className='flex flex-col items-center justify-center space-y-6'>
      <div className='text-center'>
        <h2 className='text-lg font-medium text-gray-600 mb-2'>
          {getSessionTypeLabel(currentType)}
        </h2>
        <div className='text-sm text-gray-500'>
          Session {Math.floor(progress / 25) + 1} of 4
        </div>
      </div>

      <div className='relative'>
        <CircularProgress progress={progress} color={color} size={280} />
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center'>
            <div className='text-5xl font-mono font-bold text-gray-800 text-shadow'>
              {formatTime(timeRemaining)}
            </div>
            <div className='text-sm text-gray-500 mt-1'>
              {Math.floor(timeRemaining / 60)}m {timeRemaining % 60}s remaining
            </div>
          </div>
        </div>
      </div>

      <div className='text-center text-sm text-gray-500'>
        <div>Focus time: {settings.workDuration}m</div>
        <div>Break time: {settings.shortBreakDuration}m</div>
      </div>
    </div>
  );
};

export default TimerDisplay;
