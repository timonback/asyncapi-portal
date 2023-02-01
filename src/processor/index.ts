import { renderD3 } from "../visualizer/d3";
import { AsyncApiPortalResponse, Graph } from "../types/main";

export async function process(
  asyncApisAsYaml: string[],
  parser: (yaml: string[]) => Promise<Graph>
  // TODO: renderer: Map<string, (Graph) => any>
): Promise<AsyncApiPortalResponse> {
  const graph = await parser(asyncApisAsYaml);
  const d3Result = await renderD3(graph);
  return {
    graph,
    plugins: {
      renderer: {
        d3: d3Result,
      },
    },
  };
}
