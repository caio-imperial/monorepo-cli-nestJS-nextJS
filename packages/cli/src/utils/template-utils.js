import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { loadCliConfig } from './config-utils.js';

// Registrar helpers do Handlebars
Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('includes', function(str, substring) {
  return str && str.includes(substring);
});

Handlebars.registerHelper('unless', function(conditional, options) {
  if (!conditional) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// Helper para coletar validadores únicos
Handlebars.registerHelper('collectValidators', function(fields) {
  const validators = new Set();
  let needsType = false;

  fields.forEach(field => {
    if (field.name === 'id') return; // Skip id field

    if (field.type === 'string') {
      validators.add('IsString');
      validators.add('IsNotEmpty');

      if (field.name === 'email') validators.add('IsEmail');
      if (field.name === 'password') {
        validators.add('MinLength');
        validators.add('IsStrongPassword');
      }
      if (field.name === 'name') {
        validators.add('MinLength');
        validators.add('MaxLength');
      }
      if (field.name === 'title') {
        validators.add('MinLength');
        validators.add('MaxLength');
      }
      if (field.name === 'description') validators.add('MaxLength');
      if (field.name === 'phone') validators.add('IsPhoneNumber');
      if (field.name === 'url') validators.add('IsUrl');
      if (field.name === 'slug') validators.add('IsSlug');
    }

    if (field.type === 'number') {
      validators.add('IsNumber');
      if (field.name.includes('id')) validators.add('IsPositive');
      if (field.name === 'count') validators.add('Min');
      if (field.name === 'price') {
        validators.add('IsPositive');
        validators.add('IsDecimal');
      }
    }

    if (field.type === 'boolean') validators.add('IsBoolean');
    if (field.type === 'Date') {
      validators.add('IsDate');
      needsType = true;
    }
    if (field.type === 'any') validators.add('IsObject');
  });

  validators.add('IsOptional'); // Always needed for UpdateDto

  return {
    validators: Array.from(validators).sort(),
    needsType
  };
});

// Helper para mapear tipo Prisma para FieldType
function mapPrismaTypeToFieldType(prismaType) {
  switch (prismaType) {
    case 'String': return 'string';
    case 'Int':
    case 'Float':
    case 'Decimal': return 'number';
    case 'Boolean': return 'boolean';
    case 'DateTime': return 'date';
    default: return 'string';
  }
}

// Helper para obter operadores padrão por tipo
function getDefaultOperatorsForType(type) {
  switch (type) {
    case 'String': return ['contains', 'startsWith', 'endsWith', 'in'];
    case 'Int':
    case 'Float':
    case 'Decimal': return ['gte', 'lte', 'gt', 'lt', 'in'];
    case 'DateTime': return ['gte', 'lte', 'gt', 'lt'];
    case 'Boolean': return [];
    default: return ['contains'];
  }
}

// Helper para gerar configuração de filtros
Handlebars.registerHelper('generateFilterConfig', function(fields) {
  return fields.filter(field => field.name !== 'id' && field.type !== 'boolean' )
    .map(field => {
      const prismaType = field.prismaType || field.type;
      const fieldType = mapPrismaTypeToFieldType(prismaType);
      const operators = getDefaultOperatorsForType(prismaType);
      const operatorsStr = operators.length > 0
        ? `operators: [${operators.map(op => `'${op}'`).join(', ')}]`
        : null;

      if (!operatorsStr) return null

      return `    ${field.name}: { type: '${fieldType}', ${operatorsStr} }`;
    })
    .join(',\n');
});

// Helper para gerar tipo correto para Response DTO
Handlebars.registerHelper('responseFieldType', function(field) {
  let type = field.type;
  if (field.optional) {
    return `${type} | null`;
  }
  return type;
});

// Helper para gerar descrição do campo para Swagger
Handlebars.registerHelper('description', function(fieldName) {
  const descriptions = {
    id: 'Unique identifier',
    name: 'Name of the entity',
    title: 'Title of the entity',
    email: 'Email address',
    phone: 'Phone number',
    password: 'User password',
    age: 'Age in years',
    price: 'Price value',
    quantity: 'Quantity amount',
    description: 'Detailed description',
    content: 'Content text',
    url: 'URL address',
    imageUrl: 'Image URL',
    slug: 'URL-friendly identifier',
    status: 'Current status',
    active: 'Active status',
    favorite: 'Favorite flag',
    notes: 'Additional notes',
    condition: 'Current condition',
    createdAt: 'Creation timestamp',
    updatedAt: 'Last update timestamp',
    userId: 'User identifier',
    carId: 'Car identifier',
    brandId: 'Brand identifier',
    seriesId: 'Series identifier'
  };
  return descriptions[fieldName] || `${fieldName} field`;
});

// Helper para gerar exemplos baseados no tipo para Swagger
Handlebars.registerHelper('example', function(type, fieldName) {
  const stringExamples = {
    name: "'John Doe'",
    title: "'Sample Title'",
    email: "'user@example.com'",
    phone: "'+1234567890'",
    password: "'mySecurePassword123'",
    description: "'This is a sample description'",
    content: "'Sample content text'",
    url: "'https://example.com'",
    imageUrl: "'https://example.com/image.jpg'",
    slug: "'sample-slug'",
    status: "'active'",
    notes: "'Additional notes here'",
    condition: "'excellent'",
    color: "'red'",
    model: "'BMW X5'",
    collectorNumber: "'HW001'",
    castingId: "'C123456'"
  };

  const numberExamples = {
    id: "1",
    age: "25",
    price: "99.99",
    quantity: "5",
    year: "2023",
    userId: "1",
    carId: "1",
    brandId: "1",
    seriesId: "1"
  };

  if (type === 'string') {
    return stringExamples[fieldName] || "'example text'";
  }

  if (type === 'number') {
    return numberExamples[fieldName] || "123";
  }

  if (type === 'boolean') {
    return fieldName === 'active' ? 'true' : 'false';
  }

  if (type === 'Date') {
    return "'2023-12-01T00:00:00Z'";
  }

  return "'example'";
});

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
