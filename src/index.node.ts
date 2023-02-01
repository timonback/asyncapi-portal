import * as path from "path";
import fs from "fs/promises";
import { getFileContentInFolder, writeToFile } from "./config";
import { process } from "./processor";
import { renderD3Html as renderD3HtmlBrowser } from "./visualizer/d3/htmlRenderer.browser";
import { renderD3Html as renderD3HtmlNode } from "./visualizer/d3/htmlRenderer.node";
import { processAsyncApiFiles } from "./parser/asyncapi";

const asyncApiFileBasePath = path.join(__dirname, "..", "assets", "asyncapi");
const defaultParser = processAsyncApiFiles;
const outputPath = path.join(__dirname, "..", "output");
const graphPath = path.join(outputPath, "graph.json");
const visualizerD3DynamicFetch = path.join(
  __dirname,
  "..",
  "output",
  "visualizer.d3.dynamicFetch.html"
);
const visualizerD3Static = path.join(
  __dirname,
  "..",
  "output",
  "visualizer.d3.static.html"
);

(async () => {
  const asyncApisAsYaml = await getFileContentInFolder(asyncApiFileBasePath);

  const graph = await process(asyncApisAsYaml, defaultParser);

  await writeToFile(graphPath, JSON.stringify(graph, undefined, 2));
  await writeToFile(visualizerD3DynamicFetch, await renderD3HtmlBrowser());
  await writeToFile(
    visualizerD3Static,
    await renderD3HtmlNode(graph.plugins.renderer.d3!!.graph)
  );

  await fs.cp(asyncApiFileBasePath, path.join(outputPath, "asyncapifiles"), {
    recursive: true,
    preserveTimestamps: true,
  });
})();
