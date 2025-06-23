import React from 'react';
import { useTimer } from '../../hooks/useTimer';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useTimer();

  const handleDurationChange = (key: keyof typeof settings, value: number) => {
    updateSettings({ [key]: value });
  };

  const handleToggleChange = (key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value });
  };

  return (
    <div className='pt-20 min-h-screen p-8'>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-3xl shadow-xl p-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-8'>Settings</h1>

          <div className='space-y-8'>
            {/* Timer Durations */}
            <section>
              <h2 className='text-xl font-semibold text-gray-700 mb-4'>
                Timer Durations
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-2'>
                    Work Duration (minutes)
                  </label>
                  <input
                    type='number'
                    min='1'
                    max='60'
                    value={settings.workDuration}
                    onChange={(e) =>
                      handleDurationChange(
                        'workDuration',
                        parseInt(e.target.value) || 25
                      )
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-2'>
                    Short Break (minutes)
                  </label>
                  <input
                    type='number'
                    min='1'
                    max='30'
                    value={settings.shortBreakDuration}
                    onChange={(e) =>
                      handleDurationChange(
                        'shortBreakDuration',
                        parseInt(e.target.value) || 5
                      )
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-600 mb-2'>
                    Long Break (minutes)
                  </label>
                  <input
                    type='number'
                    min='1'
                    max='60'
                    value={settings.longBreakDuration}
                    onChange={(e) =>
                      handleDurationChange(
                        'longBreakDuration',
                        parseInt(e.target.value) || 15
                      )
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
              </div>
            </section>

            {/* Session Settings */}
            <section>
              <h2 className='text-xl font-semibold text-gray-700 mb-4'>
                Session Settings
              </h2>
              <div>
                <label className='block text-sm font-medium text-gray-600 mb-2'>
                  Sessions until Long Break
                </label>
                <input
                  type='number'
                  min='2'
                  max='8'
                  value={settings.sessionsUntilLongBreak}
                  onChange={(e) =>
                    handleDurationChange(
                      'sessionsUntilLongBreak',
                      parseInt(e.target.value) || 4
                    )
                  }
                  className='w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            </section>

            {/* Auto-start Settings */}
            <section>
              <h2 className='text-xl font-semibold text-gray-700 mb-4'>
                Auto-start
              </h2>
              <div className='space-y-4'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={settings.autoStartBreaks}
                    onChange={(e) =>
                      handleToggleChange('autoStartBreaks', e.target.checked)
                    }
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='ml-2 text-sm text-gray-600'>
                    Auto-start breaks
                  </span>
                </label>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={settings.autoStartWork}
                    onChange={(e) =>
                      handleToggleChange('autoStartWork', e.target.checked)
                    }
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='ml-2 text-sm text-gray-600'>
                    Auto-start work sessions
                  </span>
                </label>
              </div>
            </section>

            {/* Sound Settings */}
            <section>
              <h2 className='text-xl font-semibold text-gray-700 mb-4'>
                Sound
              </h2>
              <div className='space-y-4'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={settings.soundEnabled}
                    onChange={(e) =>
                      handleToggleChange('soundEnabled', e.target.checked)
                    }
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <span className='ml-2 text-sm text-gray-600'>
                    Enable sound notifications
                  </span>
                </label>
                {settings.soundEnabled && (
                  <div>
                    <label className='block text-sm font-medium text-gray-600 mb-2'>
                      Volume: {Math.round(settings.soundVolume * 100)}%
                    </label>
                    <input
                      type='range'
                      min='0'
                      max='1'
                      step='0.1'
                      value={settings.soundVolume}
                      onChange={(e) =>
                        handleDurationChange(
                          'soundVolume',
                          parseFloat(e.target.value)
                        )
                      }
                      className='w-full max-w-xs'
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
