/**
 * OpenKernel EDU - RFC 7807 Error Handler Middleware
 * Converts all errors to Problem Details format
 *
 * @module api/middleware/error-handler
 */

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ProblemDetails } from '../types/api.types';

/**
 * Custom API error with RFC 7807 fields
 */
export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly title: string,
        public readonly detail: string,
        public readonly type: string = '/errors/general',
        public readonly suggestions?: string[]
    ) {
        super(detail);
        this.name = 'ApiError';
    }

    static badRequest(detail: string, suggestions?: string[]): ApiError {
        return new ApiError(400, 'Bad Request', detail, '/errors/bad-request', suggestions);
    }

    static notFound(resource: string): ApiError {
        return new ApiError(404, 'Not Found', `${resource} not found`, '/errors/not-found');
    }

    static invalidSyntax(detail: string, suggestions?: string[]): ApiError {
        return new ApiError(400, 'Invalid Emoji Program', detail, '/errors/invalid-emoji-syntax', suggestions);
    }

    static tooManyRequests(): ApiError {
        return new ApiError(429, 'Too Many Requests', 'Rate limit exceeded. Try again later.', '/errors/rate-limit');
    }

    static internalError(detail: string = 'An unexpected error occurred'): ApiError {
        return new ApiError(500, 'Internal Server Error', detail, '/errors/internal');
    }
}

/**
 * Express error handler middleware
 * Converts all errors to RFC 7807 Problem Details format
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    const requestId = req.context?.requestId ?? 'unknown';

    if (err instanceof ApiError) {
        const problem: ProblemDetails = {
            type: err.type,
            title: err.title,
            status: err.status,
            detail: err.detail,
            instance: req.originalUrl,
            ...(err.suggestions && { suggestions: err.suggestions }),
        };

        res.status(err.status).json(problem);
        return;
    }

    // Zod validation errors
    if (err instanceof ZodError) {
        const problem: ProblemDetails = {
            type: '/errors/validation',
            title: 'Validation Error',
            status: 400,
            detail: err.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            instance: req.originalUrl,
        };

        res.status(400).json(problem);
        return;
    }

    // Log unexpected errors
    console.error(`[${requestId}] Unhandled error:`, err);

    const problem: ProblemDetails = {
        type: '/errors/internal',
        title: 'Internal Server Error',
        status: 500,
        detail: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
        instance: req.originalUrl,
    };

    res.status(500).json(problem);
}
