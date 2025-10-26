
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Story from './Story';
import { Story as StoryType } from '../types';

interface StoryFeedProps {
  stories: StoryType[];
}

const StoryFeed: React.FC<StoryFeedProps> = ({ stories }) => {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(stories.length > 0 ? stories[0].id : null);
  const feedRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
        const storyId = entry.target.getAttribute('data-story-id');
        setActiveStoryId(storyId);
      }
    });
  }, []);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(handleIntersection, {
      root: feedRef.current,
      rootMargin: '0px',
      threshold: 0.7,
    });

    const currentObserver = observer.current;
    
    if (feedRef.current) {
      const storyElements = feedRef.current.querySelectorAll('.story-container');
      storyElements.forEach(el => currentObserver.observe(el));
    }

    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [stories, handleIntersection]);

  return (
    <div 
      ref={feedRef}
      className="h-full w-full overflow-y-auto snap-y snap-mandatory"
    >
      {stories.map(story => (
        <div 
          key={story.id} 
          data-story-id={story.id}
          className="story-container h-full w-full snap-start flex-shrink-0"
        >
          <Story story={story} isActive={story.id === activeStoryId} />
        </div>
      ))}
    </div>
  );
};

export default StoryFeed;
