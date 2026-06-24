"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    if (error.name === 'ZodError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.errors,
        });
    }
    if (error.code === 'P2002') {
        return res.status(409).json({
            success: false,
            message: 'Resource already exists',
        });
    }
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
};
exports.notFoundHandler = notFoundHandler;
