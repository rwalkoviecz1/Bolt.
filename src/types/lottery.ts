// Adicionar aos tipos existentes
export interface NumberStatistics {
  frequency: {
    absolute: number;
    relative: number;
  };
  dormancyPeriods: {
    current: number;
    average: number;
    history: number[];
  };
  correlations: Array<{
    number: number;
    strength: number;
  }>;
  patterns: string[];
}

export interface OptimizedGame extends Combination {
  score: number;
  validationResult: ValidationResult;
}