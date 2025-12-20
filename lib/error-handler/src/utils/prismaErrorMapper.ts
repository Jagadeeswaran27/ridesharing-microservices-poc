import { Prisma } from '@prisma/client';

import { ConflictError } from '../errors/ConflictError.js';
import { DatabaseError } from '../errors/DatabaseError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ValidationError } from '../errors/ValidationError.js';

export function mapPrismaError(error: unknown): Error {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        const target = error.meta?.target as string[] | undefined;
        const field = target?.[0] || 'field';
        return new ConflictError(`${field} already exists`);
      }

      case 'P2025':
        return new NotFoundError('Record not found');

      case 'P2003':
        return new ValidationError('Invalid reference to related record');

      case 'P2014':
        return new ValidationError('Invalid ID provided');

      case 'P2011':
        return new ValidationError('Required field is missing');

      default:
        return new DatabaseError(`Database error: ${error.message}`, {
          code: error.code,
          meta: error.meta,
        });
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ValidationError('Invalid data provided to database');
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new DatabaseError('Failed to connect to database', {
      message: error.message,
    });
  }

  return error as Error;
}
