import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { loadCliConfig } from './config-utils.js';

/**
 * Renderiza um template Handlebars do projeto atual.
 */
export function renderTemplate(templateName, context) {
  const { templatesPath } = loadCliConfig();
  const templatePath = path.resolve(templatesPath, `${templateName}.hbs`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`❌ Template não encontrado: ${templatePath}`);
  }

  const source = fs.readFileSync(templatePath, 'utf-8');
  const template = Handlebars.compile(source);
  return template(context);
}
