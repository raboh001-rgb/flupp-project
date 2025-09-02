import { z } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export function sanitizeError(error: any, isDevelopment: boolean = false): { 
  error: string; 
  statusCode: number;
  code?: string;
} {
  // Handle known app errors
  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      code: error.code,
    };
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const messages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    return {
      error: messages.join(', '),
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    };
  }

  // Handle Prisma errors
  if (error?.code === 'P2002') {
    return {
      error: 'A record with this information already exists',
      statusCode: 409,
      code: 'DUPLICATE_RECORD',
    };
  }

  if (error?.code === 'P2025') {
    return {
      error: 'Record not found',
      statusCode: 404,
      code: 'NOT_FOUND',
    };
  }

  // Handle generic database errors
  if (error?.code?.startsWith('P')) {
    return {
      error: 'Database operation failed',
      statusCode: 500,
      code: 'DATABASE_ERROR',
    };
  }

  // Log full error in development
  if (isDevelopment) {
    console.error('Unhandled error:', error);
    return {
      error: error?.message || 'An unexpected error occurred',
      statusCode: 500,
      code: 'INTERNAL_ERROR',
    };
  }

  // Generic error for production
  return {
    error: 'An internal server error occurred',
    statusCode: 500,
    code: 'INTERNAL_ERROR',
  };
}

export function asyncHandler(fn: Function) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Global error handler middleware
export function errorHandler(error: any, req: any, res: any, next: any) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const sanitized = sanitizeError(error, isDevelopment);
  
  // Log error for monitoring
  if (sanitized.statusCode >= 500) {
    console.error('Server Error:', {
      url: req.url,
      method: req.method,
      error: error?.message,
      stack: isDevelopment ? error?.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }

  res.status(sanitized.statusCode).json({
    error: sanitized.error,
    code: sanitized.code,
    ...(isDevelopment && { stack: error?.stack }),
  });
}