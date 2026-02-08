/**
 * OpenKernel EDU - Examples API Routes
 * 
 * @module api/routes/examples
 */

import { Router } from 'express';
import { z } from 'zod';
import { exampleProgramRepository } from '../../database/repositories';
import { validateParams, validateBody, validateQuery } from '../middleware';
import { ApiError } from '../middleware/error-handler';
import { getLocalizedText } from '../../contracts/tutorial-schema';
import type {
    ExampleResponse,
    CreateExampleRequest
} from '../types/api.types';
import type { DbCategory, DbDifficulty } from '../../database/types';

const router = Router();

// =============================================================================
// SCHEMAS
// =============================================================================

const IdParamSchema = z.object({
    id: z.string().uuid(),
});

const CategoryParamSchema = z.object({
    category: z.enum(['basics', 'algorithms', 'games']),
});

const CreateExampleSchema = z.object({
    title: z.record(z.string(), z.string()),
    description: z.record(z.string(), z.string()),
    emojiCode: z.string().min(1),
    category: z.enum(['basics', 'algorithms', 'games']),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    authorId: z.string().optional(),
    expectedOutput: z.array(z.string()).optional(),
});

const ListQuerySchema = z.object({
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
});

type ListQuery = z.infer<typeof ListQuerySchema>;

// =============================================================================
// ROUTES
// =============================================================================

/**
 * GET /api/v1/examples
 * List examples with filters
 */
router.get('/', validateQuery(ListQuerySchema), async (req, res, next) => {
    try {
        const { language } = req.context;
        // Cast query to validated type
        const query = req.query as unknown as ListQuery;
        const { difficulty, limit, offset } = query;

        const examples = await exampleProgramRepository.findAll(
            { difficulty: difficulty as DbDifficulty },
            { limit, offset }
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: ExampleResponse[] = examples.map((e: any) => ({
            id: e.id,
            title: getLocalizedText(e.title, language),
            description: getLocalizedText(e.description, language),
            emojiCode: e.emojiCode,
            category: e.category,
            difficulty: e.difficulty,
            upvotes: e.upvotes,
            authorId: e.authorId,
            expectedOutput: e.expectedOutput
        }));

        res.json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/v1/examples/:category
 * Filter by category
 */
router.get('/:category', validateParams(CategoryParamSchema), async (req, res, next) => {
    try {
        const category = req.params.category as DbCategory;
        const { language } = req.context;

        const examples = await exampleProgramRepository.findByCategory(category as DbCategory);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: ExampleResponse[] = examples.map((e: any) => ({
            id: e.id,
            title: getLocalizedText(e.title, language),
            description: getLocalizedText(e.description, language),
            emojiCode: e.emojiCode,
            category: e.category,
            difficulty: e.difficulty,
            upvotes: e.upvotes,
            authorId: e.authorId,
            expectedOutput: e.expectedOutput
        }));

        res.json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/v1/examples
 * Community submission
 */
router.post('/', validateBody(CreateExampleSchema), async (req, res, next) => {
    try {
        const { userId } = req.context;
        // Allow anonymous submissions if no userId, or enforce auth?
        // Using userId from context if available, otherwise null or req body

        const data = req.body as CreateExampleRequest;

        const example = await exampleProgramRepository.create({
            ...data,
            authorId: userId || data.authorId
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: ExampleResponse = {
            id: example.id,
            title: getLocalizedText(example.title, 'en'), // Default to en for response if not localized
            description: getLocalizedText(example.description, 'en'),
            emojiCode: example.emojiCode,
            category: example.category,
            difficulty: example.difficulty,
            upvotes: example.upvotes,
            authorId: example.authorId,
            expectedOutput: example.expectedOutput,
        };

        res.status(201).json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * PUT /api/v1/examples/:id/upvote
 * Upvote an example
 */
router.put('/:id/upvote', validateParams(IdParamSchema), async (req, res, next) => {
    try {
        const id = req.params.id as string;
        const { language } = req.context;

        const example = await exampleProgramRepository.upvote(id);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: ExampleResponse = {
            id: example.id,
            title: getLocalizedText(example.title, language),
            description: getLocalizedText(example.description, language),
            emojiCode: example.emojiCode,
            category: example.category,
            difficulty: example.difficulty,
            upvotes: example.upvotes,
            authorId: example.authorId,
            expectedOutput: example.expectedOutput,
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
});

export default router;
