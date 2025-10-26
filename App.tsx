
import React from 'react';
import StoryFeed from './components/StoryFeed';
import { stories } from './data/mock';

const App: React.FC = () => {
  return (
    <div className="bg-black h-screen w-screen font-sans">
      <header className="absolute top-0 left-0 w-full p-4 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="text-2xl font-bold text-white text-center">Aletheia AI News</h1>
      </header>
      <StoryFeed stories={stories} />
    </div>
  );
};

export default App;
