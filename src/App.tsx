import { useState } from 'react';
import Analytics from './components/Analytics/Analytics';
import History from './components/History/History';
import Navigation from './components/Layout/Navigation';
import Settings from './components/Settings/Settings';
import Timer from './components/Timer/Timer';
import type { AppView } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('timer');

  const renderView = () => {
    switch (currentView) {
      case 'timer':
        return <Timer />;
      case 'settings':
        return <Settings />;
      case 'analytics':
        return <Analytics />;
      case 'history':
        return <History />;
      default:
        return <Timer />;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {renderView()}
    </div>
  );
}

export default App;
