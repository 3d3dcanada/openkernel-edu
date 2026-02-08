import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthenticationService } from './service';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, name } = registerSchema.parse(req.body);
            const result = await AuthenticationService.register(email, password, name);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = loginSchema.parse(req.body);
            const result = await AuthenticationService.login(email, password);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    static async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user || !req.user.sub) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const user = await AuthenticationService.getUserProfile(req.user.sub);
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    static async googleLogin(req: Request, res: Response) {
        // Mock Redirect
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=MOCK_CLIENT_ID&redirect_uri=http://localhost:3001/api/v1/auth/oauth/google/callback&response_type=code&scope=email%20profile`;
        res.redirect(url);
    }

    static async googleCallback(req: Request, res: Response, next: NextFunction) {
        try {
            // MOCK IMPLEMENTATION
            const result = await AuthenticationService.handleOAuthLogin(
                'google',
                'mock_google_id_' + Date.now(),
                'demo.student@gmail.com',
                'Demo Student',
                'https://ui-avatars.com/api/?name=Demo+Student'
            );
            // In production: res.redirect(`http://localhost:5173/auth/callback?token=${result.token}`);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    static async githubLogin(req: Request, res: Response) {
        // Mock Redirect
        const url = `https://github.com/login/oauth/authorize?client_id=MOCK_CLIENT_ID&redirect_uri=http://localhost:3001/api/v1/auth/oauth/github/callback&scope=user:email`;
        res.redirect(url);
    }

    static async githubCallback(req: Request, res: Response, next: NextFunction) {
        try {
            // MOCK IMPLEMENTATION
            const result = await AuthenticationService.handleOAuthLogin(
                'github',
                'mock_github_id_' + Date.now(),
                'demo.dev@github.com',
                'Demo Dev',
                'https://ui-avatars.com/api/?name=Demo+Dev'
            );
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}
