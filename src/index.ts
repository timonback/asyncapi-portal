import * as path from "path";
import { main } from "./main";

const asyncApiFileBasePath = path.join(__dirname, "..", "assets", "asyncapi");
const graphPath = path.join(__dirname, "..", "output", "graph.json");
const htmlD3Path = path.join(__dirname, "..", "output", "d3.html");

(async () => {
  console.log("start");
  await main(asyncApiFileBasePath, graphPath, htmlD3Path);
  console.log("end");
})();
