import { getFileContentInFolder, writeToFile } from "./config";
import { renderD3Html as renderD3HtmlBrowser } from "./visualizer/d3/htmlRenderer.browser";
import { renderD3Html as renderD3HtmlNode } from "./visualizer/d3/htmlRenderer.node";
import { main } from "./main";

export async function mainNode(
  asyncApiFileBasePath: string,
  graphPath: string,
  visualizerD3BrowserNode: string,
  visualizerD3HtmlNode: string
) {
  const asyncApisAsYaml = await getFileContentInFolder(asyncApiFileBasePath);

  const graph = await main(asyncApisAsYaml);

  await writeToFile(graphPath, JSON.stringify(graph, undefined, 2));
  await writeToFile(visualizerD3BrowserNode, await renderD3HtmlBrowser());
  await writeToFile(
    visualizerD3HtmlNode,
    await renderD3HtmlNode(graph.plugins.visualizer.d3.graph)
  );
}
