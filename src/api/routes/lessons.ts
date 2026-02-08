/**
 * OpenKernel EDU - Lessons API Routes
 * 
 * @module api/routes/lessons
 */

import { Router } from 'express';
import { z } from 'zod';
import { lessonRepository, lessonStepRepository } from '../../database/repositories';
import { validateParams, validateBody, validateQuery } from '../middleware';
import { ApiError } from '../middleware/error-handler';
import { getLocalizedText } from '../../contracts/tutorial-schema';
import { VirtualMachine } from '../../core/VirtualMachine';
import { parseEmojiProgram } from '../../parser/parser';
import { validateAndAnalyze } from '../../parser/validator';
import type {
    LessonResponse,
    LessonDetailsResponse,
    LessonStepResponse,
    ValidationResponse
} from '../types/api.types';
import type { DbDifficulty } from '../../database/types';

const router = Router();

// =============================================================================
// SCHEMAS
// =============================================================================

const IdParamSchema = z.object({
    id: z.string().uuid(),
});

const ListQuerySchema = z.object({
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    tag: z.string().optional(),
});

const ValidateStepSchema = z.object({
    stepNumber: z.number().int().min(1),
    userCode: z.string(),
});

// =============================================================================
// ROUTES
// =============================================================================

/**
 * GET /api/v1/lessons
 * List all lessons with basic info
 */
router.get('/', validateQuery(ListQuerySchema), async (req, res, next) => {
    try {
        const { language } = req.context;
        // Cast query to inferred type
        const { difficulty, tag } = req.query as unknown as z.infer<typeof ListQuerySchema>;

        const filters = {
            difficulty: difficulty as DbDifficulty,
            tags: tag ? [tag] : undefined
        };



        const lessons = await lessonRepository.findAll(filters);

        const response: LessonResponse[] = lessons.map(l => ({
            id: l.id,
            title: l.title ? getLocalizedText(l.title, language) : 'Untitled',
            description: l.description ? getLocalizedText(l.description, language) : '',
            difficulty: l.difficulty,
            estimatedMins: l.estimatedMins,
            conceptCount: l.emojiConcepts.length,
            isCompleted: false, // TODO: integrate with user progress
            emojiConcepts: l.emojiConcepts,
            prerequisites: l.prerequisites,
            tags: l.tags,
            author: l.author,
            version: l.version
        }));

        res.json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/v1/lessons/:id
 * Get full lesson details
 */
router.get('/:id', validateParams(IdParamSchema), async (req, res, next) => {
    try {
        const id = req.params.id as string;
        const { language } = req.context;

        const lesson = await lessonRepository.findById(id);

        if (!lesson) {
            throw ApiError.notFound(`Lesson with ID ${id} not found`);
        }

        const response: LessonDetailsResponse = {
            id: lesson.id,
            title: lesson.title ? getLocalizedText(lesson.title, language) : 'Untitled',
            description: lesson.description ? getLocalizedText(lesson.description, language) : '',
            emojiConcepts: lesson.emojiConcepts,
            difficulty: lesson.difficulty,
            estimatedMins: lesson.estimatedMins,
            prerequisites: lesson.prerequisites,
            steps: [], // Steps fetched separately
            tags: lesson.tags,
            author: lesson.author,
            version: lesson.version,
            conceptCount: lesson.emojiConcepts.length
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/v1/lessons/:id/steps
 * Get steps for a lesson
 */
router.get('/:id/steps', validateParams(IdParamSchema), async (req, res, next) => {
    try {
        const id = req.params.id as string;
        const { language } = req.context;

        // Verify lesson exists
        const lesson = await lessonRepository.findById(id);
        if (!lesson) {
            throw ApiError.notFound(`Lesson ${id}`);
        }

        const steps = await lessonStepRepository.findByLessonId(id);

        const response: LessonStepResponse[] = steps.map(s => ({
            id: s.id,
            stepNumber: s.stepNumber,
            instruction: s.instruction ? getLocalizedText(s.instruction, language) : '',
            emojiCode: s.emojiCode,
            initialCode: s.emojiCode, // Or separate field if exists
            hint: s.hint ? getLocalizedText(s.hint, language) : null,
            expectedOutput: s.expectedOutput ?? null,
            explanation: s.explanation ? getLocalizedText(s.explanation, language) : null
        }));

        res.json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/v1/lessons/:id/validate-step
 * Validate user code submission
 */
router.post('/:id/validate-step', validateParams(IdParamSchema), validateBody(ValidateStepSchema), async (req, res, next) => {
    try {
        const id = req.params.id as string;
        const { stepNumber, userCode } = req.body as z.infer<typeof ValidateStepSchema>;

        // 1. Get Step Criteria
        const step = await lessonStepRepository.findByLessonAndStep(id, stepNumber);
        if (!step) {
            throw ApiError.notFound(`Step ${stepNumber} in lesson ${id}`);
        }

        // 2. Parse & Static Analysis
        const program = parseEmojiProgram(userCode);
        const analysis = validateAndAnalyze(program);

        if (!analysis.valid) {
            res.json({
                valid: false,
                passed: false,
                errors: analysis.errors.map(e => e.message),
                output: []
            } as ValidationResponse);
            return;
        }

        // 3. Execution (VM)
        const vm = new VirtualMachine();
        vm.loadProgram(program.instructions);

        // Safety limits
        const maxCycles = 10000;
        let cycles = 0;
        while (!vm.getState().cpu.halted && cycles < maxCycles) {
            vm.step();
            cycles++;
        }

        const output = vm.getOutput();
        const error = vm.getState().error;

        // 4. Compare Output (Basic String Match for now)
        // TODO: support complex validation logic from step.validationLogic
        let passed = true;
        const validationErrors: string[] = [];

        if (error) {
            passed = false;
            validationErrors.push(`Runtime Error: ${error}`);
        } else if (step.expectedOutput && step.expectedOutput.length > 0) {
            // Check if output matches expected
            const expected = step.expectedOutput; // string[]
            // Simple array comparison
            const isMatch = output.length === expected.length &&
                output.every((val, idx) => val === expected[idx]);

            if (!isMatch) {
                passed = false;
                validationErrors.push(`Output mismatch. Expected: [${expected.join(', ')}], Got: [${output.join(', ')}]`);
            }
        }

        const response: ValidationResponse = {
            valid: true,
            passed,
            errors: validationErrors,
            output,
        };

        res.json(response);

    } catch (err) {
        next(err);
    }
});

export default router;
