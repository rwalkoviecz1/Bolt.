import { LotteryData, MonteCarloSimulation } from '../types/lottery';

export const runMonteCarloSimulation = (
  numbers: number[],
  historicalData: LotteryData[],
  iterations: number = 1000000
): MonteCarloSimulation => {
  const matchDistribution: Record<number, number> = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
  };

  let totalWins = 0;
  let totalPrize = 0;

  for (let i = 0; i < iterations; i++) {
    const drawnNumbers = generateRandomDraw();
    const matches = countMatches(numbers, drawnNumbers);
    matchDistribution[matches]++;
    
    if (matches >= 4) {
      totalWins++;
      totalPrize += calculatePrize(matches);
    }
  }

  return {
    numbers,
    winProbability: totalWins / iterations,
    expectedPrize: totalPrize / iterations,
    matchDistribution
  };
};

const generateRandomDraw = (): number[] => {
  const numbers: number[] = [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * 60) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
};

const countMatches = (game: number[], draw: number[]): number => {
  return game.filter(num => draw.includes(num)).length;
};

const calculatePrize = (matches: number): number => {
  switch (matches) {
    case 6: return 1000000; // Example values
    case 5: return 50000;
    case 4: return 1000;
    default: return 0;
  }
};