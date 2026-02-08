/**
 * OpenKernel EDU - Progress API Routes
 * 
 * @module api/routes/progress
 */

import { Router } from 'express';
import { z } from 'zod';
import { userProgressRepository, lessonRepository, lessonStepRepository } from '../../database/repositories';
import { validateParams, validateBody } from '../middleware';
import { ApiError } from '../middleware/error-handler';
import { getLocalizedText } from '../../contracts/tutorial-schema';
import type {
    ProgressResponse,
    ProgressStatsResponse,
    HintResponse
} from '../types/api.types';

const router = Router();

// =============================================================================
// SCHEMAS
// =============================================================================

const LessonIdParamSchema = z.object({
    lesson_id: z.string().uuid(),
});

const CompleteStepSchema = z.object({
    stepNumber: z.number().int().min(1),
    timeSpentSecs: z.number().int().min(0).optional(),
});

// =============================================================================
// ROUTES
// =============================================================================

/**
 * GET /api/v1/progress/me
 * Get current user's full progress
 */
router.get('/me', async (req, res, next) => {
    try {
        const { userId, language } = req.context;

        if (!userId) {
            throw ApiError.badRequest('User ID required in context (ensure auth middleware runs before this)');
        }

        const progressList = await userProgressRepository.getAllProgress(userId);
        const stats = await userProgressRepository.getStats(userId);

        // Enrich progress with lesson titles
        const enrichedProgress: ProgressResponse[] = [];

        for (const p of progressList) {
            const lesson = await lessonRepository.findById(p.lessonId);
            enrichedProgress.push({
                id: p.id,
                lessonId: p.lessonId,
                lessonTitle: lesson ? getLocalizedText(lesson.title, language) : 'Unknown Lesson',
                completedSteps: p.completedSteps,
                currentStep: p.currentStep,
                startedAt: p.startedAt.toISOString(),
                completedAt: p.completedAt ? p.completedAt.toISOString() : null,
                timeSpentSecs: p.timeSpentSecs,
                hintsUsed: p.hintsUsed,
                attempts: p.attempts,
            });
        }

        const response: ProgressStatsResponse = {
            totalLessons: stats.totalLessons,
            completedLessons: stats.completedLessons,
            totalTimeSpent: stats.totalTimeSpent,
            totalHintsUsed: stats.totalHintsUsed,
            progress: enrichedProgress
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/v1/progress/:lesson_id/start
 * Start a lesson (creates progress record if not exists)
 */
router.post('/:lesson_id/start', validateParams(LessonIdParamSchema), async (req, res, next) => {
    try {
        const { lesson_id } = req.params as unknown as z.infer<typeof LessonIdParamSchema>;
        const { userId } = req.context;

        if (!userId) {
            throw ApiError.badRequest('User ID required');
        }

        const lesson = await lessonRepository.findById(lesson_id);
        if (!lesson) {
            throw ApiError.notFound(`Lesson ${lesson_id}`);
        }

        const progress = await userProgressRepository.upsertProgress({
            userId,
            lessonId: lesson_id,
            // Initialize if new
        });

        const response: ProgressResponse = {
            id: progress.id,
            lessonId: progress.lessonId,
            lessonTitle: 'Start', // We don't fetch title here to keep it fast
            completedSteps: progress.completedSteps,
            currentStep: progress.currentStep,
            startedAt: progress.startedAt.toISOString(),
            completedAt: progress.completedAt ? progress.completedAt.toISOString() : null,
            timeSpentSecs: progress.timeSpentSecs,
            hintsUsed: progress.hintsUsed,
            attempts: progress.attempts,
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * PUT /api/v1/progress/:lesson_id/complete-step
 * Mark step as complete
 */
router.put('/:lesson_id/complete-step', validateParams(LessonIdParamSchema), validateBody(CompleteStepSchema), async (req, res, next) => {
    try {
        const { lesson_id } = req.params as unknown as z.infer<typeof LessonIdParamSchema>;
        const { userId } = req.context;
        const { stepNumber, timeSpentSecs } = req.body as z.infer<typeof CompleteStepSchema>;

        if (!userId) {
            throw ApiError.badRequest('User ID required');
        }

        // Verify step exists
        const step = await lessonStepRepository.findByLessonAndStep(lesson_id, stepNumber);
        if (!step) {
            throw ApiError.notFound(`Step ${stepNumber}`);
        }

        // Update progress
        let progress = await userProgressRepository.markStepComplete(userId, lesson_id, stepNumber);

        // Update time if provided
        if (timeSpentSecs) {
            await userProgressRepository.addTimeSpent(userId, lesson_id, timeSpentSecs);
            // Re-fetch to get updated time
            const updated = await userProgressRepository.getProgress(userId, lesson_id);
            if (updated) progress = updated;
        }

        // Check if lesson is complete (all steps done)
        const allSteps = await lessonStepRepository.findByLessonId(lesson_id);
        const allStepNumbers = allSteps.map(s => s.stepNumber);
        const completedSet = new Set(progress.completedSteps);

        const isComplete = allStepNumbers.every(num => completedSet.has(num));

        if (isComplete && !progress.completedAt) {
            progress = await userProgressRepository.markLessonComplete(userId, lesson_id);
        }

        const response: ProgressResponse = {
            id: progress.id,
            lessonId: progress.lessonId,
            lessonTitle: 'Progress Update',
            completedSteps: progress.completedSteps,
            currentStep: progress.currentStep,
            startedAt: progress.startedAt.toISOString(),
            completedAt: progress.completedAt ? progress.completedAt.toISOString() : null,
            timeSpentSecs: progress.timeSpentSecs,
            hintsUsed: progress.hintsUsed,
            attempts: progress.attempts,
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/v1/progress/:lesson_id/hints
 * Get hint for current step
 */
router.get('/:lesson_id/hints', validateParams(LessonIdParamSchema), async (req, res, next) => {
    try {
        const { lesson_id } = req.params as unknown as z.infer<typeof LessonIdParamSchema>;
        const { userId, language } = req.context;

        if (!userId) {
            throw ApiError.badRequest('User ID required');
        }

        const progress = await userProgressRepository.getProgress(userId, lesson_id);
        if (!progress) {
            throw ApiError.notFound(`Progress for lesson ${lesson_id}`);
        }

        // Get current step
        const currentStepNum = progress.currentStep || 1;
        const step = await lessonStepRepository.findByLessonAndStep(lesson_id, currentStepNum);

        if (!step) {
            throw ApiError.notFound(`Step ${currentStepNum}`);
        }

        // Track hint usage
        await userProgressRepository.upsertProgress({
            userId,
            lessonId: lesson_id,
            hintsUsed: 1
        });

        const response: HintResponse = {
            stepNumber: currentStepNum,
            hint: step.hint ? getLocalizedText(step.hint, language) : null,
            hintsRemaining: 0 // TODO: Implement hint credits logic
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
});

export default router;
