/**
 * OpenKernel EDU - Repository Interfaces
 * Abstract interfaces for data access layer
 * 
 * @module database/repositories
 */

import type {
    DbLesson,
    DbLessonWithSteps,
    DbLessonStep,
    DbUserProgress,
    DbExampleProgram,
    DbAchievement,
    CreateLessonInput,
    UpdateLessonInput,
    UpsertProgressInput,
    CreateExampleInput,
    CreateAchievementInput,
    LessonFilters,
    ExampleFilters,
    PaginationOptions,
    DbAchievementType,
    DbDifficulty,
    DbCategory,
    // User types
    CreateUserInput,
    UpdateUserInput,
    User, // Import local User type
} from '../types';
// import { User } from '@prisma/client'; // Removed dependency

// =============================================================================
// LESSON REPOSITORY
// =============================================================================

export interface ILessonRepository {
    /**
     * Get all lessons with optional filtering
     */
    findAll(filters?: LessonFilters): Promise<DbLesson[]>;

    /**
     * Get a lesson by ID
     */
    findById(id: string): Promise<DbLesson | null>;

    /**
     * Get a lesson by ID with all steps included
     */
    findWithSteps(id: string): Promise<DbLessonWithSteps | null>;

    /**
     * Get lessons by difficulty level
     */
    findByDifficulty(difficulty: DbDifficulty): Promise<DbLesson[]>;

    /**
     * Create a new lesson with steps
     */
    create(data: CreateLessonInput): Promise<DbLesson>;

    /**
     * Update a lesson
     */
    update(id: string, data: UpdateLessonInput): Promise<DbLesson>;

    /**
     * Delete a lesson and all its steps
     */
    delete(id: string): Promise<void>;

    /**
     * Count total lessons
     */
    count(filters?: LessonFilters): Promise<number>;
}

// =============================================================================
// LESSON STEP REPOSITORY
// =============================================================================

export interface ILessonStepRepository {
    /**
     * Get all steps for a lesson, ordered by step number
     */
    findByLessonId(lessonId: string): Promise<DbLessonStep[]>;

    /**
     * Get a specific step
     */
    findByLessonAndStep(lessonId: string, stepNumber: number): Promise<DbLessonStep | null>;

    /**
     * Update a step
     */
    update(id: string, data: Partial<DbLessonStep>): Promise<DbLessonStep>;
}

// =============================================================================
// USER PROGRESS REPOSITORY
// =============================================================================

export interface IUserProgressRepository {
    /**
     * Get progress for a specific lesson
     */
    getProgress(userId: string, lessonId: string): Promise<DbUserProgress | null>;

    /**
     * Get all progress for a user
     */
    getAllProgress(userId: string): Promise<DbUserProgress[]>;

    /**
     * Create or update progress (atomic upsert)
     */
    upsertProgress(data: UpsertProgressInput): Promise<DbUserProgress>;

    /**
     * Mark a step as complete
     */
    markStepComplete(userId: string, lessonId: string, stepNumber: number): Promise<DbUserProgress>;

    /**
     * Add time spent on a lesson
     */
    addTimeSpent(userId: string, lessonId: string, seconds: number): Promise<void>;

    /**
     * Mark lesson as completed
     */
    markLessonComplete(userId: string, lessonId: string): Promise<DbUserProgress>;

    /**
     * Get completion statistics for a user
     */
    getStats(userId: string): Promise<{
        totalLessons: number;
        completedLessons: number;
        totalTimeSpent: number;
        totalHintsUsed: number;
    }>;
}

// =============================================================================
// EXAMPLE PROGRAM REPOSITORY
// =============================================================================

export interface IExampleProgramRepository {
    /**
     * Get all examples with optional filtering and pagination
     */
    findAll(filters?: ExampleFilters, pagination?: PaginationOptions): Promise<DbExampleProgram[]>;

    /**
     * Get an example by ID
     */
    findById(id: string): Promise<DbExampleProgram | null>;

    /**
     * Get examples by category
     */
    findByCategory(category: DbCategory): Promise<DbExampleProgram[]>;

    /**
     * Create an example program
     */
    create(data: CreateExampleInput): Promise<DbExampleProgram>;

    /**
     * Upvote an example
     */
    upvote(id: string): Promise<DbExampleProgram>;

    /**
     * Get top examples by upvotes
     */
    getPopular(limit?: number): Promise<DbExampleProgram[]>;

    /**
     * Count examples
     */
    count(filters?: ExampleFilters): Promise<number>;
}

// =============================================================================
// ACHIEVEMENT REPOSITORY
// =============================================================================

export interface IAchievementRepository {
    /**
     * Get all achievements for a user
     */
    findByUserId(userId: string): Promise<DbAchievement[]>;

    /**
     * Check if user has a specific achievement
     */
    hasAchievement(userId: string, achievementType: DbAchievementType): Promise<boolean>;

    /**
     * Award an achievement to a user
     */
    award(data: CreateAchievementInput): Promise<DbAchievement>;

    /**
     * Get recently earned achievements across all users
     */
    getRecent(limit?: number): Promise<DbAchievement[]>;

    /**
     * Count achievements by type
     */
    countByType(achievementType: DbAchievementType): Promise<number>;
}

// =============================================================================
// USER REPOSITORY
// =============================================================================

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findByProvider(provider: string, providerId: string): Promise<User | null>;
    create(data: any): Promise<User>; // Type explicitly defined in implementation
    update(id: string, data: Partial<User>): Promise<User>;
}

// =============================================================================
// REPOSITORY FACTORY
// =============================================================================

export interface IRepositoryFactory {
    lessons: ILessonRepository;
    lessonSteps: ILessonStepRepository;
    achievements: IAchievementRepository;
}

// =============================================================================
// EXPORTS
// =============================================================================

// export * from './lesson.repository'; // Switch to in-memory
import { inMemoryLessonRepository, inMemoryLessonStepRepository } from '../in-memory/lesson.memory';
export const lessonRepository = inMemoryLessonRepository;
export const lessonStepRepository = inMemoryLessonStepRepository;
// export * from './user-progress.repository'; // Switch to in-memory
import { inMemoryUserProgressRepository } from '../in-memory/user-progress.memory';
export const userProgressRepository = inMemoryUserProgressRepository;
// achievement.repository might not be implemented yet, check filesystem
export * from './example-program.repository';

import { inMemoryUserRepository } from '../in-memory/user.memory';
export const userRepository: IUserRepository = inMemoryUserRepository;
