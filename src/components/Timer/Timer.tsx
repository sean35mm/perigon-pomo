import React from 'react';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';

const Timer: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-8'>
      <div className='bg-white rounded-3xl shadow-xl p-8 max-w-md w-full'>
        <TimerDisplay />
        <div className='mt-8'>
          <TimerControls />
        </div>
      </div>
    </div>
  );
};

export default Timer;
