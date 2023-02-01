import { renderD3 } from "../visualizer/d3";
import { AsyncApiPortalResponse, Graph } from "../types/main";

export async function process(
  asyncApisAsYaml: string[],
  parser?: (yaml: string[]) => Promise<Graph>
  // TODO: renderer: Map<string, (Graph) => any>
): Promise<AsyncApiPortalResponse> {
  let graph: Graph;
  if (parser) {
    graph = await parser(asyncApisAsYaml);
  } else if (window.asyncApiPortal?.parser) {
    const firstFoundParser = Object.entries(window.asyncApiPortal.parser)[0];
    console.log("No parser specified. Found parser: " + firstFoundParser[0]);
    graph = await firstFoundParser[1](asyncApisAsYaml);
  } else {
    const message = "No parser defined. Stopping";
    alert(message);
    throw new Error(message);
  }

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
