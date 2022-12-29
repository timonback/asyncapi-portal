import * as fs from "fs/promises";
import * as path from "path";

export async function getFilesInFolder(basePath: string): Promise<string[]> {
  const files = await fs.readdir(basePath, {});
  return files.map((file) => basePath + path.sep + file);
}

export async function getFileContentInFolder(
  basePath: string
): Promise<string[]> {
  return (
    await Promise.all(
      (
        await getFilesInFolder(basePath)
      ).map((filepath) => fs.readFile(filepath))
    )
  ).map((buffer) => buffer.toString());
}

export async function writeToFile(filepath: string, content: string) {
  await fs.writeFile(filepath, content);
}
