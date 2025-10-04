import { Command } from "commander";
import { listPrismaModels } from "../utils/prisma-utils.js";

export function dbCommand() {
  return new Command("db")
    .description("Comandos relacionados ao Prisma")
    .command("list")
    .description("Lista todos os models do schema.prisma")
    .action(() => {
      listPrismaModels();
    });
}