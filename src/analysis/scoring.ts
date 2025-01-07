import { PatternAnalysis } from './patterns';
import { NumberCorrelation } from './correlations';
import { TemporalAnalysis } from './temporal';

export interface NumberScore {
  number: number;
  totalScore: number;
  level: 'very-high' | 'high' | 'medium' | 'low' | 'very-low';
  components: {
    frequency: number;
    dormancy: number;
    correlation: number;
    pattern: number;
    trend: number;
  };
}

const WEIGHTS = {
  frequency: 0.3,
  dormancy: 0.25,
  correlation: 0.2,
  pattern: 0.15,
  trend: 0.1
};

export const calculateNumberScore = (
  number: number,
  patterns: PatternAnalysis,
  correlations: NumberCorrelation,
  temporal: TemporalAnalysis
): NumberScore => {
  // Calculate component scores
  const frequencyScore = patterns.frequency.relative;
  const dormancyScore = calculateDormancyScore(temporal);
  const correlationScore = calculateCorrelationScore(correlations);
  const patternScore = calculatePatternScore(patterns);
  const trendScore = calculateTrendScore(temporal);

  // Calculate weighted total score
  const totalScore = 
    frequencyScore * WEIGHTS.frequency +
    dormancyScore * WEIGHTS.dormancy +
    correlationScore * WEIGHTS.correlation +
    patternScore * WEIGHTS.pattern +
    trendScore * WEIGHTS.trend;

  return {
    number,
    totalScore,
    level: getScoreLevel(totalScore),
    components: {
      frequency: frequencyScore,
      dormancy: dormancyScore,
      correlation: correlationScore,
      pattern: patternScore,
      trend: trendScore
    }
  };
};

const calculateDormancyScore = (temporal: TemporalAnalysis): number => {
  if (temporal.dormancyPeriods.length === 0) return 0;
  const lastDormancy = temporal.dormancyPeriods[temporal.dormancyPeriods.length - 1];
  return Math.exp(-lastDormancy / temporal.averageTimeBetweenAppearances);
};

const calculateCorrelationScore = (correlations: NumberCorrelation): number => {
  let totalCorrelations = 0;
  correlations.correlations.forEach(value => {
    totalCorrelations += value;
  });
  return totalCorrelations / (60 * 6); // Normalize by maximum possible correlations
};

const calculatePatternScore = (patterns: PatternAnalysis): number => {
  const evenOddBalance = Math.min(
    patterns.parityDistribution.even,
    patterns.parityDistribution.odd
  ) / Math.max(
    patterns.parityDistribution.even,
    patterns.parityDistribution.odd
  );
  return evenOddBalance;
};

const calculateTrendScore = (temporal: TemporalAnalysis): number => {
  const recentDormancy = temporal.dormancyPeriods.slice(-5);
  if (recentDormancy.length === 0) return 0;
  
  const trend = recentDormancy.reduce((a, b) => a + b, 0) / recentDormancy.length;
  return Math.exp(-trend / 10); // Normalize trend score
};

const getScoreLevel = (score: number): NumberScore['level'] => {
  if (score > 0.8) return 'very-high';
  if (score > 0.6) return 'high';
  if (score > 0.4) return 'medium';
  if (score > 0.2) return 'low';
  return 'very-low';
};