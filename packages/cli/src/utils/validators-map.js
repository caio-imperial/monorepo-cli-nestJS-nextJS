/**
 * Mapeia tipos do Prisma para decorators do class-validator
 */
export const defaultValidators = {
  String: ["IsString", "IsNotEmpty"],
  Int: ["IsNumber", "IsInt"],
  Float: ["IsNumber"],
  Boolean: ["IsBoolean"],
  DateTime: ["IsDate"],
  BigInt: ["IsNumber"],
  Decimal: ["IsNumber"],
  Json: ["IsObject"],
};

/**
 * Campos específicos customizados
 * Exemplo: password sempre terá MinLength 8
 */
export const customFieldValidators = {
  password: ["@MinLength(8)", "@IsStrongPassword()"],
  email: ["@IsEmail()"],
  name: ["@MinLength(2)", "@MaxLength(50)"],
  title: ["@MinLength(3)", "@MaxLength(100)"],
  description: ["@MaxLength(500)"],
  phone: ["@IsPhoneNumber()"],
  url: ["@IsUrl()"],
  slug: ["@IsSlug()"],
};

/**
 * Validadores adicionais baseados em padrões comuns
 */
export const patternValidators = {
  id: ["@IsPositive()"],
  createdAt: ["@IsDate()"],
  updatedAt: ["@IsDate()"],
  isActive: ["@IsBoolean()"],
  count: ["@Min(0)"],
  price: ["@IsPositive()", "@IsDecimal({ decimal_digits: '2' })"],
};
