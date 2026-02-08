import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../utils/test-app';
import { lessonRepository, userProgressRepository } from '../../src/database/repositories';
import { clearInMemoryLessons } from '../../src/database/in-memory/lesson.memory';
import { clearInMemoryProgress } from '../../src/database/in-memory/user-progress.memory';
import { CreateLessonInput } from '../../src/database/types';

describe('Integration: API Endpoints', () => {
    const app = createTestApp();

    const testLesson: CreateLessonInput = {
        title: { en: 'Intro' },
        description: { en: 'Desc' },
        difficulty: 'beginner',
        emojiConcepts: [],
        tags: [],
        estimatedMins: 10,
        author: 'System',
        steps: []
    };

    beforeEach(async () => {
        // Clear in-memory data
        clearInMemoryLessons();
        clearInMemoryProgress();

        // Seed using the repository instance to ensure we use the same storage as the app
        await lessonRepository.create(testLesson);
    });

    describe('Lessons API', () => {
        it('GET /api/v1/lessons should return lessons list', async () => {
            const res = await request(app).get('/api/v1/lessons');
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].title).toBe('Intro');
        });

        it('GET /api/v1/lessons/:id should return lesson details', async () => {
            // Get the ID from the list first since it's generated
            const listRes = await request(app).get('/api/v1/lessons');
            const id = listRes.body[0].id;

            const res = await request(app).get(`/api/v1/lessons/${id}`);
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(id);
            expect(res.body.title).toBe('Intro');
        });

        it('GET /api/v1/lessons/:id should return 404 if not found', async () => {
            const res = await request(app).get('/api/v1/lessons/00000000-0000-0000-0000-000000000000');
            expect(res.status).toBe(404);
        });
    });

    describe('Execution API', () => {
        it('POST /api/v1/execute/parse should validate and parse code', async () => {
            const res = await request(app)
                .post('/api/v1/execute/parse')
                .send({ code: '📥 42\n⏹️' });

            expect(res.status).toBe(200);
            expect(res.body.valid).toBe(true);
            expect(res.body.instructions).toHaveLength(2);
        });

        it('POST /api/v1/execute/parse should return errors for invalid code', async () => {
            const res = await request(app)
                .post('/api/v1/execute/parse')
                .send({ code: '📥' }); // Invalid syntax (missing operand)

            expect(res.status).toBe(200);
            expect(res.body.valid).toBe(false);
            expect(res.body.errors).toBeDefined();
        });
    });

    describe('User Progress API', () => {
        it('GET /api/v1/progress/me should return user progress', async () => {
            const res = await request(app)
                .get('/api/v1/progress/me')
                .set('Authorization', 'Bearer test-token');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                totalLessons: 0,
                completedLessons: 0,
                totalTimeSpent: 0,
                totalHintsUsed: 0,
                progress: []
            });
        });
    });
});
