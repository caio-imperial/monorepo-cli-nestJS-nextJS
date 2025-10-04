import fs from "fs";
import path from "path";

export async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
}

export async function writeFile(filePath, content) {
  await fs.promises.writeFile(filePath, content.trimStart());
}
