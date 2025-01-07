import { LotteryData } from '../types/lottery';

export interface TemporalAnalysis {
  dormancyPeriods: number[];
  repetitionCycles: number[];
  averageTimeBetweenAppearances: number;
  lastAppearance: number;
}

export const analyzeTemporalPatterns = (data: LotteryData[]): Map<number, TemporalAnalysis> => {
  const temporal = new Map<number, TemporalAnalysis>();

  // Initialize temporal analysis for all numbers
  for (let num = 1; num <= 60; num++) {
    temporal.set(num, {
      dormancyPeriods: [],
      repetitionCycles: [],
      averageTimeBetweenAppearances: 0,
      lastAppearance: 0
    });
  }

  // Analyze temporal patterns
  data.forEach((game, gameIndex) => {
    for (let num = 1; num <= 60; num++) {
      const analysis = temporal.get(num)!;
      
      if (game.numbers.includes(num)) {
        // Calculate dormancy period
        const dormancyPeriod = gameIndex - analysis.lastAppearance;
        if (analysis.lastAppearance > 0) {
          analysis.dormancyPeriods.push(dormancyPeriod);
        }
        analysis.lastAppearance = gameIndex;
      }
    }
  });

  // Calculate averages and cycles
  temporal.forEach(analysis => {
    if (analysis.dormancyPeriods.length > 0) {
      analysis.averageTimeBetweenAppearances = 
        analysis.dormancyPeriods.reduce((a, b) => a + b, 0) / analysis.dormancyPeriods.length;
    }
  });

  return temporal;
};