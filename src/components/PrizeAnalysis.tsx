import React, { useState } from 'react';
import { GameHistory, PrizeConfig } from '../types/lottery';

interface PrizeAnalysisProps {
  gameHistory: GameHistory[];
  config: PrizeConfig;
  onConfigChange: (config: PrizeConfig) => void;
}

export const PrizeAnalysis: React.FC<PrizeAnalysisProps> = ({
  gameHistory,
  config,
  onConfigChange
}) => {
  const [considerZeroMatches, setConsiderZeroMatches] = useState(false);

  const handleMinMatchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onConfigChange({
      ...config,
      minMatches: parseInt(e.target.value, 10)
    });
  };

  const handleZeroMatchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsiderZeroMatches(e.target.checked);
    onConfigChange({
      ...config,
      considerZeroMatches: e.target.checked
    });
  };

  const qualifyingGames = gameHistory.filter(game => 
    game.matches >= config.minMatches || 
    (config.considerZeroMatches && game.matches === 0)
  );

  const totalPrize = qualifyingGames.reduce((sum, game) => 
    sum + (game.prize || 0), 0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Análise de Premiação</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mínimo de Acertos
            <input
              type="number"
              min="0"
              max="6"
              value={config.minMatches}
              onChange={handleMinMatchesChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={considerZeroMatches}
              onChange={handleZeroMatchesChange}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">
              Considerar 0 Acertos
            </span>
          </label>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Resumo de Premiações</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Jogos Qualificados</div>
              <div className="text-xl font-bold">{qualifyingGames.length}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Premiação Total</div>
              <div className="text-xl font-bold">
                R$ {totalPrize.toFixed(2)}
              </div>
            </div>
          </div>

          <table className="w-full mt-4">
            <thead>
              <tr className="text-left text-sm text-gray-600">
                <th className="py-2">Acertos</th>
                <th className="py-2">Quantidade</th>
                <th className="py-2">Premiação</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4, 5, 6].map(matches => {
                const gamesWithMatches = gameHistory.filter(
                  game => game.matches === matches
                );
                const matchPrize = gamesWithMatches.reduce(
                  (sum, game) => sum + (game.prize || 0),
                  0
                );

                return (
                  <tr key={matches} className="border-t border-gray-100">
                    <td className="py-2">{matches}</td>
                    <td className="py-2">{gamesWithMatches.length}</td>
                    <td className="py-2">
                      {matchPrize > 0 ? `R$ ${matchPrize.toFixed(2)}` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};