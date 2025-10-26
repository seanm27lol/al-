
import React from 'react';

interface BiasMeterProps {
  score: number;
}

const BiasMeter: React.FC<BiasMeterProps> = ({ score }) => {
  const percentage = ((score + 10) / 20) * 100;
  
  let label = 'Neutral';
  if (score < -2) label = 'Left Leaning';
  if (score < -7) label = 'Strongly Left';
  if (score > 2) label = 'Right Leaning';
  if (score > 7) label = 'Strongly Right';
  
  return (
    <div className="w-full bg-gray-800 p-3 rounded-lg">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Left</span>
        <span className="font-semibold text-white">{label}</span>
        <span>Right</span>
      </div>
      <div className="w-full h-4 bg-gradient-to-r from-blue-500 via-gray-400 to-red-500 rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `calc(${percentage}% - 2px)` }}
        />
      </div>
    </div>
  );
};

export default BiasMeter;
