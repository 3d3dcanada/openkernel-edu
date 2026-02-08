/**
 * @vitest-environment node
 * OpenKernel EDU - User Progress Repository Mock Tests
 * Unit tests for UserProgressRepository using mocked Prisma client
 * 
 * @module tests/database/postgres-user-progress.repository.mock.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UserProgressRepository } from '../../src/database/repositories/user-progress.repository';
import { prisma } from '../../src/database/client';

// Mock the prisma client module
vi.mock('../../src/database/client', () => ({
    prisma: mockDeep<PrismaClient>(),
}));

describe('UserProgressRepository (Mocked Prisma)', () => {
    let repo: UserProgressRepository;
    let prismaMock: DeepMockProxy<PrismaClient>;

    beforeEach(() => {
        vi.clearAllMocks();
        repo = new UserProgressRepository();
        prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
    });

    const mockProgress = {
        id: 'progress-uuid',
        userId: 'user-1',
        lessonId: 'lesson-1',
        completedSteps: [0, 1], // Scalar list
        currentStep: 2,
        startedAt: new Date(),
        completedAt: null,
        timeSpentSecs: 100,
        hintsUsed: 3,
        attempts: 5,
        user: {},
        lesson: {}
    };

    describe('upsertProgress', () => {
        it('should call prisma.upsert with correct data including scalar lists', async () => {
            prismaMock.userProgress.upsert.mockResolvedValue(mockProgress as any);

            const input = {
                userId: 'user-1',
                lessonId: 'lesson-1',
                currentStep: 2,
                completedSteps: [0, 1]
            };

            const result = await repo.upsertProgress(input);

            expect(prismaMock.userProgress.upsert).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    userId_lessonId: { userId: 'user-1', lessonId: 'lesson-1' }
                },
                create: expect.objectContaining({
                    completedSteps: [0, 1]
                }),
                update: expect.objectContaining({
                    completedSteps: [0, 1]
                })
            }));

            expect(result.completedSteps).toEqual([0, 1]);
        });
    });

    describe('markStepComplete', () => {
        it('should handle array updates correctly', async () => {
            // Mock findUnique to return existing progress
            prismaMock.userProgress.findUnique.mockResolvedValue(mockProgress as any);

            await repo.markStepComplete('user-1', 'lesson-1', 2);

            expect(prismaMock.userProgress.upsert).toHaveBeenCalledWith(expect.objectContaining({
                where: { userId_lessonId: { userId: 'user-1', lessonId: 'lesson-1' } },
                update: expect.objectContaining({
                    completedSteps: [0, 1, 2],
                    currentStep: 3
                })
            }));
        });
    });
});
