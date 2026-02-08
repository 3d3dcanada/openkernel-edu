import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/api/server';
import {
    lessonRepository,
    userProgressRepository,
    exampleProgramRepository
} from '../../src/database/repositories';

// Mock repositories
vi.mock('../../src/database/repositories', () => ({
    lessonRepository: {
        findAll: vi.fn(),
        findById: vi.fn(),
        findWithSteps: vi.fn(),
    },
    lessonStepRepository: {
        findByLessonAndStep: vi.fn(),
        findByLessonId: vi.fn(),
    },
    userProgressRepository: {
        getAllProgress: vi.fn(),
        getStats: vi.fn(),
        upsertProgress: vi.fn(),
    },
    exampleProgramRepository: {
        findAll: vi.fn(),
        findByCategory: vi.fn(),
        create: vi.fn(),
    },
    achievementRepository: {}, // Add if needed
}));

// Mock execution service
vi.mock('../../src/api/services/execution.service', () => ({
    executionService: {
        createSession: vi.fn(),
        stepSession: vi.fn(),
        getSession: vi.fn(),
    }
}));

// Mock Prisma connection to avoid real DB error on startup
vi.mock('../../src/database/client', () => ({
    prisma: {
        $connect: vi.fn(),
    }
}));

describe('API Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /health', () => {
        it('should return 200 OK', async () => {
            const res = await request(app).get('/health');
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('ok');
        });
    });

    describe('GET /api/v1/lessons', () => {
        it('should return list of lessons', async () => {
            const mockLessons = [
                {
                    id: '1',
                    title: { en: 'Lesson 1' },
                    difficulty: 'beginner',
                    emojiConcepts: [],
                    description: { en: 'Desc' },
                    estimatedMins: 10
                }
            ];

            vi.mocked(lessonRepository.findAll).mockResolvedValue(mockLessons as any);

            const res = await request(app).get('/api/v1/lessons');
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].title).toBe('Lesson 1');
        });
    });

    describe('GET /api/v1/progress/me', () => {
        it('should require user ID (mock auth needed)', async () => {
            // Since we don't have auth middleware setting userId, this might fail or return 400
            const res = await request(app).get('/api/v1/progress/me');
            // Expect 400 because userId is missing
            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/v1/execute/parse', () => {
        it('should parse valid code', async () => {
            const code = '🚀 🟢'; // Valid emoji code
            const res = await request(app)
                .post('/api/v1/execute/parse')
                .send({ code });

            expect(res.status).toBe(200);
            expect(res.body.valid).toBeDefined();
        });

        it('should return error for empty code', async () => {
            const res = await request(app)
                .post('/api/v1/execute/parse')
                .send({ code: '' });

            expect(res.status).toBe(400);
        });
    });
});
