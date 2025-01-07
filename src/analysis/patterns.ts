import { LotteryData } from '../types/lottery';

export interface PatternAnalysis {
  frequency: { absolute: number; relative: number };
  recurrencePeriods: number[];
  consecutiveSequences: number[];
  decadeDistribution: Record<string, number>;
  parityDistribution: { even: number; odd: number };
  sumDistribution: number;
}

export const analyzePatterns = (data: LotteryData[]): Map<number, PatternAnalysis> => {
  const patterns = new Map<number, PatternAnalysis>();
  const totalGames = data.length;

  // Initialize number patterns
  for (let num = 1; num <= 60; num++) {
    patterns.set(num, {
      frequency: { absolute: 0, relative: 0 },
      recurrencePeriods: [],
      consecutiveSequences: [],
      decadeDistribution: {},
      parityDistribution: { even: 0, odd: 0 },
      sumDistribution: 0
    });
  }

  // Analyze patterns
  data.forEach((game, index) => {
    game.numbers.forEach(num => {
      const pattern = patterns.get(num)!;
      
      // Update frequency
      pattern.frequency.absolute++;
      pattern.frequency.relative = pattern.frequency.absolute / totalGames;

      // Update decade distribution
      const decade = Math.floor((num - 1) / 10) * 10 + 1;
      pattern.decadeDistribution[decade] = (pattern.decadeDistribution[decade] || 0) + 1;

      // Update parity
      if (num % 2 === 0) {
        pattern.parityDistribution.even++;
      } else {
        pattern.parityDistribution.odd++;
      }

      // Update sum distribution
      pattern.sumDistribution += game.numbers.reduce((a, b) => a + b, 0);
    });
  });

  return patterns;
};