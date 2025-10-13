import { defaultValidators, customFieldValidators } from './validators-map.js';

/**
 * Gera imports necessários para DTOs baseado nos campos e validadores
 */
export function generateDtoImports(fields) {
  const validatorSet = new Set();
  const transformerSet = new Set();

  fields.forEach(field => {
    // Adiciona validadores padrão baseado no tipo
    const typeValidators = defaultValidators[field.type] || [];
    typeValidators.forEach(validator => validatorSet.add(validator));

    // Adiciona validadores customizados baseado no nome do campo
    const customValidators = customFieldValidators[field.name] || [];
    customValidators.forEach(validator => validatorSet.add(validator));

    // Adiciona validadores para campos opcionais
    if (field.optional) {
      validatorSet.add('IsOptional');
    }

    // Adiciona transformers se necessário
    if (field.type === 'Date') {
      transformerSet.add('Type');
    }
  });

  const imports = [];

  // Import class-validator
  if (validatorSet.size > 0) {
    const validators = Array.from(validatorSet).sort();
    imports.push(`import { ${validators.join(', ')} } from 'class-validator';`);
  }

  // Import class-transformer
  if (transformerSet.size > 0) {
    const transformers = Array.from(transformerSet).sort();
    imports.push(`import { ${transformers.join(', ')} } from 'class-transformer';`);
  }

  return imports.join('\n');
}

/**
 * Gera validadores para um campo específico
 */
export function generateFieldValidators(field) {
  const validators = [];

  // Validadores opcionais
  if (field.optional) {
    validators.push('@IsOptional()');
  }

  // Validadores baseados no tipo
  const typeValidators = defaultValidators[field.type] || [];
  typeValidators.forEach(validator => {
    validators.push(`@${validator}()`);
  });

  // Validadores customizados baseados no nome
  const customValidators = customFieldValidators[field.name] || [];
  customValidators.forEach(validator => {
    validators.push(`@${validator}`);
  });

  // Transformers
  if (field.type === 'Date') {
    validators.push('@Type(() => Date)');
  }

  return validators;
}

/**
 * Mapeia tipos Prisma para TypeScript com validação adicional
 */
export function mapPrismaTypeToTS(prismaType) {
  const typeMap = {
    Int: 'number',
    String: 'string',
    Boolean: 'boolean',
    DateTime: 'Date',
    Float: 'number',
    Decimal: 'number',
    Json: 'any',
    BigInt: 'bigint'
  };

  return typeMap[prismaType] || prismaType;
}