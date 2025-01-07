import { LotteryData } from '../types/lottery';

export interface NumberCorrelation {
  number: number;
  correlations: Map<number, number>;
  distances: number[];
  quadrantAnalysis: Record<string, number>;
}

export const analyzeCorrelations = (data: LotteryData[]): Map<number, NumberCorrelation> => {
  const correlations = new Map<number, NumberCorrelation>();

  // Initialize correlations for all numbers
  for (let num = 1; num <= 60; num++) {
    correlations.set(num, {
      number: num,
      correlations: new Map(),
      distances: [],
      quadrantAnalysis: {}
    });
  }

  // Analyze correlations
  data.forEach(game => {
    game.numbers.forEach((num1, i) => {
      const numCorr = correlations.get(num1)!;

      // Analyze pair correlations
      game.numbers.forEach((num2, j) => {
        if (i !== j) {
          const current = numCorr.correlations.get(num2) || 0;
          numCorr.correlations.set(num2, current + 1);
        }
      });

      // Calculate distances between consecutive numbers
      if (i < game.numbers.length - 1) {
        numCorr.distances.push(game.numbers[i + 1] - num1);
      }

      // Analyze quadrants (divide board into 4 regions)
      const quadrant = getQuadrant(num1);
      numCorr.quadrantAnalysis[quadrant] = (numCorr.quadrantAnalysis[quadrant] || 0) + 1;
    });
  });

  return correlations;
};

const getQuadrant = (number: number): string => {
  const row = Math.ceil(number / 10);
  const col = number % 10 === 0 ? 10 : number % 10;
  
  if (row <= 3) {
    return col <= 5 ? 'Q1' : 'Q2';
  } else {
    return col <= 5 ? 'Q3' : 'Q4';
  }
};