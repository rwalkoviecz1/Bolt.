import { LotteryData } from '../../types/lottery';

export interface Cluster {
  centroid: number[];
  points: number[][];
  strength: number;
}

export const performDBSCANClustering = (
  data: LotteryData[],
  epsilon: number = 5,
  minPoints: number = 3
): Cluster[] => {
  const points = data.map(game => game.numbers);
  const clusters: Cluster[] = [];
  const visited = new Set<string>();

  points.forEach((point, idx) => {
    if (visited.has(point.toString())) return;
    
    const neighbors = findNeighbors(point, points, epsilon);
    if (neighbors.length >= minPoints) {
      const cluster: Cluster = {
        centroid: calculateCentroid(neighbors),
        points: neighbors,
        strength: neighbors.length / points.length
      };
      clusters.push(cluster);
    }
    
    visited.add(point.toString());
  });

  return clusters;
};

const findNeighbors = (
  point: number[],
  points: number[][],
  epsilon: number
): number[][] => {
  return points.filter(p => 
    calculateDistance(point, p) <= epsilon
  );
};

const calculateDistance = (p1: number[], p2: number[]): number => {
  return Math.sqrt(
    p1.reduce((sum, val, idx) => 
      sum + Math.pow(val - p2[idx], 2), 0
    )
  );
};

const calculateCentroid = (points: number[][]): number[] => {
  const dimensions = points[0].length;
  const centroid = new Array(dimensions).fill(0);
  
  points.forEach(point => {
    point.forEach((val, idx) => {
      centroid[idx] += val;
    });
  });
  
  return centroid.map(sum => sum / points.length);
};