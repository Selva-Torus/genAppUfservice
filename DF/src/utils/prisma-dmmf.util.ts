// utils/prisma-dmmf.util.ts
import { Prisma } from '@prisma/client';

export interface FieldLengthMap {
  [fieldName: string]: number | null;
}

export interface FieldTypeMap {
  [fieldName: string]: string;
}

// Extracts all field lengths from Prisma DMMF for a given model
export function getModelFieldLengths(modelName: string): FieldLengthMap {
  const dmmf = Prisma.dmmf.datamodel.models;

  const model = dmmf.find(
    (m) => m.name.toLowerCase() === modelName.toLowerCase(),
  );

  if (!model) return {};

  const lengthMap: FieldLengthMap = {};

  for (const field of model.fields) {
    const nativeType = field.nativeType; // e.g., ['VarChar', [64]]

    if (nativeType && Array.isArray(nativeType[1]) && nativeType[1].length > 0) {
      const length = Number(nativeType[1][0]);
      if (!isNaN(length)) {
        lengthMap[field.name] = length;
      }
    } else {
      lengthMap[field.name] = null; // No length restriction
    }
  }

  return lengthMap;
}

// Extracts Prisma scalar types for all scalar fields of a model
export function getModelFieldTypes(modelName: string): FieldTypeMap {
  const dmmf = Prisma.dmmf.datamodel.models;

  const model = dmmf.find(
    (m) => m.name.toLowerCase() === modelName.toLowerCase(),
  );

  if (!model) return {};

  const typeMap: FieldTypeMap = {};

  for (const field of model.fields) {
    if (field.kind === 'scalar') {
      typeMap[field.name] = field.type;
    }
  }

  return typeMap;
}

// Extracts required fields (non-nullable, no default, not auto-generated)
export function getModelRequiredFields(modelName: string): string[] {
  const dmmf = Prisma.dmmf.datamodel.models;

  const model = dmmf.find(
    (m) => m.name.toLowerCase() === modelName.toLowerCase(),
  );

  if (!model) return [];

  return model.fields
    .filter(
      (field) =>
        !field.isRequired === false &&   // Must be required
        field.isRequired &&              // Non-nullable
        !field.default &&             // No DB default
        !field.isId &&                   // Not a PK
        !field.isUpdatedAt &&            // Not @updatedAt
        field.kind === 'scalar',         // Only scalar fields
    )
    .map((field) => field.name);
}