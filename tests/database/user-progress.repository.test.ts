/**
 * OpenKernel EDU - User Progress Repository Tests
 * Tests for in-memory user progress repository implementation
 * 
 * @module tests/database/user-progress.repository.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
    InMemoryUserProgressRepository,
    clearInMemoryProgress,
} from '../../src/database/in-memory';

describe('InMemoryUserProgressRepository', () => {
    let repo: InMemoryUserProgressRepository;

    const userId = 'user-123';
    const lessonId = 'lesson-abc';

    beforeEach(() => {
        clearInMemoryProgress();
        repo = new InMemoryUserProgressRepository();
    });

    describe('upsertProgress', () => {
        it('should create new progress record', async () => {
            const progress = await repo.upsertProgress({
                userId,
                lessonId,
                currentStep: 0,
            });

            expect(progress.id).toBeDefined();
            expect(progress.userId).toBe(userId);
            expect(progress.lessonId).toBe(lessonId);
            expect(progress.currentStep).toBe(0);
            expect(progress.completedSteps).toEqual([]);
        });

        it('should update existing progress', async () => {
            await repo.upsertProgress({ userId, lessonId, currentStep: 0 });

            const updated = await repo.upsertProgress({
                userId,
                lessonId,
                currentStep: 2,
                completedSteps: [0, 1],
            });

            expect(updated.currentStep).toBe(2);
            expect(updated.completedSteps).toEqual([0, 1]);
        });

        it('should increment time spent', async () => {
            await repo.upsertProgress({ userId, lessonId, timeSpentSecs: 60 });
            const updated = await repo.upsertProgress({ userId, lessonId, timeSpentSecs: 30 });

            expect(updated.timeSpentSecs).toBe(90);
        });

        it('should increment hints used', async () => {
            await repo.upsertProgress({ userId, lessonId, hintsUsed: 1 });
            const updated = await repo.upsertProgress({ userId, lessonId, hintsUsed: 2 });

            expect(updated.hintsUsed).toBe(3);
        });
    });

    describe('getProgress', () => {
        it('should return progress for user and lesson', async () => {
            await repo.upsertProgress({ userId, lessonId, currentStep: 3 });

            const progress = await repo.getProgress(userId, lessonId);
            expect(progress?.currentStep).toBe(3);
        });

        it('should return null for non-existent progress', async () => {
            const progress = await repo.getProgress('unknown', 'unknown');
            expect(progress).toBeNull();
        });
    });

    describe('getAllProgress', () => {
        it('should return all progress for user', async () => {
            await repo.upsertProgress({ userId, lessonId: 'lesson-1' });
            await repo.upsertProgress({ userId, lessonId: 'lesson-2' });
            await repo.upsertProgress({ userId, lessonId: 'lesson-3' });

            const allProgress = await repo.getAllProgress(userId);
            expect(allProgress).toHaveLength(3);
        });

        it('should return empty array for new user', async () => {
            const allProgress = await repo.getAllProgress('new-user');
            expect(allProgress).toEqual([]);
        });
    });

    describe('markStepComplete', () => {
        it('should add step to completed steps', async () => {
            const progress = await repo.markStepComplete(userId, lessonId, 0);

            expect(progress.completedSteps).toContain(0);
            expect(progress.currentStep).toBe(1);
            expect(progress.attempts).toBe(1);
        });

        it('should not duplicate completed steps', async () => {
            await repo.markStepComplete(userId, lessonId, 0);
            const progress = await repo.markStepComplete(userId, lessonId, 0);

            expect(progress.completedSteps.filter(s => s === 0)).toHaveLength(1);
        });

        it('should increment attempts on each call', async () => {
            await repo.markStepComplete(userId, lessonId, 0);
            await repo.markStepComplete(userId, lessonId, 0);
            const progress = await repo.markStepComplete(userId, lessonId, 0);

            expect(progress.attempts).toBe(3);
        });

        it('should track multiple completed steps', async () => {
            await repo.markStepComplete(userId, lessonId, 0);
            await repo.markStepComplete(userId, lessonId, 1);
            const progress = await repo.markStepComplete(userId, lessonId, 2);

            expect(progress.completedSteps).toEqual([0, 1, 2]);
            expect(progress.currentStep).toBe(3);
        });
    });

    describe('addTimeSpent', () => {
        it('should create progress and add time', async () => {
            await repo.addTimeSpent(userId, lessonId, 120);

            const progress = await repo.getProgress(userId, lessonId);
            expect(progress?.timeSpentSecs).toBe(120);
        });

        it('should accumulate time spent', async () => {
            await repo.addTimeSpent(userId, lessonId, 60);
            await repo.addTimeSpent(userId, lessonId, 45);
            await repo.addTimeSpent(userId, lessonId, 30);

            const progress = await repo.getProgress(userId, lessonId);
            expect(progress?.timeSpentSecs).toBe(135);
        });
    });

    describe('markLessonComplete', () => {
        it('should set completedAt timestamp', async () => {
            await repo.upsertProgress({ userId, lessonId });
            const progress = await repo.markLessonComplete(userId, lessonId);

            expect(progress.completedAt).toBeDefined();
            expect(progress.completedAt).toBeInstanceOf(Date);
        });

        it('should throw if no progress exists', async () => {
            await expect(repo.markLessonComplete('x', 'y')).rejects.toThrow();
        });
    });

    describe('getStats', () => {
        it('should calculate correct statistics', async () => {
            await repo.upsertProgress({ userId, lessonId: 'l1', timeSpentSecs: 60, hintsUsed: 2 });
            await repo.upsertProgress({ userId, lessonId: 'l2', timeSpentSecs: 120, hintsUsed: 1 });
            await repo.markLessonComplete(userId, 'l1');

            const stats = await repo.getStats(userId);

            expect(stats.totalLessons).toBe(2);
            expect(stats.completedLessons).toBe(1);
            expect(stats.totalTimeSpent).toBe(180);
            expect(stats.totalHintsUsed).toBe(3);
        });

        it('should return zeros for new user', async () => {
            const stats = await repo.getStats('new-user');

            expect(stats.totalLessons).toBe(0);
            expect(stats.completedLessons).toBe(0);
            expect(stats.totalTimeSpent).toBe(0);
            expect(stats.totalHintsUsed).toBe(0);
        });
    });

    describe('atomic updates', () => {
        it('should handle concurrent-like updates correctly', async () => {
            // Simulate multiple rapid updates
            const updates = [
                repo.upsertProgress({ userId, lessonId, timeSpentSecs: 10 }),
                repo.upsertProgress({ userId, lessonId, timeSpentSecs: 20 }),
                repo.upsertProgress({ userId, lessonId, timeSpentSecs: 30 }),
            ];

            await Promise.all(updates);

            const progress = await repo.getProgress(userId, lessonId);
            // All updates should have been applied
            expect(progress?.timeSpentSecs).toBe(60);
        });

        it('should handle step completion atomically', async () => {
            const steps = [
                repo.markStepComplete(userId, lessonId, 0),
                repo.markStepComplete(userId, lessonId, 1),
                repo.markStepComplete(userId, lessonId, 2),
            ];

            const results = await Promise.all(steps);
            const finalProgress = await repo.getProgress(userId, lessonId);

            // All steps should be recorded
            expect(finalProgress?.completedSteps).toContain(0);
            expect(finalProgress?.completedSteps).toContain(1);
            expect(finalProgress?.completedSteps).toContain(2);
        });
    });
});
