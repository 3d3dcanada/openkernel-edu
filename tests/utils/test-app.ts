import express from 'express';
import cors from 'cors';
import apiRoutes from '../../src/api/routes';
import { errorHandler } from '../../src/api/middleware';

export const createTestApp = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    // Mock Middleware
    app.use((req: any, res, next) => {
        req.user = { id: 'test-user-id', role: 'student' };
        req.context = {
            language: 'en',
            userId: 'test-user-id' // Explicitly add userId here as progress.ts might rely on req.context.userId
        };
        next();
    });

    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });

    app.use('/api/v1', apiRoutes);
    app.use(errorHandler);

    return app;
};
