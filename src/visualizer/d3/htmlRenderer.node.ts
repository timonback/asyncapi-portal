import { D3Graph } from "./index";
import fs from "fs/promises";
import * as path from "path";

export async function renderD3Html(graph: D3Graph): Promise<string> {
  let template = (
    await fs.readFile(path.join(__dirname, "htmlRenderer.template.node.html"))
  ).toString();

  const jsCode = (
    await fs.readFile(path.join(__dirname, "htmlRenderer.template.node.js"))
  ).toString();
  const cssCode = (
    await fs.readFile(path.join(__dirname, "htmlRenderer.template.css"))
  ).toString();

  const data = JSON.stringify(graph, undefined, 2);

  template = template.replace('"PLACEHOLDER-CODE"', jsCode);
  template = template.replace('"PLACEHOLDER-DATA"', data);
  template = template.replace('"PLACEHOLDER-CSS"', cssCode);

  return template;
}
