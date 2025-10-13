import fs from 'fs';
import path from 'path';

/**
 * Lê e valida o arquivo cli.config.json no diretório do projeto.
 */
export function loadCliConfig() {
  const projectRoot = process.cwd();
  const configPath = path.join(projectRoot, 'cli.config.json');

  if (!fs.existsSync(configPath)) {
    throw new Error(`❌ Arquivo cli.config.json não encontrado em: ${projectRoot}`);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  // Normaliza caminhos relativos
  const basePath = path.resolve(projectRoot, config.basePath || 'src');
  const templatesPath = config.templatesPath
    ? path.resolve(projectRoot, config.templatesPath)
    : path.resolve(import.meta.dirname, '../templates');
  const prismaPath = path.resolve(projectRoot, config.prismaPath || './prisma');
  return { projectRoot, basePath, templatesPath, prismaPath };
}
