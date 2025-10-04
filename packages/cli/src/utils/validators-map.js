/**
 * Mapeia tipos do Prisma para decorators do class-validator
 */
export const defaultValidators = {
  String: ["IsString"],
  Int: [],
  Float: [],
  Boolean: [],
  DateTime: ["IsDate"],
  Email: ["IsEmail"],
};

/**
 * Campos específicos customizados
 * Exemplo: password sempre terá MinLength 8
 */
export const customFieldValidators = {
  password: ["MinLength(8)"],
  email: ["IsEmail"],
};
