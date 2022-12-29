import * as path from "path";
import { mainNode } from "./main.node";
import fs from "fs/promises";

const asyncApiFileBasePath = path.join(__dirname, "..", "assets", "asyncapi");
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
  await mainNode(
    asyncApiFileBasePath,
    graphPath,
    visualizerD3DynamicFetch,
    visualizerD3Static
  );

  await fs.cp(asyncApiFileBasePath, path.join(outputPath, "asyncapifiles"), {
    recursive: true,
    preserveTimestamps: true,
  });
})();
