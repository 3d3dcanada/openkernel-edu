/**
 * OpenKernel EDU - Lesson Repository (Prisma Implementation)
 * CRUD operations for lessons and lesson steps
 * 
 * @module database/repositories/lesson.repository
 */

import { prisma } from '../client';
import type {
    ILessonRepository,
    ILessonStepRepository,
} from './index';
import type {
    DbLesson,
    DbLessonWithSteps,
    DbLessonStep,
    CreateLessonInput,
    UpdateLessonInput,
    LessonFilters,
    DbDifficulty,
} from '../types';
import type { MultilingualText } from '../../contracts/tutorial-schema';

// =============================================================================
// LESSON REPOSITORY
// =============================================================================

export class LessonRepository implements ILessonRepository {
    async findAll(filters?: LessonFilters): Promise<DbLesson[]> {
        const where: Record<string, unknown> = {};

        if (filters?.difficulty) {
            where.difficulty = filters.difficulty;
        }

        if (filters?.tags && filters.tags.length > 0) {
            where.tags = { hasSome: filters.tags };
        }

        // Note: Full-text search on JSON requires more complex querying
        // For now, we skip the search filter in Prisma implementation

        const lessons = await prisma.lesson.findMany({
            where,
            orderBy: { createdAt: 'asc' },
        });

        return lessons.map(this.mapToDbLesson);
    }

    async findById(id: string): Promise<DbLesson | null> {
        const lesson = await prisma.lesson.findUnique({
            where: { id },
        });

        return lesson ? this.mapToDbLesson(lesson) : null;
    }

    async findWithSteps(id: string): Promise<DbLessonWithSteps | null> {
        const lesson = await prisma.lesson.findUnique({
            where: { id },
            include: {
                steps: {
                    orderBy: { stepNumber: 'asc' },
                },
            },
        });

        if (!lesson) return null;

        return {
            ...this.mapToDbLesson(lesson),
            steps: lesson.steps.map(this.mapToDbLessonStep),
        };
    }

    async findByDifficulty(difficulty: DbDifficulty): Promise<DbLesson[]> {
        const lessons = await prisma.lesson.findMany({
            where: { difficulty },
            orderBy: { createdAt: 'asc' },
        });

        return lessons.map(this.mapToDbLesson);
    }

    async create(data: CreateLessonInput): Promise<DbLesson> {
        const lesson = await prisma.lesson.create({
            data: {
                title: data.title as any,
                description: data.description as any,
                emojiConcepts: data.emojiConcepts,
                difficulty: data.difficulty,
                estimatedMins: data.estimatedMins,
                prerequisites: data.prerequisites ?? [],
                tags: data.tags ?? [],
                author: data.author ?? null,
                steps: {
                    create: data.steps.map((step) => ({
                        stepNumber: step.stepNumber,
                        instruction: step.instruction as any,
                        emojiCode: step.emojiCode,
                        expectedOutput: step.expectedOutput ?? [],
                        hint: step.hint as any ?? null,
                        explanation: step.explanation as any ?? null,
                        validationLogic: step.validationLogic as any ?? null,
                    })),
                },
            },
        });

        return this.mapToDbLesson(lesson);
    }

    async update(id: string, data: UpdateLessonInput): Promise<DbLesson> {
        const updateData: Record<string, unknown> = {};

        if (data.title) updateData.title = data.title as any;
        if (data.description) updateData.description = data.description as any;
        if (data.emojiConcepts) updateData.emojiConcepts = data.emojiConcepts;
        if (data.difficulty) updateData.difficulty = data.difficulty;
        if (data.estimatedMins) updateData.estimatedMins = data.estimatedMins;
        if (data.prerequisites) updateData.prerequisites = data.prerequisites;
        if (data.tags) updateData.tags = data.tags;

        const lesson = await prisma.lesson.update({
            where: { id },
            data: updateData,
        });

        return this.mapToDbLesson(lesson);
    }

    async delete(id: string): Promise<void> {
        await prisma.lesson.delete({
            where: { id },
        });
    }

    async count(filters?: LessonFilters): Promise<number> {
        const where: Record<string, unknown> = {};

        if (filters?.difficulty) {
            where.difficulty = filters.difficulty;
        }

        if (filters?.tags && filters.tags.length > 0) {
            where.tags = { hasSome: filters.tags };
        }

        return prisma.lesson.count({ where });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapToDbLesson(lesson: any): DbLesson {
        return {
            id: lesson.id,
            title: lesson.title as MultilingualText,
            description: lesson.description as MultilingualText,
            emojiConcepts: lesson.emojiConcepts,
            difficulty: lesson.difficulty,
            estimatedMins: lesson.estimatedMins,
            prerequisites: lesson.prerequisites,
            tags: lesson.tags,
            author: lesson.author,
            version: lesson.version,
            createdAt: lesson.createdAt,
            updatedAt: lesson.updatedAt,
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapToDbLessonStep(step: any): DbLessonStep {
        return {
            id: step.id,
            lessonId: step.lessonId,
            stepNumber: step.stepNumber,
            instruction: step.instruction as MultilingualText,
            emojiCode: step.emojiCode,
            expectedOutput: step.expectedOutput,
            hint: step.hint as MultilingualText | null,
            explanation: step.explanation as MultilingualText | null,
            validationLogic: step.validationLogic,
        };
    }
}

// =============================================================================
// LESSON STEP REPOSITORY
// =============================================================================

export class LessonStepRepository implements ILessonStepRepository {
    async findByLessonId(lessonId: string): Promise<DbLessonStep[]> {
        const steps = await prisma.lessonStep.findMany({
            where: { lessonId },
            orderBy: { stepNumber: 'asc' },
        });

        return steps.map(this.mapToDbLessonStep);
    }

    async findByLessonAndStep(lessonId: string, stepNumber: number): Promise<DbLessonStep | null> {
        const step = await prisma.lessonStep.findUnique({
            where: {
                lessonId_stepNumber: { lessonId, stepNumber },
            },
        });

        return step ? this.mapToDbLessonStep(step) : null;
    }

    async update(id: string, data: Partial<DbLessonStep>): Promise<DbLessonStep> {
        const updateData: Record<string, unknown> = {};

        if (data.instruction) updateData.instruction = data.instruction as any;
        if (data.emojiCode) updateData.emojiCode = data.emojiCode;
        if (data.expectedOutput !== undefined) updateData.expectedOutput = data.expectedOutput;
        if (data.hint !== undefined) updateData.hint = data.hint as any | null;
        if (data.explanation !== undefined) updateData.explanation = data.explanation as any | null;
        if (data.validationLogic !== undefined) updateData.validationLogic = data.validationLogic as any;

        const step = await prisma.lessonStep.update({
            where: { id },
            data: updateData,
        });

        return this.mapToDbLessonStep(step);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapToDbLessonStep(step: any): DbLessonStep {
        return {
            id: step.id,
            lessonId: step.lessonId,
            stepNumber: step.stepNumber,
            instruction: step.instruction as MultilingualText,
            emojiCode: step.emojiCode,
            expectedOutput: step.expectedOutput,
            hint: step.hint as MultilingualText | null,
            explanation: step.explanation as MultilingualText | null,
            validationLogic: step.validationLogic,
        };
    }
}

// Export singleton instances
export const lessonRepository = new LessonRepository();
export const lessonStepRepository = new LessonStepRepository();
