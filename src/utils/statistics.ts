import { LotteryData, GameStatistics, Combination } from '../types/lottery';

export const calculateGameStatistics = (data: LotteryData[]): GameStatistics => {
  const totalGames = data.length;
  let evenCount = 0;
  let oddCount = 0;
  
  // Calculate even/odd distribution
  data.forEach(game => {
    const evenNumbers = game.numbers.filter(n => n % 2 === 0).length;
    evenCount += evenNumbers;
    oddCount += game.numbers.length - evenNumbers;
  });

  // Calculate sequence frequencies
  const sequences = {
    doubles: findFrequentSequences(data, 2),
    triples: findFrequentSequences(data, 3),
    quadruples: findFrequentSequences(data, 4),
    quintuples: findFrequentSequences(data, 5),
    sextuples: findFrequentSequences(data, 6)
  };

  // Calculate sum distribution
  const sums = data.map(game => game.numbers.reduce((a, b) => a + b, 0));
  const sumDistribution = {
    min: Math.min(...sums),
    max: Math.max(...sums),
    average: sums.reduce((a, b) => a + b, 0) / sums.length
  };

  return {
    evenOddDistribution: {
      even: evenCount,
      odd: oddCount,
      totalGames
    },
    sequenceFrequencies: sequences,
    sumDistribution
  };
};

const findFrequentSequences = (data: LotteryData[], size: number): Combination[] => {
  const sequences = new Map<string, number>();
  
  data.forEach(game => {
    const numbers = game.numbers;
    for (let i = 0; i <= numbers.length - size; i++) {
      const combination = numbers.slice(i, i + size).sort((a, b) => a - b);
      const key = combination.join(',');
      sequences.set(key, (sequences.get(key) || 0) + 1);
    }
  });

  return Array.from(sequences.entries())
    .map(([key, frequency]) => ({
      numbers: key.split(',').map(Number),
      frequency,
      probability: frequency / data.length
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);
};