// pipes/prisma-model-validation.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import {
  getModelFieldLengths,
  getModelFieldTypes,
  getModelRequiredFields,
} from '../utils/prisma-dmmf.util';

function checkType(value: unknown, prismaType: string): string | null {
  switch (prismaType) {
    case 'String':
      return typeof value !== 'string'
        ? `must be a string (received ${typeof value})`
        : null;
    case 'Int':
      return typeof value !== 'number' || !Number.isInteger(value)
        ? `must be an integer (received ${typeof value})`
        : null;
    case 'Float':
      return typeof value !== 'number'
        ? `must be a number (received ${typeof value})`
        : null;
    case 'Boolean':
      return typeof value !== 'boolean'
        ? `must be a boolean (received ${typeof value})`
        : null;
    case 'DateTime':
      if (value instanceof Date) return null;
      if (typeof value === 'string' && !isNaN(Date.parse(value))) return null;
      return `must be a valid ISO date string (received ${typeof value})`;
    case 'BigInt':
      return typeof value !== 'bigint' &&
        !(typeof value === 'number' && Number.isInteger(value))
        ? `must be a BigInt or integer (received ${typeof value})`
        : null;
    case 'Decimal':
      if (typeof value === 'number') return null;
      if (typeof value === 'string' && !isNaN(Number(value))) return null;
      return `must be a number or numeric string (received ${typeof value})`;
    default:
      return null; // Json, Bytes — no constraint
  }
}

@Injectable()
export class PrismaModelValidationPipe implements PipeTransform {
  private readonly modelName: string;
  private readonly isUpdate: boolean;

  constructor(modelName: string, isUpdate = false) {
    this.modelName = modelName;
    this.isUpdate = isUpdate;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    const errors: string[] = [];

    const fieldLengths = getModelFieldLengths(this.modelName);
    const fieldTypes = getModelFieldTypes(this.modelName);
    const requiredFields = getModelRequiredFields(this.modelName);

    // ── 1. Required Field Check (skip on update/PATCH) ──
    if (!this.isUpdate) {
      for (const field of requiredFields) {
        const fieldValue = value[field];

        if (
          fieldValue === undefined ||
          fieldValue === null ||
          fieldValue === ''
        ) {
          errors.push(`Field \`${field}\` is required.`);
        }
      }
    }

    // ── 2. Datatype & Length Check for all provided fields ──
    for (const [field, prismaType] of Object.entries(fieldTypes)) {
      const fieldValue = value[field];

      if (fieldValue === undefined || fieldValue === null) continue;

      const typeError = checkType(fieldValue, prismaType);
      if (typeError) {
        errors.push(`Field \`${field}\` ${typeError}.`);
        continue;
      }

      const maxLength = fieldLengths[field];
      if (
        maxLength !== null &&
        maxLength !== undefined &&
        typeof fieldValue === 'string' &&
        fieldValue.length > maxLength
      ) {
        errors.push(
          `Field \`${field}\` exceeds max length of ${maxLength} characters (received ${fieldValue.length}).`,
        );
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        statusCode: 400,
        error: 'Validation Failed',
        message: errors,
      });
    }

    return value;
  }
}