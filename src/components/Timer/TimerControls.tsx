import { Pause, Play, RotateCcw } from 'lucide-react';
import React from 'react';
import { useTimer } from '../../hooks/useTimer';

const TimerControls: React.FC = () => {
  const { isRunning, startTimer, pauseTimer, resetTimer } = useTimer();

  return (
    <div className='flex items-center justify-center space-x-4'>
      <button
        onClick={isRunning ? pauseTimer : startTimer}
        className={`
          flex items-center justify-center w-16 h-16 rounded-full 
          transition-all duration-200 transform hover:scale-105 
          focus:outline-none focus:ring-4 focus:ring-opacity-50
          ${
            isRunning
              ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-300 text-white'
              : 'bg-green-500 hover:bg-green-600 focus:ring-green-300 text-white'
          }
        `}
        aria-label={isRunning ? 'Pause timer' : 'Start timer'}
      >
        {isRunning ? <Pause size={24} /> : <Play size={24} className='ml-1' />}
      </button>

      <button
        onClick={resetTimer}
        className='
          flex items-center justify-center w-12 h-12 rounded-full 
          bg-gray-200 hover:bg-gray-300 text-gray-600 
          transition-all duration-200 transform hover:scale-105 
          focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50
        '
        aria-label='Reset timer'
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
};

export default TimerControls;
