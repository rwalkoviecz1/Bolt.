import { Combination } from '../../types/lottery';

export interface ValidationResult {
  isValid: boolean;
  score: number;
  reasons: string[];
}

export const validateCombination = (
  combination: Combination,
  historicalGames: Combination[]
): ValidationResult => {
  const reasons: string[] = [];
  let score = 1.0;

  // Check similarity with historical games
  const similarityScore = checkHistoricalSimilarity(combination, historicalGames);
  if (similarityScore > 0.8) {
    reasons.push('Combinação muito similar a jogos anteriores');
    score *= 0.8;
  }

  // Check spatial distribution
  const spatialScore = checkSpatialDistribution(combination.numbers);
  if (spatialScore < 0.6) {
    reasons.push('Distribuição espacial dos números não é ideal');
    score *= spatialScore;
  }

  // Check mathematical patterns
  const patternScore = checkMathematicalPatterns(combination.numbers);
  if (patternScore < 0.7) {
    reasons.push('Padrões matemáticos não ideais');
    score *= patternScore;
  }

  return {
    isValid: score >= 0.6,
    score,
    reasons
  };
};

const checkHistoricalSimilarity = (
  combination: Combination,
  historicalGames: Combination[]
): number => {
  const similarities = historicalGames.map(game => {
    const commonNumbers = game.numbers.filter(n => 
      combination.numbers.includes(n)
    );
    return commonNumbers.length / combination.numbers.length;
  });

  return Math.max(...similarities);
};

const checkSpatialDistribution = (numbers: number[]): number => {
  const dezenas = Array(6).fill(0);
  numbers.forEach(n => {
    const dezena = Math.floor((n - 1) / 10);
    dezenas[dezena]++;
  });

  const idealDistribution = numbers.length / 6;
  const deviations = dezenas.map(count => 
    Math.abs(count - idealDistribution)
  );

  return 1 - (Math.max(...deviations) / numbers.length);
};

const checkMathematicalPatterns = (numbers: number[]): number => {
  const sum = numbers.reduce((a, b) => a + b, 0);
  const mean = sum / numbers.length;
  const deviations = numbers.map(n => Math.abs(n - mean));
  const avgDeviation = deviations.reduce((a, b) => a + b, 0) / numbers.length;

  return 1 - (avgDeviation / mean);