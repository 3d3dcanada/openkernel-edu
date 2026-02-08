/**
 * OpenKernel EDU - In-Memory Lesson Repository
 * For frontend testing without database
 * 
 * @module database/in-memory/lesson.memory
 */

import type { ILessonRepository, ILessonStepRepository } from '../repositories';
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

import { randomUUID } from 'crypto';

// In-memory storage
const lessons: Map<string, DbLesson> = new Map();
const lessonSteps: Map<string, DbLessonStep[]> = new Map();

function generateId(): string {
    return randomUUID();
}

export class InMemoryLessonRepository implements ILessonRepository {
    async findAll(filters?: LessonFilters): Promise<DbLesson[]> {
        let result = Array.from(lessons.values());

        if (filters?.difficulty) {
            result = result.filter(l => l.difficulty === filters.difficulty);
        }

        if (filters?.tags && filters.tags.length > 0) {
            result = result.filter(l =>
                filters.tags!.some(tag => l.tags.includes(tag))
            );
        }

        return result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    async findById(id: string): Promise<DbLesson | null> {
        return lessons.get(id) ?? null;
    }

    async findWithSteps(id: string): Promise<DbLessonWithSteps | null> {
        const lesson = lessons.get(id);
        if (!lesson) return null;

        const steps = lessonSteps.get(id) ?? [];
        return {
            ...lesson,
            steps: steps.sort((a, b) => a.stepNumber - b.stepNumber),
        };
    }

    async findByDifficulty(difficulty: DbDifficulty): Promise<DbLesson[]> {
        return Array.from(lessons.values())
            .filter(l => l.difficulty === difficulty)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    async create(data: CreateLessonInput): Promise<DbLesson> {
        const id = generateId();
        const now = new Date();

        const lesson: DbLesson = {
            id,
            title: data.title,
            description: data.description,
            emojiConcepts: data.emojiConcepts,
            difficulty: data.difficulty,
            estimatedMins: data.estimatedMins,
            prerequisites: data.prerequisites ?? [],
            tags: data.tags ?? [],
            author: data.author ?? null,
            version: '1.0.0',
            createdAt: now,
            updatedAt: now,
        };

        lessons.set(id, lesson);

        // Create steps
        const steps: DbLessonStep[] = data.steps.map((step, index) => ({
            id: `${id}-step-${index}`,
            lessonId: id,
            stepNumber: step.stepNumber,
            instruction: step.instruction,
            emojiCode: step.emojiCode,
            expectedOutput: step.expectedOutput ?? [],
            hint: step.hint ?? null,
            explanation: step.explanation ?? null,
            validationLogic: step.validationLogic ?? null,
        }));

        lessonSteps.set(id, steps);

        return lesson;
    }

    async update(id: string, data: UpdateLessonInput): Promise<DbLesson> {
        const lesson = lessons.get(id);
        if (!lesson) {
            throw new Error(`Lesson ${id} not found`);
        }

        const updated: DbLesson = {
            ...lesson,
            ...(data.title && { title: data.title }),
            ...(data.description && { description: data.description }),
            ...(data.emojiConcepts && { emojiConcepts: data.emojiConcepts }),
            ...(data.difficulty && { difficulty: data.difficulty }),
            ...(data.estimatedMins && { estimatedMins: data.estimatedMins }),
            ...(data.prerequisites && { prerequisites: data.prerequisites }),
            ...(data.tags && { tags: data.tags }),
            updatedAt: new Date(),
        };

        lessons.set(id, updated);
        return updated;
    }

    async delete(id: string): Promise<void> {
        lessons.delete(id);
        lessonSteps.delete(id);
    }

    async count(filters?: LessonFilters): Promise<number> {
        const all = await this.findAll(filters);
        return all.length;
    }
}

export class InMemoryLessonStepRepository implements ILessonStepRepository {
    async findByLessonId(lessonId: string): Promise<DbLessonStep[]> {
        const steps = lessonSteps.get(lessonId) ?? [];
        return steps.sort((a, b) => a.stepNumber - b.stepNumber);
    }

    async findByLessonAndStep(lessonId: string, stepNumber: number): Promise<DbLessonStep | null> {
        const steps = lessonSteps.get(lessonId) ?? [];
        return steps.find(s => s.stepNumber === stepNumber) ?? null;
    }

    async update(id: string, data: Partial<DbLessonStep>): Promise<DbLessonStep> {
        // Find the step across all lessons
        for (const [lessonId, steps] of lessonSteps) {
            const index = steps.findIndex(s => s.id === id);
            if (index !== -1) {
                const updated = { ...steps[index], ...data };
                steps[index] = updated;
                lessonSteps.set(lessonId, steps);
                return updated;
            }
        }
        throw new Error(`Step ${id} not found`);
    }
}

// Utility functions for testing
export function clearInMemoryLessons(): void {
    lessons.clear();
    lessonSteps.clear();
}

export async function seedInMemoryLessons(seedLessons: CreateLessonInput[]): Promise<void> {
    clearInMemoryLessons();
    const repo = new InMemoryLessonRepository();
    for (const lesson of seedLessons) {
        await repo.create(lesson);
    }
}

// Export singleton instances
export const inMemoryLessonRepository = new InMemoryLessonRepository();
export const inMemoryLessonStepRepository = new InMemoryLessonStepRepository();
