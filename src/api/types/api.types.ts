/**
 * OpenKernel EDU - API Types
 * Request/Response type definitions for REST API
 *
 * @module api/types
 */

import type { SupportedLanguage, MultilingualText } from '../../contracts/tutorial-schema';

// =============================================================================
// COMMON TYPES
// =============================================================================

/**
 * RFC 7807 Problem Details response
 */
export interface ProblemDetails {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    suggestions?: string[];
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
    limit?: number;
    offset?: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    limit: number;
    offset: number;
}

// =============================================================================
// LESSONS API
// =============================================================================

export interface LessonResponse {
    id: string;
    title: string;
    description: string;
    emojiConcepts: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedMins: number;
    prerequisites: string[];
    tags: string[];
    author: string | null;
    version: string;
    conceptCount: number;
}

export interface LessonDetailsResponse extends LessonResponse {
    steps: LessonStepResponse[];
}

export interface LessonStepResponse {
    id: string;
    stepNumber: number;
    instruction: string;
    emojiCode: string;
    expectedOutput: string[] | null;
    hint: string | null;
    explanation: string | null;
}

export interface ValidationResponse {
    valid: boolean;
    passed: boolean;
    errors: string[];
    output: string[];
}

export interface ValidateStepRequest {
    stepNumber: number;
    userCode: string;
}

export interface ValidateStepResponse {
    valid: boolean;
    passed: boolean;
    output: string[];
    errors: Array<{
        line: number;
        column: number;
        message: string;
        suggestion?: string;
    }>;
    stats: {
        instructionCount: number;
        cycleCount: number;
    };
}

// =============================================================================
// PROGRESS API
// =============================================================================

export interface ProgressResponse {
    id: string;
    lessonId: string;
    lessonTitle: string;
    completedSteps: number[];
    currentStep: number;
    startedAt: string;
    completedAt: string | null;
    timeSpentSecs: number;
    hintsUsed: number;
    attempts: number;
}

export interface ProgressStatsResponse {
    totalLessons: number;
    completedLessons: number;
    totalTimeSpent: number;
    totalHintsUsed: number;
    progress: ProgressResponse[];
}

export interface StartLessonRequest {
    userId: string;
}

export interface CompleteStepRequest {
    userId: string;
    stepNumber: number;
    timeSpentSecs?: number;
}

export interface HintResponse {
    stepNumber: number;
    hint: string | null;
    hintsRemaining: number;
}

// =============================================================================
// EXAMPLES API
// =============================================================================

export interface ExampleResponse {
    id: string;
    title: string;
    description: string;
    emojiCode: string;
    category: 'basics' | 'algorithms' | 'games';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    upvotes: number;
    authorId: string | null;
    expectedOutput: string[];
}

export interface CreateExampleRequest {
    title: MultilingualText;
    description: MultilingualText;
    emojiCode: string;
    category: 'basics' | 'algorithms' | 'games';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    authorId?: string;
    expectedOutput?: string[];
}

// =============================================================================
// EXECUTION API
// =============================================================================

export interface ParseRequest {
    code: string;
}

export interface ParseResponse {
    valid: boolean;
    instructions: Array<{
        opcode: string;
        operands: (number | string)[];
        line: number;
        raw: string;
    }>;
    errors: Array<{
        line: number;
        column: number;
        message: string;
        suggestion?: string;
    }>;
    warnings: string[];
    stats: {
        instructionCount: number;
        uniqueOpcodes: number;
        hasLoops: boolean;
        hasConditionals: boolean;
        estimatedCycles: number;
    };
}

export interface RunRequest {
    code: string;
    input?: string[];
    maxCycles?: number;
}

export interface RunResponse {
    success: boolean;
    output: string[];
    error: string | null;
    state: {
        registers: Record<string, number>;
        programCounter: number;
        stackPointer: number;
        flags: {
            zero: boolean;
            negative: boolean;
            overflow: boolean;
        };
        cycleCount: number;
        halted: boolean;
    };
}

export interface StepRequest {
    sessionId?: string;
    code?: string;
    input?: string[];
}

export interface StepResponse {
    sessionId: string;
    running: boolean;
    currentInstruction: {
        opcode: string;
        operands: (number | string)[];
        line: number;
    } | null;
    state: RunResponse['state'];
    output: string[];
    error: string | null;
}

export interface SessionStateResponse {
    sessionId: string;
    createdAt: string;
    lastAccessedAt: string;
    running: boolean;
    state: RunResponse['state'];
    output: string[];
    error: string | null;
}

// =============================================================================
// REQUEST CONTEXT
// =============================================================================

export interface RequestContext {
    language: SupportedLanguage;
    userId?: string;
    requestId: string;
}

declare global {
    namespace Express {
        interface Request {
            context: RequestContext;
        }
    }
}
