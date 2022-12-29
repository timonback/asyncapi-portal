import fs from "fs/promises";
import * as path from "path";

export async function renderD3Html(): Promise<string> {
  return (
    await fs.readFile(
      path.join(__dirname, "htmlRenderer.template.browser.html")
    )
  ).toString();
}
