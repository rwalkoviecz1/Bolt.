import React from 'react';
import { AnalysisConfig } from '../types/lottery';

interface ConfigProps {
  config: AnalysisConfig;
  onConfigChange: (config: AnalysisConfig) => void;
}

export const AnalysisConfigForm: React.FC<ConfigProps> = ({ config, onConfigChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onConfigChange({
      ...config,
      [name]: parseInt(value, 10)
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Configuração da Análise</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número de Jogos
          </label>
          <input
            type="number"
            name="numberOfGames"
            value={config.numberOfGames}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Números por Jogo
          </label>
          <input
            type="number"
            name="numbersPerGame"
            value={config.numbersPerGame}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número Inicial
          </label>
          <input
            type="number"
            name="startNumber"
            value={config.startNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número Final
          </label>
          <input
            type="number"
            name="endNumber"
            value={config.endNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};