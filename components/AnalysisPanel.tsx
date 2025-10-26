
import React, { useState, useEffect } from 'react';
import { Story, Analysis } from '../types';
import { analyzeStory } from '../services/geminiService';
import BiasMeter from './BiasMeter';
import FactCheck from './FactCheck';
import Chat from './Chat';
import { LoaderIcon } from './icons/LoaderIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface AnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story;
}

type ActiveTab = 'analysis' | 'qa';

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ isOpen, onClose, story }) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('analysis');

  useEffect(() => {
    if (isOpen && !analysis && !isLoading) {
      const fetchAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await analyzeStory(story.transcript);
          setAnalysis(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [isOpen, story.transcript, analysis, isLoading]);

  const panelClasses = `
    fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 text-white
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    shadow-lg z-50 flex flex-col
  `;

  return (
    <div className={panelClasses}>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-bold">AI Insights</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <XCircleIcon />
        </button>
      </div>

      <div className="p-4 border-b border-gray-700">
        <div className="flex space-x-2">
            <button onClick={() => setActiveTab('analysis')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'analysis' ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'}`}>Analysis</button>
            <button onClick={() => setActiveTab('qa')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'qa' ? 'bg-indigo-600' : 'bg-gray-800 hover:bg-gray-700'}`}>Q&A</button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full">
            <LoaderIcon className="animate-spin h-10 w-10 text-indigo-400" />
            <p className="mt-4 text-gray-400">Analyzing story...</p>
          </div>
        )}
        {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-lg">{error}</div>}
        {analysis && (
          <>
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-300 mb-2">Perspective</h4>
                  <p className="text-sm text-gray-400 bg-gray-800 p-3 rounded-lg">{analysis.perspective}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-300 mb-2">Bias Analysis</h4>
                  <BiasMeter score={analysis.bias.score} />
                  <p className="text-sm text-gray-400 mt-2 bg-gray-800 p-3 rounded-lg">{analysis.bias.summary}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-300 mb-2">Fact Check</h4>
                  <FactCheck claims={analysis.claims} />
                </div>
              </div>
            )}
            {activeTab === 'qa' && (
              <Chat transcript={story.transcript} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
