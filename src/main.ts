import { getFilesInFolder, writeToFile } from "./config";
import { processAsyncApiFiles } from "./parser/asyncapi";
import { renderD3Html } from "./visualizer/d3";

export async function main(
  asyncApiFileBasePath: string,
  graphPath: string,
  htmlD3Path: string
) {
  const files = await getFilesInFolder(asyncApiFileBasePath);

  const graph = await processAsyncApiFiles(files);
  await writeToFile(graphPath, JSON.stringify(graph, undefined, 2));

  await renderD3Html(graph, htmlD3Path);
}
