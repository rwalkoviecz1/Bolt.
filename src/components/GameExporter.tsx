import React from 'react';
import { Combination } from '../types/lottery';

interface GameExporterProps {
  games: Combination[];
  onExport: () => void;
}

export const GameExporter: React.FC<GameExporterProps> = ({
  games,
  onExport
}) => {
  const handleExport = () => {
    const content = games.map((game, idx) => 
      `Jogo ${idx + 1}: ${game.numbers.join(' - ')} | Probabilidade: ${(game.probability * 100).toFixed(2)}%`
    ).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jogos-gerados.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onExport();
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={handleExport}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        Exportar Jogos
      </button>
    </div>
  );
};