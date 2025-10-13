/**
 * Capitaliza a primeira letra de uma string.
 *
 * @param {string} str - A string que será capitalizada.
 * @returns {string} - Retorna a string com a primeira letra em maiúscula e o restante inalterado.
 *
 * @example
 * capitalize("user"); // Retorna "User"
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


/**
 * Converte uma string para kebab-case (nome-nome)
 * @param {string} str
 * @returns {string}
 * @example
 * toKebabCase("NomeNome") // "nome-nome"
 */
export function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2") // separa camelCase
    .replace(/\s+/g, "-") // espaços para "-"
    .toLowerCase();
}

/**
 * Converte uma string para PascalCase (NomeNome)
 * @param {string} str
 * @returns {string}
 * @example
 * toPascalCase("nome_nome") // "NomeNome"
 */
export function toPascalCase(str) {
  return str
    .replace(/[_-]+/g, " ") // transforma separadores em espaço
    .replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .replace(/\s+/g, "");
}

/**
 * Converte uma string para snake_case (nome_nome)
 * @param {string} str
 * @returns {string}
 * @example
 * toSnakeCase("NomeNome") // "nome_nome"
 */
export function toSnakeCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2") // separa camelCase
    .replace(/\s+/g, "_") // espaços para "_"
    .toLowerCase();
}

/**
 * Converte uma string para camelCase (nomeNome)
 * @param {string} str
 * @returns {string}
 * @example
 * toCamelCase("nome_nome") // "nomeNome"
 */
export function toCamelCase(str) {
  const pascal = str
    .replace(/[_-]+/g, " ") // transforma separadores em espaço
    .replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .replace(/\s+/g, "");

  // deixa a primeira letra minúscula
  return pascal[0].toLowerCase() + pascal.slice(1);
}