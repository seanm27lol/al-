
import React from 'react';
import { Claim } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface FactCheckProps {
  claims: Claim[];
}

const getIconForStatus = (status: Claim['verification']) => {
  switch (status) {
    case 'Verified':
      return <CheckCircleIcon className="text-green-400" />;
    case 'Misleading':
      return <AlertTriangleIcon className="text-yellow-400" />;
    case 'Unverified':
      return <XCircleIcon className="text-red-400" />;
    default:
      return null;
  }
};

const FactCheck: React.FC<FactCheckProps> = ({ claims }) => {
  return (
    <div className="space-y-4">
      {claims.map((item, index) => (
        <div key={index} className="bg-gray-800 p-3 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">{getIconForStatus(item.verification)}</div>
            <div>
              <p className="font-semibold text-sm">"{item.claim}"</p>
              <p className="text-xs text-gray-400 mt-1">{item.reasoning}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FactCheck;
