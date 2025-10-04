#!/usr/bin/env node
import { Command } from "commander";
import { makeCommand } from "./src/commands/make.js";
import { interactiveCommand } from "./src/commands/interactive.js";
import { dbCommand } from "./src/commands/db.js";

const program = new Command();

program
  .name("nestgen")
  .description("CLI para gerar módulos NestJS")
  .version("0.1.0");

program.addCommand(makeCommand());
program.addCommand(interactiveCommand());
program.addCommand(dbCommand());

program.parse();
