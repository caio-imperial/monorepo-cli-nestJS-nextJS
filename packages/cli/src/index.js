import path from "path";
import fs from "fs";
import { ensureDir, writeFile } from "./utils/fs-utils.js";
import { renderTemplate } from "./utils/template-utils.js";
import { capitalize, toKebabCase, toCamelCase, toSnakeCase, toPascalCase } from "./utils/string-utils.js";
import { loadCliConfig } from "./utils/config-utils.js";
import { getModelFields } from "./utils/prisma-utils.js";

export async function main(name, options = {}) {
  const config = loadCliConfig();

  const basePath = config.basePath;
  const baseDir = path.join(basePath, toKebabCase(name));
  const commonTypesDir = path.join(basePath, "common", "types");
  const commonUtilsDir = path.join(basePath, "common", "utils");

  // Ensure directories exist
  await ensureDir(baseDir);
  await ensureDir(commonTypesDir);
  await ensureDir(commonUtilsDir);

  const context = {
    name: {
      normal: name,
      toKebabCase: toKebabCase(name),
      capitalize: capitalize(name),
      toPascalCase: toPascalCase(name),
      toSnakeCase: toSnakeCase(name),
      toCamelCase: toCamelCase(name)
    },
    className: capitalize(name),
    crud: options.crud || false,
    fields: await getModelFields(name),
  };

  // Create common pagination types file if it doesn't exist
  const paginationTypesPath = path.join(commonTypesDir, "pagination.ts");
  if (!fs.existsSync(paginationTypesPath)) {
    const paginationTypesContent = `export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}`;
    await writeFile(paginationTypesPath, paginationTypesContent);
    console.log(`✅ common pagination types criado em common/types/pagination.ts`);
  }

  // Create common filter types file if it doesn't exist
  const filterTypesPath = path.join(commonTypesDir, "filter.types.ts");
  if (!fs.existsSync(filterTypesPath)) {
    const filterTypesContent = renderTemplate("filter.types", context);
    await writeFile(filterTypesPath, filterTypesContent);
    console.log(`✅ common filter types criado em common/types/filter.types.ts`);
  }

  // Create common filter utils file if it doesn't exist
  const filterUtilsPath = path.join(commonUtilsDir, "filter.utils.ts");
  if (!fs.existsSync(filterUtilsPath)) {
    const filterUtilsContent = renderTemplate("filter.utils", context);
    await writeFile(filterUtilsPath, filterUtilsContent);
    console.log(`✅ common filter utils criado em common/utils/filter.utils.ts`);
  }

  const templates = ["controller", "service", "repository", "module", "dto"];

  for (const type of templates) {
    const content = renderTemplate(type, context);
    const fileName = `${toKebabCase(name)}.${type}.ts`
    const filePath = path.join(baseDir, fileName);
    await writeFile(filePath, content);
    console.log(`✅ ${type} para "${name}" gerado em ${fileName}`);
  }
}
