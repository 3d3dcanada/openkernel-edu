/**
 * OpenKernel EDU - Rate Limit Middleware
 * 100 requests per minute per IP
 *
 * @module api/middleware/rate-limit
 */

import rateLimit from 'express-rate-limit';
import { ApiError } from './error-handler';

/**
 * Rate limiter: 100 requests per minute per IP
 */
export const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        const error = ApiError.tooManyRequests();
        res.status(error.status).json({
            type: error.type,
            title: error.title,
            status: error.status,
            detail: error.detail,
            instance: _req.originalUrl,
        });
    },
    // Use default key generator which tries standard headers
    // Custom one had IPv6 issues
});
