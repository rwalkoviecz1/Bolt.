import React, { useState } from 'react';
import { NumberScore } from '../analysis/scoring';
import { Combination } from '../types/lottery';
import { validateCombination } from '../analysis/validation/combinationValidator';

interface OptimizedGameGeneratorProps {
  scores: NumberScore[];
  selectedNumbers: number[];
  config: {
    numbersPerGame: number;
    numberOfGames: number;
  };
  onGamesGenerated: (games: Combination[]) => void;
}

export const OptimizedGameGenerator: React.FC<OptimizedGameGeneratorProps> = ({
  scores,
  selectedNumbers,
  config,
  onGamesGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOptimizedGames = () => {
    setIsGenerating(true);
    
    try {
      const optimizedGames: Combination[] = [];
      const availableNumbers = [...selectedNumbers];

      for (let i = 0; i < config.numberOfGames; i++) {
        const gameNumbers: number[] = [];
        const tempNumbers = [...availableNumbers];

        // Selecionar números otimizados
        while (gameNumbers.length < config.numbersPerGame && tempNumbers.length > 0) {
          const bestNumber = findBestNumber(tempNumbers, gameNumbers, scores);
          if (bestNumber) {
            gameNumbers.push(bestNumber);
            tempNumbers.splice(tempNumbers.indexOf(bestNumber), 1);
          }
        }

        if (gameNumbers.length === config.numbersPerGame) {
          const game: Combination = {
            numbers: gameNumbers.sort((a, b) => a - b),
            frequency: calculateFrequency(gameNumbers, scores),
            probability: calculateProbability(gameNumbers, scores)
          };

          optimizedGames.push(game);
        }
      }

      onGamesGenerated(optimizedGames.sort((a, b) => b.probability - a.probability));
    } finally {
      setIsGenerating(false);
    }
  };

  const findBestNumber = (
    available: number[],
    current: number[],
    scores: NumberScore[]
  ): number | null => {
    let bestNumber = null;
    let bestScore = -1;

    for (const num of available) {
      const tempCombination = [...current, num];
      const score = calculateCombinationScore(tempCombination, scores);
      
      if (score > bestScore) {
        bestScore = score;
        bestNumber = num;
      }
    }

    return bestNumber;
  };

  const calculateCombinationScore = (
    numbers: number[],
    scores: NumberScore[]
  ): number => {
    const scoreSum = numbers.reduce((sum, num) => {
      const score = scores.find(s => s.number === num);
      return sum + (score?.totalScore || 0);
    }, 0);

    return scoreSum / numbers.length;
  };

  const calculateFrequency = (
    numbers: number[],
    scores: NumberScore[]
  ): number => {
    return Math.round(
      numbers.reduce((sum, num) => {
        const score = scores.find(s => s.number === num);
        return sum + (score?.components.frequency || 0);
      }, 0) * 100 / numbers.length
    );
  };

  const calculateProbability = (
    numbers: number[],
    scores: NumberScore[]
  ): number => {
    return numbers.reduce((sum, num) => {
      const score = scores.find(s => s.number === num);
      return sum + (score?.totalScore || 0);
    }, 0) / numbers.length;
  };

  return (
    <div className="mt-6">
      <button
        onClick={generateOptimizedGames}
        disabled={isGenerating || selectedNumbers.length < config.numbersPerGame}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          isGenerating || selectedNumbers.length < config.numbersPerGame
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isGenerating ? 'Gerando...' : 'Gerar Jogos Otimizados'}
      </button>
    </div>
  );
};