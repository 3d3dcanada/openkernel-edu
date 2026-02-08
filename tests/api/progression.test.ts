// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp } from '../utils/test-app';
import { lessonRepository, userProgressRepository } from '../../src/database/repositories';
import { clearInMemoryLessons } from '../../src/database/in-memory/lesson.memory';
import { clearInMemoryProgress } from '../../src/database/in-memory/user-progress.memory';
import { CreateLessonInput } from '../../src/database/types';

describe('Integration: Lesson Progression', () => {
    const app = createTestApp();
    const userId = 'test-user-id';
    let lessonId: string;

    const sampleLesson: CreateLessonInput = {
        title: { en: 'Progression Test' },
        description: { en: 'Test description' },
        difficulty: 'beginner',
        emojiConcepts: ['📥'],
        tags: ['test'],
        estimatedMins: 5,
        steps: [
            {
                stepNumber: 1,
                instruction: { en: 'First step' },
                emojiCode: '📥 1'
            },
            {
                stepNumber: 2,
                instruction: { en: 'Second step' },
                emojiCode: '📥 2'
            }
        ]
    };

    beforeEach(async () => {
        clearInMemoryLessons();
        clearInMemoryProgress();

        const lesson = await lessonRepository.create(sampleLesson);
        lessonId = lesson.id;
    });

    it('should follow the full lesson progression flow', async () => {
        // 1. Start lesson
        const startRes = await request(app)
            .post(`/api/v1/progress/${lessonId}/start`)
            .send();

        expect(startRes.status).toBe(200);
        expect(startRes.body.lessonId).toBe(lessonId);
        expect(startRes.body.completedSteps).toHaveLength(0);

        // 2. Complete first step
        const step1Res = await request(app)
            .put(`/api/v1/progress/${lessonId}/complete-step`)
            .send({
                stepNumber: 1,
                timeSpentSecs: 30
            });

        expect(step1Res.status).toBe(200);
        expect(step1Res.body.completedSteps).toContain(1);
        expect(step1Res.body.currentStep).toBe(2);
        expect(step1Res.body.completedAt).toBeNull();

        // 3. Complete second step (final)
        const step2Res = await request(app)
            .put(`/api/v1/progress/${lessonId}/complete-step`)
            .send({
                stepNumber: 2,
                timeSpentSecs: 45
            });

        expect(step2Res.status).toBe(200);
        expect(step2Res.body.completedSteps).toContain(1);
        expect(step2Res.body.completedSteps).toContain(2);
        expect(step2Res.body.completedAt).not.toBeNull();
        expect(step2Res.body.timeSpentSecs).toBe(75);

        // 4. Verify in /me endpoint
        const meRes = await request(app)
            .get('/api/v1/progress/me')
            .send();

        expect(meRes.status).toBe(200);
        expect(meRes.body.completedLessons).toBe(1);
        expect(meRes.body.progress).toHaveLength(1);
        expect(meRes.body.progress[0].completedAt).not.toBeNull();
    });

    it('should return 404 for non-existent lesson', async () => {
        const fakeId = '00000000-0000-0000-0000-000000000000';
        const res = await request(app)
            .post(`/api/v1/progress/${fakeId}/start`)
            .send();

        expect(res.status).toBe(404);
    });

    it('should handle hints and track usage', async () => {
        // Start lesson
        await request(app).post(`/api/v1/progress/${lessonId}/start`).send();

        // Get hint
        const hintRes = await request(app)
            .get(`/api/v1/progress/${lessonId}/hints`)
            .send();

        expect(hintRes.status).toBe(200);
        expect(hintRes.body.hint).toBeDefined();

        // Check progress stats
        const meRes = await request(app).get('/api/v1/progress/me').send();
        expect(meRes.body.totalHintsUsed).toBe(1);
    });
});
