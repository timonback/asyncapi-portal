import { getFileContentInFolder, writeToFile } from "./config";
import { processAsyncApiFiles } from "./parser/asyncapi";
import { Graph } from "./types/main";
import { renderD3, VisualizerD3Result } from "./visualizer/d3";

interface AsyncApiPortalResponse {
  graph: Graph;
  plugins: {
    visualizer: {
      d3: VisualizerD3Result;
    };
  };
}

async function main(
  asyncApisAsYaml: string[]
): Promise<AsyncApiPortalResponse> {
  const graph = await processAsyncApiFiles(asyncApisAsYaml);
  const d3Result = await renderD3(graph);
  return {
    graph,
    plugins: {
      visualizer: {
        d3: d3Result,
      },
    },
  };
}

export async function mainWrapper(
  asyncApiFileBasePath: string,
  graphPath: string,
  htmlD3Path: string
) {
  const asyncApisAsYaml = await getFileContentInFolder(asyncApiFileBasePath);

  const graph = await main(asyncApisAsYaml);

  await writeToFile(graphPath, JSON.stringify(graph, undefined, 2));
  await writeToFile(htmlD3Path, graph.plugins.visualizer.d3.html);
}
