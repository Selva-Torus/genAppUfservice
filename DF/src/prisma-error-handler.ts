export function parsePrismaCreateError(error: any) {
  const raw = error?.message || '';

  // Match "Invalid value for argument `field`"
  const invalidArgMatch = raw.match(/Invalid value for argument\s+`(.+?)`/);
  if (invalidArgMatch) {
    const field = invalidArgMatch[1];
    return `Argument \`${field}\` has invalid value.`;
  }

  // DATATYPE MISMATCH (Prisma always includes "Invalid value provided")
  if (raw.includes('Invalid value provided')) {
    const field = extractField(raw);
    return field
      ? `Invalid datatype for argument \`${field}\`.`
      : 'Invalid datatype sent to server.';
  }

  // ENUM mismatch (Prisma includes "Expected <enum>")
  const enumMatch = raw.match(/Invalid value for argument\s+`(.+?)`.*Expected\s+(.+?)\./);
  if (enumMatch) {
    const field = enumMatch[1];
    const expected = enumMatch[2];
    return `Argument \`${field}\` has invalid value. Expected ${expected}.`;
  }

  // Prisma validation
  if (raw.includes('PrismaClientValidationError')) {
    return 'Invalid data sent to server.';
  }

  return 'Something went wrong. Please check your inputs.';
}

// Extract only the Prisma argument name
function extractField(raw: string) {
  const match = raw.match(/Argument\s+`(.+?)`/);
  return match ? match[1] : null;
}
