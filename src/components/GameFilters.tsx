import React from 'react';
import { NumberScore } from '../analysis/scoring';

interface GameFiltersProps {
  scores: NumberScore[];
  selectedLevels: NumberScore['level'][];
  onLevelSelect: (levels: NumberScore['level'][]) => void;
}

export const GameFilters: React.FC<GameFiltersProps> = ({
  scores,
  selectedLevels,
  onLevelSelect
}) => {
  const handleLevelToggle = (level: NumberScore['level']) => {
    onLevelSelect(
      selectedLevels.includes(level)
        ? selectedLevels.filter(l => l !== level)
        : [...selectedLevels, level]
    );
  };

  const getLevelCount = (level: NumberScore['level']) => {
    return scores.filter(score => score.level === level).length;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Filtros</h2>
      
      <div className="space-y-4">
        {(['very-high', 'high', 'medium', 'low', 'very-low'] as const).map(level => (
          <button
            key={level}
            onClick={() => handleLevelToggle(level)}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
              selectedLevels.includes(level)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>
              {level === 'very-high' ? 'Muito Alto' :
               level === 'high' ? 'Alto' :
               level === 'medium' ? 'Médio' :
               level === 'low' ? 'Baixo' :
               'Muito Baixo'}
            </span>
            <span className="bg-opacity-20 bg-black px-2 py-1 rounded-full text-xs">
              {getLevelCount(level)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};