import React from 'react';
import { NumberStatistics } from '../types/lottery';

interface StatisticsPopupProps {
  statistics: NumberStatistics;
  isOpen: boolean;
  onClose: () => void;
}

export const StatisticsPopup: React.FC<StatisticsPopupProps> = ({
  statistics,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Estatísticas Detalhadas</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Frequência</h4>
            <p>Absoluta: {statistics.frequency.absolute}</p>
            <p>Relativa: {(statistics.frequency.relative * 100).toFixed(2)}%</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Dormência</h4>
            <p>Atual: {statistics.dormancyPeriods.current}</p>
            <p>Média: {statistics.dormancyPeriods.average.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Correlações</h4>
            <div className="grid grid-cols-3 gap-2">
              {statistics.correlations.map((corr, idx) => (
                <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                  {corr.number}: {(corr.strength * 100).toFixed(1)}%
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Padrões</h4>
            <ul className="list-disc list-inside space-y-1">
              {statistics.patterns.map((pattern, idx) => (
                <li key={idx} className="text-sm">{pattern}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};