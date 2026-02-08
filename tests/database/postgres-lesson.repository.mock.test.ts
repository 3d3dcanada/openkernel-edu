/**
 * @vitest-environment node
 * OpenKernel EDU - Lesson Repository Mock Tests
 * Unit tests for LessonRepository using mocked Prisma client
 * 
 * @module tests/database/postgres-lesson.repository.mock.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { LessonRepository } from '../../src/database/repositories/lesson.repository';
import { prisma } from '../../src/database/client';
import type { CreateLessonInput } from '../../src/database/types';

// Mock the prisma client module
vi.mock('../../src/database/client', () => ({
    prisma: mockDeep<PrismaClient>(),
}));

describe('LessonRepository (Mocked Prisma)', () => {
    let repo: LessonRepository;
    let prismaMock: DeepMockProxy<PrismaClient>;

    beforeEach(() => {
        vi.clearAllMocks();
        repo = new LessonRepository();
        prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
    });

    const sampleInput: CreateLessonInput = {
        title: { en: 'Test Lesson' },
        description: { en: 'Desc' },
        emojiConcepts: ['📥'],
        difficulty: 'beginner',
        estimatedMins: 10,
        tags: ['test'],
        steps: [
            {
                stepNumber: 0,
                instruction: { en: 'Step 1' },
                emojiCode: '📥 1',
                expectedOutput: ['1'],
            }
        ]
    };

    const mockDbLesson = {
        id: 'lesson-uuid',
        title: { en: 'Test Lesson' },
        description: { en: 'Desc' },
        emojiConcepts: ['📥'],
        difficulty: 'beginner',
        estimatedMins: 10,
        prerequisites: [],
        tags: ['test'],
        author: null,
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        steps: [
            {
                id: 'step-uuid',
                lessonId: 'lesson-uuid',
                stepNumber: 0,
                instruction: { en: 'Step 1' },
                emojiCode: '📥 1',
                expectedOutput: ['1'],
                hint: null,
                explanation: null,
                validationLogic: null,
            }
        ]
    };

    describe('create', () => {
        it('should call prisma.lesson.create with correct data including scalar lists', async () => {
            // Setup mock return
            prismaMock.lesson.create.mockResolvedValue(mockDbLesson as any);

            // Execute
            const result = await repo.create(sampleInput);

            // Verify interactions
            expect(prismaMock.lesson.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    title: sampleInput.title,
                    emojiConcepts: ['📥'], // Scalar list check
                    tags: ['test'],        // Scalar list check
                    steps: {
                        create: expect.arrayContaining([
                            expect.objectContaining({
                                stepNumber: 0,
                                expectedOutput: ['1'] // Scalar list in nested create
                            })
                        ])
                    }
                })
            });

            // Verify mapping
            expect(result.id).toBe('lesson-uuid');
            expect(result.emojiConcepts).toEqual(['📥']);
        });
    });

    describe('findAll', () => {
        it('should apply filters correctly in prisma query', async () => {
            prismaMock.lesson.findMany.mockResolvedValue([mockDbLesson as any]);

            await repo.findAll({ difficulty: 'beginner', tags: ['test'] });

            expect(prismaMock.lesson.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    difficulty: 'beginner',
                    tags: { hasSome: ['test'] }
                }
            }));
        });
    });
});
