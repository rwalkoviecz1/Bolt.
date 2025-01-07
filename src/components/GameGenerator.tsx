import React, { useState, useEffect } from 'react';
import { NumberScore } from '../analysis/scoring';
import { Combination } from '../types/lottery';
import { validateCombination } from '../analysis/validation/combinationValidator';
import { performDBSCANClustering } from '../analysis/machinelearning/clustering';
import { buildMarkovChain } from '../analysis/machinelearning/markov';
import { trainSVMModel, predictWithSVM } from '../analysis/machinelearning/svm';

interface GameGeneratorProps {
  scores: NumberScore[];
  config: {
    numberOfGames: number;
    numbersPerGame: number;
    probabilityThreshold: number;
  };
  onGamesGenerated: (games: Combination[]) => void;
}

export const GameGenerator: React.FC<GameGeneratorProps> = ({
  scores,
  config,
  onGamesGenerated
}) => {
  const [selectedLevels, setSelectedLevels] = useState<NumberScore['level'][]>([]);
  const [useMonteCarlo, setUseMonteCarlo] = useState(false);
  const [probabilityThreshold, setProbabilityThreshold] = useState(config.probabilityThreshold);

  const handleLevelToggle = (level: NumberScore['level']) => {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const monteCarloSimulation = (numbers: number[], threshold: number) => {
    let probability = Math.random();
    return probability >= threshold;
  };

  const generateGames = () => {
    if (selectedLevels.length === 0) return;

    const eligibleNumbers = scores
      .filter(score => selectedLevels.includes(score.level))
      .sort((a, b) => b.totalScore - a.totalScore);

    const games: Combination[] = [];
    
    for (let i = 0; i < config.numberOfGames; i++) {
      const gameNumbers = [];
      const availableNumbers = [...eligibleNumbers];

      // Generate combinations
      for (let j = 0; j < config.numbersPerGame; j++) {
        if (availableNumbers.length === 0) break;

        const index = Math.floor(Math.random() * availableNumbers.length);
        const selected = availableNumbers.splice(index, 1)[0];
        gameNumbers.push(selected.number);
      }

      // Apply Monte Carlo if enabled
      if (useMonteCarlo && !monteCarloSimulation(gameNumbers, probabilityThreshold)) {
        continue;
      }

      // Add game with its characteristics
      if (gameNumbers.length === config.numbersPerGame) {
        const game: Combination = {
          numbers: gameNumbers.sort((a, b) => a - b),
          frequency: Math.round(
            gameNumbers.reduce((sum, num) => {
              const score = scores.find(s => s.number === num);
              return sum + (score?.totalScore || 0);
            }, 0) * 100 / config.numbersPerGame
          ),
          probability: gameNumbers.reduce((sum, num) => {
            const score = scores.find(s => s.number === num);
            return sum + (score?.totalScore || 0);
          }, 0) / config.numbersPerGame
        };

        games.push(game);
      }
    }

    onGamesGenerated(games.sort((a, b) => b.probability - a.probability));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Gerador de Jogos</h2>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(['very-high', 'high', 'medium', 'low', 'very-low'] as const).map(level => (
            <button
              key={level}
              onClick={() => handleLevelToggle(level)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedLevels.includes(level)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level === 'very-high' ? 'Muito Alto' :
               level === 'high' ? 'Alto' :
               level === 'medium' ? 'Médio' :
               level === 'low' ? 'Baixo' :
               'Muito Baixo'}
            </button>
          ))}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={useMonteCarlo}
            onChange={(e) => setUseMonteCarlo(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Usar simulação de Monte Carlo</label>
        </div>

        <button
          onClick={generateGames}
          disabled={selectedLevels.length === 0}
          className={`w-full py-2 rounded-lg font-medium transition-colors ${
            selectedLevels.length > 0
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Gerar {config.numberOfGames} Jogos
        </button>
      </div>
    </div>
  );
};