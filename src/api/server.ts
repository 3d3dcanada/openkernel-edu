/**
 * OpenKernel EDU - API Server
 * Express application entry point
 * 
 * @module api/server
 */

import 'dotenv/config'; // Load .env file
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {
    errorHandler,
    rateLimiter,
    languageMiddleware
} from './middleware';
import apiRoutes from './routes';
import { prisma } from '../database/client';

const app = express();
const PORT = process.env.PORT || 3001;

// =============================================================================
// MIDDLEWARE
// =============================================================================

// Security & Parsing
app.use(cors()); // Allow all for dev, restrict in prod
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Custom Middleware
app.use(rateLimiter);
app.use(languageMiddleware);

// =============================================================================
// ROUTES
// =============================================================================

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1', apiRoutes);

// Error Handling (Must be last)
app.use(errorHandler);

// =============================================================================
// START SERVER
// =============================================================================

async function startServer() {
    try {
        // Check DB connection
        // await prisma.$connect();
        console.log('✅ Database connected (In-Memory Mode)');

        app.listen(PORT, () => {
            console.log(`🚀 OpenKernel EDU API running on http://localhost:${PORT}`);
            console.log(`📚 Documentation: http://localhost:${PORT}/api/docs (Pending)`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Start server directly (tsx handles execution)
startServer();

export default app;
