/**
 * OpenKernel EDU - Lesson Repository Tests
 * Tests for in-memory lesson repository implementation
 * 
 * @module tests/database/lesson.repository.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
    InMemoryLessonRepository,
    InMemoryLessonStepRepository,
    clearInMemoryLessons,
} from '../../src/database/in-memory';
import type { CreateLessonInput } from '../../src/database/types';

describe('InMemoryLessonRepository', () => {
    let lessonRepo: InMemoryLessonRepository;
    let stepRepo: InMemoryLessonStepRepository;

    const sampleLesson: CreateLessonInput = {
        title: { en: 'Test Lesson', es: 'Lección de Prueba' },
        description: { en: 'A test lesson', es: 'Una lección de prueba' },
        emojiConcepts: ['📥', '🖨️', '⏹️'],
        difficulty: 'beginner',
        estimatedMins: 5,
        prerequisites: [],
        tags: ['test', 'basics'],
        steps: [
            {
                stepNumber: 0,
                instruction: { en: 'Step 1', es: 'Paso 1' },
                emojiCode: '📥 42',
                expectedOutput: '42',
                hint: { en: 'Load a number', es: 'Carga un número' },
            },
            {
                stepNumber: 1,
                instruction: { en: 'Step 2', es: 'Paso 2' },
                emojiCode: '🖨️',
            },
        ],
    };

    beforeEach(() => {
        clearInMemoryLessons();
        lessonRepo = new InMemoryLessonRepository();
        stepRepo = new InMemoryLessonStepRepository();
    });

    describe('create', () => {
        it('should create a lesson with steps', async () => {
            const lesson = await lessonRepo.create(sampleLesson);

            expect(lesson.id).toBeDefined();
            expect(lesson.title).toEqual(sampleLesson.title);
            expect(lesson.difficulty).toBe('beginner');
            expect(lesson.emojiConcepts).toEqual(['📥', '🖨️', '⏹️']);
        });

        it('should create associated lesson steps', async () => {
            const lesson = await lessonRepo.create(sampleLesson);
            const steps = await stepRepo.findByLessonId(lesson.id);

            expect(steps).toHaveLength(2);
            expect(steps[0].stepNumber).toBe(0);
            expect(steps[1].stepNumber).toBe(1);
        });
    });

    describe('findAll', () => {
        it('should return all lessons', async () => {
            await lessonRepo.create(sampleLesson);
            await lessonRepo.create({
                ...sampleLesson,
                title: { en: 'Second Lesson' },
                difficulty: 'intermediate',
            });

            const all = await lessonRepo.findAll();
            expect(all).toHaveLength(2);
        });

        it('should filter by difficulty', async () => {
            await lessonRepo.create(sampleLesson);
            await lessonRepo.create({
                ...sampleLesson,
                title: { en: 'Intermediate Lesson' },
                difficulty: 'intermediate',
            });

            const beginnerOnly = await lessonRepo.findAll({ difficulty: 'beginner' });
            expect(beginnerOnly).toHaveLength(1);
            expect(beginnerOnly[0].difficulty).toBe('beginner');
        });

        it('should filter by tags', async () => {
            await lessonRepo.create(sampleLesson);
            await lessonRepo.create({
                ...sampleLesson,
                title: { en: 'Advanced Lesson' },
                tags: ['advanced', 'os'],
            });

            const testTag = await lessonRepo.findAll({ tags: ['test'] });
            expect(testTag).toHaveLength(1);
        });
    });

    describe('findById', () => {
        it('should find lesson by id', async () => {
            const created = await lessonRepo.create(sampleLesson);
            const found = await lessonRepo.findById(created.id);

            expect(found).toBeDefined();
            expect(found?.id).toBe(created.id);
        });

        it('should return null for non-existent id', async () => {
            const found = await lessonRepo.findById('non-existent');
            expect(found).toBeNull();
        });
    });

    describe('findWithSteps', () => {
        it('should include steps with lesson', async () => {
            const created = await lessonRepo.create(sampleLesson);
            const lessonWithSteps = await lessonRepo.findWithSteps(created.id);

            expect(lessonWithSteps).toBeDefined();
            expect(lessonWithSteps?.steps).toHaveLength(2);
            expect(lessonWithSteps?.steps[0].instruction).toEqual({ en: 'Step 1', es: 'Paso 1' });
        });

        it('should order steps by stepNumber', async () => {
            const created = await lessonRepo.create(sampleLesson);
            const lessonWithSteps = await lessonRepo.findWithSteps(created.id);

            expect(lessonWithSteps?.steps[0].stepNumber).toBe(0);
            expect(lessonWithSteps?.steps[1].stepNumber).toBe(1);
        });
    });

    describe('update', () => {
        it('should update lesson properties', async () => {
            const created = await lessonRepo.create(sampleLesson);
            const updated = await lessonRepo.update(created.id, {
                title: { en: 'Updated Title' },
                difficulty: 'intermediate',
            });

            expect(updated.title).toEqual({ en: 'Updated Title' });
            expect(updated.difficulty).toBe('intermediate');
        });

        it('should preserve unupdated properties', async () => {
            const created = await lessonRepo.create(sampleLesson);
            const updated = await lessonRepo.update(created.id, {
                title: { en: 'Updated Title' },
            });

            expect(updated.emojiConcepts).toEqual(['📥', '🖨️', '⏹️']);
            expect(updated.estimatedMins).toBe(5);
        });
    });

    describe('delete', () => {
        it('should remove lesson and steps', async () => {
            const created = await lessonRepo.create(sampleLesson);
            await lessonRepo.delete(created.id);

            const found = await lessonRepo.findById(created.id);
            expect(found).toBeNull();

            const steps = await stepRepo.findByLessonId(created.id);
            expect(steps).toHaveLength(0);
        });
    });

    describe('count', () => {
        it('should return total lesson count', async () => {
            await lessonRepo.create(sampleLesson);
            await lessonRepo.create({ ...sampleLesson, title: { en: 'Second' } });

            const count = await lessonRepo.count();
            expect(count).toBe(2);
        });

        it('should count with filters', async () => {
            await lessonRepo.create(sampleLesson);
            await lessonRepo.create({
                ...sampleLesson,
                title: { en: 'Advanced' },
                difficulty: 'advanced',
            });

            const beginnerCount = await lessonRepo.count({ difficulty: 'beginner' });
            expect(beginnerCount).toBe(1);
        });
    });

    describe('performance', () => {
        it('should retrieve lessons in under 50ms', async () => {
            // Seed 10 lessons
            for (let i = 0; i < 10; i++) {
                await lessonRepo.create({
                    ...sampleLesson,
                    title: { en: `Lesson ${i}` },
                });
            }

            const start = performance.now();
            await lessonRepo.findAll();
            const duration = performance.now() - start;

            expect(duration).toBeLessThan(50);
        });

        it('should retrieve lesson with steps in under 50ms', async () => {
            const created = await lessonRepo.create(sampleLesson);

            const start = performance.now();
            await lessonRepo.findWithSteps(created.id);
            const duration = performance.now() - start;

            expect(duration).toBeLessThan(50);
        });
    });
});

describe('InMemoryLessonStepRepository', () => {
    let lessonRepo: InMemoryLessonRepository;
    let stepRepo: InMemoryLessonStepRepository;

    beforeEach(() => {
        clearInMemoryLessons();
        lessonRepo = new InMemoryLessonRepository();
        stepRepo = new InMemoryLessonStepRepository();
    });

    describe('findByLessonId', () => {
        it('should return steps for a lesson', async () => {
            const lesson = await lessonRepo.create({
                title: { en: 'Test' },
                description: { en: 'Test' },
                emojiConcepts: ['📥'],
                difficulty: 'beginner',
                estimatedMins: 5,
                steps: [
                    { stepNumber: 0, instruction: { en: 'Step 0' }, emojiCode: '📥 1' },
                    { stepNumber: 1, instruction: { en: 'Step 1' }, emojiCode: '🖨️' },
                ],
            });

            const steps = await stepRepo.findByLessonId(lesson.id);
            expect(steps).toHaveLength(2);
        });

        it('should return empty array for non-existent lesson', async () => {
            const steps = await stepRepo.findByLessonId('non-existent');
            expect(steps).toEqual([]);
        });
    });

    describe('findByLessonAndStep', () => {
        it('should find specific step', async () => {
            const lesson = await lessonRepo.create({
                title: { en: 'Test' },
                description: { en: 'Test' },
                emojiConcepts: ['📥'],
                difficulty: 'beginner',
                estimatedMins: 5,
                steps: [
                    { stepNumber: 0, instruction: { en: 'First' }, emojiCode: '📥 1' },
                    { stepNumber: 1, instruction: { en: 'Second' }, emojiCode: '🖨️' },
                ],
            });

            const step = await stepRepo.findByLessonAndStep(lesson.id, 1);
            expect(step?.instruction).toEqual({ en: 'Second' });
        });
    });
});
