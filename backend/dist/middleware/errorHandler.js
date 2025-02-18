"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Custom error handler middleware
async function errorHandler(err, // The error object passed from previous middleware
req, res, next) {
    // Log the error for debugging purposes
    // Default status and message
    let message = err.message || 'Internal Server Error';
    let statusCode = err.status || 500;
    // Handle specific error cases
    if (err.status === 400) {
        message = 'Invalid JSON syntax';
    }
    if (err.status = 400) {
        statusCode = 400;
        message = `Validation error: ${err.message}`;
    }
    // Send the error response
    res.status(statusCode).json({
        success: false,
        message,
    });
}
exports.default = errorHandler;
