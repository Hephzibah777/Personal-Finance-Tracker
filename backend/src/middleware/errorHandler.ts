import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Custom error handler middleware
async function errorHandler(
  err: any, // The error object passed from previous middleware
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  // Log the error for debugging purposes

  // Default status and message
  let statusCode = err.status || 500;  // Fallback to 500 if no status is set
  let message = err.message || 'Internal Server Error';

  // Handle specific error cases
  if (err.name === 'SyntaxError') {
    statusCode = 400;  // Bad Request for SyntaxError
    message = 'Invalid JSON syntax';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = `Validation error: ${err.message}`;
  }

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message,
  });
}

export default errorHandler;
