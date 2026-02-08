/**
 * OpenKernel EDU - Database Module Index
 * Exports all database types, repositories, and utilities
 * 
 * @module database
 */

// Types
export * from './types';

// Repository interfaces
export type {
    ILessonRepository,
    ILessonStepRepository,
    IUserProgressRepository,
    IExampleProgramRepository,
    IAchievementRepository,
    IRepositoryFactory,
} from './repositories';

// Prisma repositories (for server-side use)
export {
    LessonRepository,
    LessonStepRepository,
    lessonRepository,
    lessonStepRepository,
} from './repositories/lesson.repository';

export {
    UserProgressRepository,
    userProgressRepository,
} from './repositories/user-progress.repository';

export {
    ExampleProgramRepository,
    exampleProgramRepository,
} from './repositories/example-program.repository';

export {
    AchievementRepository,
    achievementRepository,
} from './repositories/achievement.repository';

// In-memory repositories (for client-side/testing use)
export {
    InMemoryLessonRepository,
    InMemoryLessonStepRepository,
    inMemoryLessonRepository,
    inMemoryLessonStepRepository,
    clearInMemoryLessons,
    seedInMemoryLessons,
    InMemoryUserProgressRepository,
    inMemoryUserProgressRepository,
    clearInMemoryProgress,
} from './in-memory';

// Database client (for server-side use)
export { prisma, disconnectDb, checkDbConnection } from './client';
