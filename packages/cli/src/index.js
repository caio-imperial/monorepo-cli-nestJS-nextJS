import path from "path";
import { ensureDir, writeFile } from "./utils/fs-utils.js";
import { renderTemplate } from "./utils/template-utils.js";
import { capitalize, toKebabCase } from "./utils/string-utils.js";
import { loadCliConfig } from "./utils/config-utils.js";
import { getModelFields } from "./utils/prisma-utils.js";

export async function main(name, options = {}) {
  const config = loadCliConfig();
  
  const basePath = config.basePath || "src";
  const baseDir = path.join( basePath, name);
  await ensureDir(baseDir);

  const context = {
    name,
    className: capitalize(name),
    crud: options.crud || false,
    fields: await getModelFields(name),
  };

  const templates = ["controller", "service", "module", "dto", "entity"];

  for (const type of templates) {
    const content = renderTemplate(type, context);
    const fileName = `${toKebabCase(name)}.${type}.ts`
    const filePath = path.join(baseDir, fileName);
    await writeFile(filePath, content);
    console.log(`✅ CRUD para "${name}" gerado em ${fileName}`);
  }
}
