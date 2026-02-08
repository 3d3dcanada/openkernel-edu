import { Request, Response, NextFunction } from 'express';
import { AuthenticationService, AuthPayload } from '../auth/service';
import { BuzzAuthority, AuthorityLevel } from '../../core/buzz/authority';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user payload to request
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            // Allow anonymous users (A0) to proceed without user object
            // unless endpoint specifically requires auth
            return next();
        }

        const token = authHeader.split(' ')[1];
        const payload = AuthenticationService.verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        // Determine if we should fail or just continue as guest
        // For now, if a token is provided but invalid, we reject
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

/**
 * Require specific Authority Level (BUZZ Kernel)
 */
export const requireAuthority = (requiredLevel: AuthorityLevel) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // If no user, assume GUEST (A0)
        const userAuthority = req.user?.authority ?? AuthorityLevel.A0_GUEST;

        if (userAuthority < requiredLevel) {
            return res.status(403).json({
                error: 'Forbidden',
                message: `Required Authority Level: A${requiredLevel}, Current: A${userAuthority}`
            });
        }

        next();
    };
};

/**
 * Require valid authentication (at least A1_STUDENT)
 */
export const requireAuth = requireAuthority(AuthorityLevel.A1_STUDENT);
