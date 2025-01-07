import React from 'react';
import { Combination } from '../types/lottery';

interface CombinationsListProps {
  combinations: Combination[];
}

export const CombinationsList: React.FC<CombinationsListProps> = ({ combinations }) => {
  if (combinations.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Melhores Combinações Sugeridas
      </h3>
      
      <div className="space-y-4">
        {combinations.map((combo, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {combo.numbers.map(num => (
                  <span
                    key={num}
                    className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold"
                  >
                    {num}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <div>Frequência: {combo.frequency}</div>
                <div>Probabilidade: {(combo.probability * 100).toFixed(2)}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};