import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { NumberGrid } from './components/NumberGrid';
import { AnalysisConfigForm } from './components/AnalysisConfig';
import { CombinationsList } from './components/CombinationsList';
import { StatisticsDisplay } from './components/StatisticsDisplay';
import { LotteryData, AnalysisConfig, NumberFrequency, Combination, GameStatistics } from './types/lottery';
import { calculateNumberFrequencies, findBestCombinations } from './utils/analysis';
import { calculateGameStatistics } from './utils/statistics';

function App() {
  const [lotteryData, setLotteryData] = useState<LotteryData[]>([]);
  const [frequencies, setFrequencies] = useState<NumberFrequency[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [bestCombinations, setBestCombinations] = useState<Combination[]>([]);
  const [statistics, setStatistics] = useState<GameStatistics | null>(null);
  const [config, setConfig] = useState<AnalysisConfig>({
    numberOfGames: 10,
    numbersPerGame: 6,
    startNumber: 1,
    endNumber: 60
  });

  const handleDataLoaded = (data: LotteryData[]) => {
    setLotteryData(data);
    const freqs = calculateNumberFrequencies(data);
    setFrequencies(freqs);
    const stats = calculateGameStatistics(data);
    setStatistics(stats);
  };

  const handleNumberSelect = (number: number) => {
    const newSelected = selectedNumbers.includes(number)
      ? selectedNumbers.filter(n => n !== number)
      : [...selectedNumbers, number];
    
    setSelectedNumbers(newSelected);

    if (newSelected.length >= config.numbersPerGame) {
      const combinations = findBestCombinations(
        newSelected,
        frequencies,
        config.numbersPerGame
      );
      setBestCombinations(combinations);
    } else {
      setBestCombinations([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Sistema de Análise Lotérica
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <FileUpload onDataLoaded={handleDataLoaded} />
            <AnalysisConfigForm
              config={config}
              onConfigChange={setConfig}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {frequencies.length > 0 && (
              <>
                <NumberGrid
                  frequencies={frequencies}
                  selectedNumbers={selectedNumbers}
                  onNumberSelect={handleNumberSelect}
                  startNumber={config.startNumber}
                  endNumber={config.endNumber}
                />
                <CombinationsList combinations={bestCombinations} />
                {statistics && <StatisticsDisplay statistics={statistics} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;