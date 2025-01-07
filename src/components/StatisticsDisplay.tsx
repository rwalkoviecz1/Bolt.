import React from 'react';
import { GameStatistics } from '../types/lottery';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface StatisticsDisplayProps {
  statistics: GameStatistics;
}

export const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({ statistics }) => {
  const evenOddData = [
    { name: 'Pares', value: statistics.evenOddDistribution.even },
    { name: 'Ímpares', value: statistics.evenOddDistribution.odd }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Análise Estatística</h2>
      
      <div className="space-y-6">
        {/* Even/Odd Distribution */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Distribuição Pares/Ímpares</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evenOddData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sequence Analysis */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Sequências mais Frequentes</h3>
          
          <div className="space-y-4">
            {Object.entries(statistics.sequenceFrequencies).map(([key, sequences]) => (
              <div key={key} className="space-y-2">
                <h4 className="font-medium text-gray-700 capitalize">
                  {key === 'doubles' ? 'Duplas' :
                   key === 'triples' ? 'Trios' :
                   key === 'quadruples' ? 'Quadras' :
                   key === 'quintuples' ? 'Quinas' :
                   'Senas'}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {sequences.slice(0, 5).map((seq, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex gap-2 mb-2">
                        {seq.numbers.map(num => (
                          <span
                            key={num}
                            className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold"
                          >
                            {num}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Frequência: {seq.frequency}</div>
                        <div>Prob: {(seq.probability * 100).toFixed(2)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sum Distribution */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Distribuição da Soma</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Mínima</div>
              <div className="text-xl font-bold">{statistics.sumDistribution.min}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Média</div>
              <div className="text-xl font-bold">
                {statistics.sumDistribution.average.toFixed(1)}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Máxima</div>
              <div className="text-xl font-bold">{statistics.sumDistribution.max}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};