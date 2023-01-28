import fs from "fs/promises";
import * as path from "path";

export async function renderD3Html(): Promise<string> {
  let template = (
    await fs.readFile(
      path.join(__dirname, "htmlRenderer.template.browser.html")
    )
  ).toString();

  const cssCode = (
    await fs.readFile(path.join(__dirname, "htmlRenderer.template.css"))
  ).toString();

  template = template.replace('"PLACEHOLDER-CSS"', cssCode);

  return template;
}
