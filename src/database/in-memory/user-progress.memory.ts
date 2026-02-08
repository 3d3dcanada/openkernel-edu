/**
 * OpenKernel EDU - In-Memory User Progress Repository
 * For frontend testing without database
 * 
 * @module database/in-memory/user-progress.memory
 */

import type { IUserProgressRepository } from '../repositories';
import type {
    DbUserProgress,
    UpsertProgressInput,
} from '../types';

// In-memory storage: userId -> lessonId -> progress
const progressMap: Map<string, Map<string, DbUserProgress>> = new Map();

let idCounter = 0;
function generateId(): string {
    return `progress-${++idCounter}`;
}

function getKey(userId: string, lessonId: string): string {
    return `${userId}:${lessonId}`;
}

export class InMemoryUserProgressRepository implements IUserProgressRepository {
    async getProgress(userId: string, lessonId: string): Promise<DbUserProgress | null> {
        const userProgress = progressMap.get(userId);
        if (!userProgress) return null;
        return userProgress.get(lessonId) ?? null;
    }

    async getAllProgress(userId: string): Promise<DbUserProgress[]> {
        const userProgress = progressMap.get(userId);
        if (!userProgress) return [];
        return Array.from(userProgress.values())
            .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
    }

    async upsertProgress(data: UpsertProgressInput): Promise<DbUserProgress> {
        let userProgress = progressMap.get(data.userId);
        if (!userProgress) {
            userProgress = new Map();
            progressMap.set(data.userId, userProgress);
        }

        const existing = userProgress.get(data.lessonId);

        if (existing) {
            const updated: DbUserProgress = {
                ...existing,
                ...(data.currentStep !== undefined && { currentStep: data.currentStep }),
                ...(data.completedSteps !== undefined && { completedSteps: data.completedSteps }),
                ...(data.timeSpentSecs !== undefined && {
                    timeSpentSecs: existing.timeSpentSecs + data.timeSpentSecs
                }),
                ...(data.hintsUsed !== undefined && {
                    hintsUsed: existing.hintsUsed + data.hintsUsed
                }),
                ...(data.attempts !== undefined && {
                    attempts: existing.attempts + data.attempts
                }),
            };
            userProgress.set(data.lessonId, updated);
            return updated;
        }

        const newProgress: DbUserProgress = {
            id: generateId(),
            userId: data.userId,
            lessonId: data.lessonId,
            completedSteps: data.completedSteps ?? [],
            currentStep: data.currentStep ?? 0,
            startedAt: new Date(),
            completedAt: null,
            timeSpentSecs: data.timeSpentSecs ?? 0,
            hintsUsed: data.hintsUsed ?? 0,
            attempts: data.attempts ?? 0,
        };

        userProgress.set(data.lessonId, newProgress);
        return newProgress;
    }

    async markStepComplete(userId: string, lessonId: string, stepNumber: number): Promise<DbUserProgress> {
        let userProgress = progressMap.get(userId);
        if (!userProgress) {
            userProgress = new Map();
            progressMap.set(userId, userProgress);
        }

        const existing = userProgress.get(lessonId);

        if (existing) {
            const completedSteps = existing.completedSteps.includes(stepNumber)
                ? existing.completedSteps
                : [...existing.completedSteps, stepNumber];

            const updated: DbUserProgress = {
                ...existing,
                completedSteps,
                currentStep: Math.max(existing.currentStep, stepNumber + 1),
                attempts: existing.attempts + 1,
            };
            userProgress.set(lessonId, updated);
            return updated;
        }

        const newProgress: DbUserProgress = {
            id: generateId(),
            userId,
            lessonId,
            completedSteps: [stepNumber],
            currentStep: stepNumber + 1,
            startedAt: new Date(),
            completedAt: null,
            timeSpentSecs: 0,
            hintsUsed: 0,
            attempts: 1,
        };

        userProgress.set(lessonId, newProgress);
        return newProgress;
    }

    async addTimeSpent(userId: string, lessonId: string, seconds: number): Promise<void> {
        await this.upsertProgress({
            userId,
            lessonId,
            timeSpentSecs: seconds,
        });
    }

    async markLessonComplete(userId: string, lessonId: string): Promise<DbUserProgress> {
        const userProgress = progressMap.get(userId);
        const existing = userProgress?.get(lessonId);

        if (!existing) {
            throw new Error(`No progress found for user ${userId} on lesson ${lessonId}`);
        }

        const updated: DbUserProgress = {
            ...existing,
            completedAt: new Date(),
        };

        userProgress!.set(lessonId, updated);
        return updated;
    }

    async getStats(userId: string): Promise<{
        totalLessons: number;
        completedLessons: number;
        totalTimeSpent: number;
        totalHintsUsed: number;
    }> {
        const allProgress = await this.getAllProgress(userId);

        return {
            totalLessons: allProgress.length,
            completedLessons: allProgress.filter(p => p.completedAt !== null).length,
            totalTimeSpent: allProgress.reduce((sum, p) => sum + p.timeSpentSecs, 0),
            totalHintsUsed: allProgress.reduce((sum, p) => sum + p.hintsUsed, 0),
        };
    }
}

// Utility functions for testing
export function clearInMemoryProgress(): void {
    progressMap.clear();
    idCounter = 0;
}

// Export singleton instance
export const inMemoryUserProgressRepository = new InMemoryUserProgressRepository();
