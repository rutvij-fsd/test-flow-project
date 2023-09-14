import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { fetchRepoFiles, isValidFile } from './utils';
import { Occurrence, FunctionUsage } from './types';

type PluginName = "jsx" | "typescript"; // Add more plugin names as needed

const AST_PARSE_CONFIG: {
  sourceType: "module" | "script" | "unambiguous";
  plugins: PluginName[];
} = {
  sourceType: "module",
  plugins: ["jsx", "typescript"]
};


export async function analyzeFile(filePath: string, searchString: string): Promise<Occurrence[]> {
  const fileContentOrItems = await fetchRepoFiles(filePath);

    if (typeof fileContentOrItems !== 'string') {
        console.error(`Expected file content but received a list of items for path: ${filePath}`);
        return [];
    }

    const ast = parse(fileContentOrItems, AST_PARSE_CONFIG);

    let occurrences = [];
    traverse(ast, {
        Identifier(path) {
            if (path.node.name === searchString) {
                let functionName = "Global/Outside Function";
                let parentFunction = path.findParent((p) => p.isFunctionDeclaration() || p.isArrowFunctionExpression() || p.isFunctionExpression());

                if (parentFunction && parentFunction.node.id) {
                    functionName = parentFunction.node.id.name;
                }

                let codeBlock = "";
                let enclosingStatement = path.findParent((p) => p.isStatement());
                if (enclosingStatement) {
                    codeBlock = fileContent.split('\n').slice(enclosingStatement.node.loc.start.line - 1, enclosingStatement.node.loc.end.line).join('\n');
                }
                let declaration = path.findParent((p) => p.isFunctionDeclaration() || p.isImportDeclaration() || p.isVariableDeclaration());
                if (declaration) {
                    let declarationCode = fileContent.split('\n').slice(declaration.node.loc.start.line - 1, declaration.node.loc.end.line).join('\n');
                    occurrences.push({
                        type: path.type,
                        location: path.node.loc,
                        file: filePath,
                        function: functionName,
                        codeBlock: codeBlock,
                        declaration: declarationCode
                    });
                }
            }
        }
    });

    return occurrences;
}

export async function analyzeFunctionUsage(functionName: string): Promise<FunctionUsage[]> {
  const repoContent = await fetchRepoFiles();
    let functionUsages = [];
    for (let item of repoContent) {
        if (item.type === "file" && isValidFile(item.name)) {
            const fileContent = await fetchRepoFiles(item.path);
            const ast = parser.parse(fileContent, AST_PARSE_CONFIG);
            
            traverse(ast, {
                CallExpression(path) {
                    if (path.node.callee.name === functionName) {
                        let callCode = fileContent.split('\n').slice(path.node.loc.start.line - 1, path.node.loc.end.line).join('\n');
                        functionUsages.push({
                            file: item.path,
                            location: path.node.loc,
                            callCode: callCode
                        });
                    }
                }
            });
        }
    }

    return functionUsages;
}
