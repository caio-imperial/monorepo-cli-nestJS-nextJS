import fs from "fs";
import path from "path";
import { loadCliConfig } from "./config-utils.js";

/**
 * Mapeia tipos do Prisma para TypeScript
 */
const typeMap = {
  Int: "number",
  String: "string",
  Boolean: "boolean",
  DateTime: "Date",
  Float: "number",
  Decimal: "number",
  Json: "any",
  // Adicione outros tipos que você usa
};

/**
 * Retorna o nomes dos models.
 */
export function getPrismaModels() {
  const { prismaPath } = loadCliConfig();
  const schemaPath = path.resolve(prismaPath, "schema.prisma");

  if (!fs.existsSync(schemaPath)) {
    console.error("❌ Arquivo schema.prisma não encontrado.");
    process.exit(1);
  }

  const content = fs.readFileSync(schemaPath, "utf-8");
  const modelMatches = [...content.matchAll(/^model\s+(\w+)/gm)];
  const models = modelMatches.map((m) => m[1]);

  if (models.length === 0) {
    console.log("⚠️  Nenhum model encontrado no schema.prisma");
  }

  return models;
}

/**
 * Retorna os campos do model com nome, tipo TS e opcionalidade
 */
export function getModelFields(modelName) {
  const { prismaPath = "prisma" } = loadCliConfig();
  const schemaPath = path.resolve(prismaPath, "schema.prisma");

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`❌ schema.prisma não encontrado em: ${schemaPath}`);
  }

  const content = fs.readFileSync(schemaPath, "utf-8");

  // Captura o bloco do model
  const modelMatch = content.match(
    new RegExp(`model\\s+${modelName}\\s+{([\\s\\S]*?)}`)
  );
  if (!modelMatch) return [];

  const fieldsRaw = modelMatch[1]
    .split("\n")
    .map((f) => f.trim())
    .filter((f) => f && !f.startsWith("//"))
    .filter((f) => {
      const trimmed = f.trim();

      // Ignorar linhas que contêm @relation (objetos de relação)
      if (trimmed.includes('@relation')) {
        return false;
      }

      // Ignorar constraints e anotações especiais do Prisma (@@unique, @@index, etc.)
      if (trimmed.startsWith('@@')) {
        return false;
      }

      // Ignorar arrays de modelos (ex: orders Order[])
      // Mas manter arrays primitivos (String[], Int[], etc.)
      const [fieldName, fieldType] = trimmed.split(/\s+/);
      if (fieldType && fieldType.endsWith('[]')) {
        const baseType = fieldType.slice(0, -2);
        const primitiveTypes = ['String', 'Int', 'Float', 'Boolean', 'DateTime', 'Decimal'];
        if (!primitiveTypes.includes(baseType)) {
          return false; // É um array de modelo, ignorar
        }
      }

      return true;
    });

  const fields = fieldsRaw.map((f) => {
    // Captura name e type (considerando arrays e opcionalidade)
    const [name, typeRaw] = f.split(/\s+/);
    let type = typeRaw;

    let isOptional = false;

    // Detecta array []
    if (type.endsWith("[]")) {
      type = type.slice(0, -2);
    }

    // Detecta tipo opcional `?`
    if (type.endsWith("?")) {
      type = type.slice(0, -1);
      isOptional = true;
    }

    // Converte tipo Prisma para TypeScript
    const tsType = typeMap[type] || type; // se for outro model, mantem como está

    return {
      name,
      type: tsType + (f.endsWith("[]") ? "[]" : ""),
      prismaType: type, // Original Prisma type for filter config
      optional: isOptional,
    };
  });

  return fields;
}

/**
 * Mostra o nomes dos models.
 */
export function listPrismaModels() {
  const models = getPrismaModels()

  if (models.length === 0) {
    console.log("⚠️  Nenhum model encontrado no schema.prisma");
  } else {
    console.log("📦  Models Prisma encontrados:");
    models.forEach((m) => console.log(" -", m));
  }
}
