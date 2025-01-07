import { LotteryData } from '../../types/lottery';

export interface MarkovChain {
  transitions: Map<string, Map<string, number>>;
  probabilities: Map<string, Map<string, number>>;
}

export const buildMarkovChain = (data: LotteryData[]): MarkovChain => {
  const transitions = new Map<string, Map<string, number>>();
  const probabilities = new Map<string, Map<string, number>>();

  // Build transition matrix
  for (let i = 0; i < data.length - 1; i++) {
    const currentState = data[i].numbers.join(',');
    const nextState = data[i + 1].numbers.join(',');

    if (!transitions.has(currentState)) {
      transitions.set(currentState, new Map());
    }

    const stateTransitions = transitions.get(currentState)!;
    stateTransitions.set(
      nextState,
      (stateTransitions.get(nextState) || 0) + 1
    );
  }

  // Calculate probabilities
  transitions.forEach((stateTransitions, state) => {
    const totalTransitions = Array.from(stateTransitions.values())
      .reduce((sum, count) => sum + count, 0);

    const stateProbabilities = new Map<string, number>();
    stateTransitions.forEach((count, nextState) => {
      stateProbabilities.set(nextState, count / totalTransitions);
    });

    probabilities.set(state, stateProbabilities);
  });

  return { transitions, probabilities };
};