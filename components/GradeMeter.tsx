
import React from 'react';
import { DRGrade } from '../types';

interface GradeMeterProps {
  grade: DRGrade;
}

const GradeMeter: React.FC<GradeMeterProps> = ({ grade }) => {
  const percentage = (grade / 4) * 100;
  
  const getColor = () => {
    if (grade === 0) return 'bg-green-500';
    if (grade === 1) return 'bg-yellow-400';
    if (grade === 2) return 'bg-orange-500';
    if (grade === 3) return 'bg-red-500';
    return 'bg-red-700';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">
        <span>No DR 0</span>
        <span>Mild 1</span>
        <span>Moderate 2</span>
        <span>Severe 3</span>
        <span>Proliferative 4</span>
      </div>
      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden relative">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${getColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
        {/* Needle indicator */}
        <div 
          className="absolute top-0 w-1 h-6 bg-slate-900 border-x border-white shadow-md transform -translate-y-1"
          style={{ left: `calc(${percentage}% - 2px)` }}
        />
      </div>
    </div>
  );
};

export default GradeMeter;
