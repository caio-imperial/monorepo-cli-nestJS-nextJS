import { Command } from "commander";
import { main } from "../index.js";

export function makeCommand() {
  return new Command("make")
    .description("Gera módulo NestJS")
    .argument("<model>", "nome do módulo")
    .option("--crud", "gera rotas CRUD")
    .action((model, options) => main(model, options));
}
