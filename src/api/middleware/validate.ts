/**
 * OpenKernel EDU - Validation Middleware
 * Zod schema validation for request bodies
 *
 * @module api/middleware/validate
 */

import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError } from './error-handler';

/**
 * Helper to safely assign properties to request object
 */
function safeAssign(req: any, prop: string, value: any) {
    try {
        req[prop] = value;
    } catch (e) {
        // If property is read-only (e.g. in some test environments), try defineProperty
        try {
            Object.defineProperty(req, prop, {
                value,
                writable: true,
                configurable: true,
            });
        } catch (e2) {
            console.warn(`Failed to assign ${prop} to request object via defineProperty`, e2);
            // Fallback: mixin if object
            if (typeof value === 'object' && value !== null && typeof req[prop] === 'object') {
                Object.assign(req[prop], value);
            }
        }
    }
}

/**
 * Create validation middleware for request body
 */
export function validateBody<T extends z.ZodSchema>(schema: T) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const issues = (result as any).error.errors || (result as any).error.issues || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errors = issues.map((e: any) => ({
                path: e.path ? e.path.join('.') : 'unknown',
                message: e.message,
            }));

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const suggestions = errors.map((e: any) => `Fix ${e.path}: ${e.message}`);

            next(ApiError.badRequest(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                `Invalid request: ${errors.map((e: any) => e.message).join(', ')}`,
                suggestions
            ));
            return;
        }

        safeAssign(req, 'body', result.data);
        next();
    };
}

/**
 * Create validation middleware for query parameters
 */
export function validateQuery<T extends z.ZodSchema>(schema: T) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const issues = (result as any).error.errors || (result as any).error.issues || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errors = issues.map((e: any) => ({
                path: e.path ? e.path.join('.') : 'unknown',
                message: e.message,
            }));

            next(ApiError.badRequest(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                `Invalid query parameters: ${errors.map((e: any) => e.message).join(', ')}`
            ));
            return;
        }

        safeAssign(req, 'query', result.data);
        next();
    };
}

/**
 * Create validation middleware for URL parameters
 */
export function validateParams<T extends z.ZodSchema>(schema: T) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const issues = (result as any).error.errors || (result as any).error.issues || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errors = issues.map((e: any) => ({
                path: e.path ? e.path.join('.') : 'unknown',
                message: e.message,
            }));

            next(ApiError.badRequest(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                `Invalid URL parameters: ${errors.map((e: any) => e.message).join(', ')}`
            ));
            return;
        }

        safeAssign(req, 'params', result.data);
        next();
    };
}
