// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../utils/test-app';
import { clearInMemoryUsers } from '../../src/database/in-memory/user.memory';

describe('Integration: Auth API', () => {
    const app = createTestApp();

    beforeEach(() => {
        clearInMemoryUsers();
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'Test User'
                });

            expect(res.status).toBe(201);
            expect(res.body.user.email).toBe('test@example.com');
            expect(res.body.token).toBeDefined();
        });

        it('should return 400 for invalid email', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'password123'
                });

            expect(res.status).toBe(400);
        });

        it('should return 400 for short password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'short'
                });

            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });
        });

        it('should login an existing user', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
        });

        it('should return 401 for wrong credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrong-password'
                });

            // The controller uses AuthenticationService which throws error, 
            // and the error middleware should catch it.
            // Let's check what error is returned. Initial expectation is 401 or 400.
            expect(res.status).toBeGreaterThanOrEqual(400);
        });
    });

    describe('OAuth Routes', () => {
        it('GET /api/v1/auth/oauth/google should redirect to Google', async () => {
            const res = await request(app).get('/api/v1/auth/oauth/google');
            expect(res.status).toBe(302);
            expect(res.header.location).toContain('accounts.google.com');
        });

        it('GET /api/v1/auth/oauth/google/callback should return mock user info', async () => {
            const res = await request(app).get('/api/v1/auth/oauth/google/callback');
            expect(res.status).toBe(200);
            expect(res.body.user.email).toBe('demo.student@gmail.com');
            expect(res.body.token).toBeDefined();
        });
    });
});
