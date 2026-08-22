/**
 * BoilerBooks 3.0 Cloudflare Worker Request Body Validator.
 * Provides strict zero-dependency JSON schema runtime validation.
 */

export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object';

export interface FieldConstraint {
  type: FieldType;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: readonly (string | number)[];
}

export type SchemaDefinition = Record<string, FieldConstraint>;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export function validateRequestBody<T = Record<string, unknown>>(
  input: unknown,
  schema: SchemaDefinition
): ValidationResult<T> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      success: false,
      errors: [{ field: '_body', message: 'Request body must be a JSON object' }],
    };
  }

  const data = input as Record<string, unknown>;
  const errors: ValidationError[] = [];

  for (const [fieldName, constraint] of Object.entries(schema)) {
    const value = data[fieldName];

    // Check required
    if (value === undefined || value === null || value === '') {
      if (constraint.required) {
        errors.push({ field: fieldName, message: `Field "${fieldName}" is required` });
      }
      continue;
    }

    // Check type
    if (constraint.type === 'array') {
      if (!Array.isArray(value)) {
        errors.push({ field: fieldName, message: `Field "${fieldName}" must be an array` });
        continue;
      }
      if (constraint.min !== undefined && value.length < constraint.min) {
        errors.push({ field: fieldName, message: `Field "${fieldName}" must contain at least ${constraint.min} items` });
      }
      if (constraint.max !== undefined && value.length > constraint.max) {
        errors.push({ field: fieldName, message: `Field "${fieldName}" cannot exceed ${constraint.max} items` });
      }
    } else if (constraint.type === 'number') {
      const num = Number(value);
      if (isNaN(num) || typeof value === 'boolean') {
        errors.push({ field: fieldName, message: `Field "${fieldName}" must be a valid number` });
        continue;
      }
      if (constraint.min !== undefined && num < constraint.min) {
        errors.push({ field: fieldName, message: `Field "${fieldName}" cannot be less than ${constraint.min}` });
      }
      if (constraint.max !== undefined && num > constraint.max) {
        errors.push({ field: fieldName, message: `Field "${fieldName}" cannot be greater than ${constraint.max}` });
      }
    } else if (constraint.type === 'string') {
      if (typeof value !== 'string') {
        errors.push({ field: fieldName, message: `Field "${fieldName}" must be a string` });
        continue;
      }
      if (constraint.min !== undefined && value.length < constraint.min) {
        errors.push({ field: fieldName, message: `Field "${fieldName}" must be at least ${constraint.min} characters` });
      }
      if (constraint.max !== undefined && value.length > constraint.max) {
        errors.push({ field: fieldName, message: `Field "${fieldName}" cannot exceed ${constraint.max} characters` });
      }
      if (constraint.pattern && !constraint.pattern.test(value)) {
        errors.push({ field: fieldName, message: `Field "${fieldName}" format is invalid` });
      }
    } else if (constraint.type === 'boolean') {
      if (typeof value !== 'boolean') {
        errors.push({ field: fieldName, message: `Field "${fieldName}" must be a boolean` });
      }
    }

    // Enum check
    if (constraint.enum && !constraint.enum.includes(value as any)) {
      errors.push({
        field: fieldName,
        message: `Field "${fieldName}" must be one of: ${constraint.enum.join(', ')}`,
      });
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: data as T };
}
