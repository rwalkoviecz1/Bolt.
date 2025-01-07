import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { NumberFrequency } from '../types/lottery';
import { calculateCombinationScore } from '../utils/analysis';

interface NumberGridProps {
  frequencies: NumberFrequency[];
  selectedNumbers: number[];
  onNumberSelect: (number: number) => void;
  startNumber: number;
  endNumber: number;
}

type HeatLevel = 'very-high' | 'high' | 'medium' | 'low' | 'very-low' | null;

export const NumberGrid: React.FC<NumberGridProps> = ({
  frequencies,
  selectedNumbers,
  onNumberSelect,
  startNumber,
  endNumber
}) => {
  const [activeHeatLevel, setActiveHeatLevel] = useState<HeatLevel>(null);

  const getHeatMapColor = (score: number): string => {
    if (score > 0.8) return 'bg-red-500';
    if (score > 0.6) return 'bg-orange-400';
    if (score > 0.4) return 'bg-yellow-300';
    if (score > 0.2) return 'bg-green-200';
    return 'bg-gray-100';
  };

  const getHeatLevel = (score: number): HeatLevel => {
    if (score > 0.8) return 'very-high';
    if (score > 0.6) return 'high';
    if (score > 0.4) return 'medium';
    if (score > 0.2) return 'low';
    return 'very-low';
  };

  const numberScores = useMemo(() => {
    if (selectedNumbers.length === 0) return new Map<number, number>();
    
    const scores = new Map<number, number>();
    const lastSelected = selectedNumbers[selectedNumbers.length - 1];
    
    for (let i = startNumber; i <= endNumber; i++) {
      if (!selectedNumbers.includes(i)) {
        const score = calculateCombinationScore(
          [...selectedNumbers, i],
          frequencies,
          lastSelected
        );
        scores.set(i, score);
      }
    }
    
    return scores;
  }, [selectedNumbers, frequencies, startNumber, endNumber]);

  const isNumberEnabled = (number: number): boolean => {
    if (!activeHeatLevel) return true;
    if (selectedNumbers.includes(number)) return true;
    
    const score = numberScores.get(number) || 0;
    return getHeatLevel(score) === activeHeatLevel;
  };

  const handleHeatLevelClick = (level: HeatLevel) => {
    setActiveHeatLevel(activeHeatLevel === level ? null : level);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Seleção de Números</h2>
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: endNumber - startNumber + 1 }, (_, i) => {
          const number = startNumber + i;
          const isSelected = selectedNumbers.includes(number);
          const score = numberScores.get(number) || 0;
          const enabled = isNumberEnabled(number);

          return (
            <button
              key={number}
              onClick={() => enabled && onNumberSelect(number)}
              disabled={!enabled}
              className={classNames(
                'w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all transform hover:scale-105',
                {
                  'ring-2 ring-blue-500 bg-blue-500 text-white': isSelected,
                  [getHeatMapColor(score)]: !isSelected && selectedNumbers.length > 0,
                  'bg-gray-100 hover:bg-gray-200': !isSelected && selectedNumbers.length === 0,
                  'opacity-30 cursor-not-allowed': !enabled && !isSelected,
                  'text-gray-900': !isSelected
                }
              )}
            >
              {number}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 grid grid-cols-5 gap-2">
        <button
          className={classNames("text-center cursor-pointer transition-all", {
            'ring-2 ring-gray-500 rounded': activeHeatLevel === 'very-high'
          })}
          onClick={() => handleHeatLevelClick('very-high')}
        >
          <div className="w-full h-2 bg-red-500 rounded"></div>
          <span className="text-xs">Muito Alto</span>
        </button>
        <button
          className={classNames("text-center cursor-pointer transition-all", {
            'ring-2 ring-gray-500 rounded': activeHeatLevel === 'high'
          })}
          onClick={() => handleHeatLevelClick('high')}
        >
          <div className="w-full h-2 bg-orange-400 rounded"></div>
          <span className="text-xs">Alto</span>
        </button>
        <button
          className={classNames("text-center cursor-pointer transition-all", {
            'ring-2 ring-gray-500 rounded': activeHeatLevel === 'medium'
          })}
          onClick={() => handleHeatLevelClick('medium')}
        >
          <div className="w-full h-2 bg-yellow-300 rounded"></div>
          <span className="text-xs">Médio</span>
        </button>
        <button
          className={classNames("text-center cursor-pointer transition-all", {
            'ring-2 ring-gray-500 rounded': activeHeatLevel === 'low'
          })}
          onClick={() => handleHeatLevelClick('low')}
        >
          <div className="w-full h-2 bg-green-200 rounded"></div>
          <span className="text-xs">Baixo</span>
        </button>
        <button
          className={classNames("text-center cursor-pointer transition-all", {
            'ring-2 ring-gray-500 rounded': activeHeatLevel === 'very-low'
          })}
          onClick={() => handleHeatLevelClick('very-low')}
        >
          <div className="w-full h-2 bg-gray-100 rounded"></div>
          <span className="text-xs">Muito Baixo</span>
        </button>
      </div>
    </div>
  );
};