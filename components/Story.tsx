
import React, { useRef, useEffect, useState } from 'react';
import { Story as StoryType } from '../types';
import AnalysisPanel from './AnalysisPanel';
import { InfoIcon, MessageCircleIcon } from './icons/InfoIcon';

interface StoryProps {
  story: StoryType;
  isActive: boolean;
}

const Story: React.FC<StoryProps> = ({ story, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isActive) {
        videoElement.play().catch(error => {
          console.log('Video autoplay was prevented:', error);
          // Autoplay was prevented, we might need a user interaction to start it.
        });
      } else {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    }
  }, [isActive]);

  return (
    <div className="relative h-full w-full bg-black">
      <video
        ref={videoRef}
        src={story.videoUrl}
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      <div className="absolute bottom-0 left-0 w-full p-4 text-white">
        <h2 className="text-xl font-bold">{story.title}</h2>
        <p className="text-sm text-gray-300">{story.source}</p>
      </div>

      <div className="absolute right-4 bottom-24 flex flex-col space-y-4">
        <button
          onClick={() => setIsPanelOpen(true)}
          className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <InfoIcon />
          <span className="text-xs mt-1">Analysis</span>
        </button>
      </div>
      
      <AnalysisPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        story={story}
      />
    </div>
  );
};

export default Story;
