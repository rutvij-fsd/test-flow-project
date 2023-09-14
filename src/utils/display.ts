import { Graph } from 'graphlib';
import { Occurrence } from './types';

export function displayResults(occurrences: Occurrence[]): void {
    console.log("Occurrences of the identifier:\n");

    occurrences.forEach(occurrence => {
        console.log(`- File: ${occurrence.file}`);
        console.log(`  Function: ${occurrence.function}`);
        console.log(`  Location: Line ${occurrence.location.start.line}, Column ${occurrence.location.start.column}`);
        console.log(`  Code Block:\n${occurrence.codeBlock}\n`);
    });
}

export function displayGraphWithCode(graph: Graph): void {
    for (let occurrence of occurrences) {
        if (occurrence.function !== "Global/Outside Function") {
            let functionUsages = await analyzeFunctionUsage(occurrence.function);
            functionUsages.forEach(usage => {
                g.setEdge(occurrence.file, usage.file, usage.callCode);
            });
        }
    }
}
