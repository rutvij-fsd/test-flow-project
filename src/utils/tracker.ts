import { fetchRepoFiles, isValidFile } from './utils';
import { analyzeFile, analyzeFunctionUsage } from './codeAnalysis';
import { Graph } from 'graphlib';
import { Occurrence } from './types';

export async function findOccurrences(searchString: string, path = ""): Promise<Occurrence[]> {
  const repoContent = await fetchRepoFiles(path);
    const allPromises = repoContent.map(item => processItem(item, searchString));
    const allResults = await Promise.all(allPromises);
    return allResults.flat();
}

export async function processOccurrences(occurrences: Occurrence[]): Promise<Graph> {
  const g = new Graph();
    for (let occurrence of occurrences) {
      if (occurrence.function !== "Global/Outside Function") {
          let functionUsages = await analyzeFunctionUsage(occurrence.function);
          functionUsages.forEach(usage => {
              g.setEdge(occurrence.file, usage.file, usage.callCode);
          });
      }
  }
  return g;
}
