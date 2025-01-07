import { LotteryData, NumberFrequency, Combination } from '../types/lottery';

export const calculateNumberFrequencies = (data: LotteryData[]): NumberFrequency[] => {
  const frequencies = new Map<number, { count: number, sum: number }>();
  const totalGames = data.length;
  
  data.forEach(draw => {
    const sum = draw.numbers.reduce((a, b) => a + b, 0);
    draw.numbers.forEach(num => {
      const current = frequencies.get(num) || { count: 0, sum: 0 };
      frequencies.set(num, {
        count: current.count + 1,
        sum: current.sum + sum
      });
    });
  });

  return Array.from(frequencies.entries()).map(([number, data]) => ({
    number,
    frequency: data.count,
    probability: data.count / totalGames,
    isEven: number % 2 === 0,
    averageSum: data.sum / data.count
  }));
};

export const calculateCombinationScore = (
  numbers: number[],
  frequencies: NumberFrequency[],
  selectedNumber: number
): number => {
  const freqMap = new Map(frequencies.map(f => [f.number, f]));
  const selectedFreq = freqMap.get(selectedNumber)!;
  
  // Pontuação baseada em padrões
  let score = 0;
  
  // 1. Frequência e probabilidade
  const avgProb = numbers.reduce((sum, num) => {
    const freq = freqMap.get(num)!;
    return sum + freq.probability;
  }, 0) / numbers.length;
  score += avgProb * 0.4; // 40% do peso

  // 2. Balanceamento par/ímpar
  const evenCount = numbers.filter(n => n % 2 === 0).length;
  const evenRatio = evenCount / numbers.length;
  const balanceScore = 1 - Math.abs(0.5 - evenRatio);
  score += balanceScore * 0.2; // 20% do peso

  // 3. Soma próxima à média do número selecionado
  const sum = numbers.reduce((a, b) => a + b, 0);
  const sumDiff = Math.abs(sum - selectedFreq.averageSum);
  const sumScore = 1 - (sumDiff / selectedFreq.averageSum);
  score += Math.max(0, sumScore) * 0.2; // 20% do peso

  // 4. Distância entre números
  const sortedNumbers = [...numbers].sort((a, b) => a - b);
  const gaps = sortedNumbers.slice(1).map((n, i) => n - sortedNumbers[i]);
  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const gapScore = 1 - (Math.abs(avgGap - 8) / 8); // Ideal gap ~8
  score += Math.max(0, gapScore) * 0.2; // 20% do peso

  return score;
};

export const findBestCombinations = (
  selectedNumbers: number[],
  frequencies: NumberFrequency[],
  numbersPerGame: number
): Combination[] => {
  if (selectedNumbers.length < numbersPerGame) return [];

  const combinations: Combination[] = [];
  const freqMap = new Map(frequencies.map(f => [f.number, f]));

  const getCombinations = (arr: number[], size: number): number[][] => {
    if (size === 1) return arr.map(n => [n]);
    const result: number[][] = [];
    for (let i = 0; i <= arr.length - size; i++) {
      const first = arr[i];
      const rest = getCombinations(arr.slice(i + 1), size - 1);
      rest.forEach(combo => result.push([first, ...combo]));
    }
    return result;
  };

  const possibleCombinations = getCombinations(selectedNumbers, numbersPerGame);
  
  possibleCombinations.forEach(combo => {
    const score = calculateCombinationScore(combo, frequencies, combo[0]);
    combinations.push({
      numbers: combo,
      frequency: Math.round(score * 100),
      probability: score
    });
  });

  return combinations.sort((a, b) => b.probability - a.probability).slice(0, 10);
};