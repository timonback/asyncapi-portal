import { processAsyncApiFiles } from "./parser/asyncapi";
import { renderD3, VisualizerD3Result } from "./visualizer/d3";
import { Graph } from "./types/main";

interface AsyncApiPortalResponse {
  graph: Graph;
  plugins: {
    visualizer: {
      d3: VisualizerD3Result;
    };
  };
}

export async function main(
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
