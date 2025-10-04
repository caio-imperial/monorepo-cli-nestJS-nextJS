import { Command } from "commander";
import inquirer from "inquirer";
import { main } from "../index.js";
import { getPrismaModels } from "../utils/prisma-utils.js";

export function interactiveCommand() {
  return new Command("interactive")
    .description("Modo interativo para gerar módulos NestJS")
    .action(async () => {
      const models = getPrismaModels();
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "model",
          message: "Selecione o model para gerar:",
          choices: models,
        },
        {
          type: "confirm",
          name: "crud",
          message: "Deseja gerar rotas CRUD?",
          default: false,
        },
      ]);

      await main(answers.model, { crud: answers.crud });
    });
}
