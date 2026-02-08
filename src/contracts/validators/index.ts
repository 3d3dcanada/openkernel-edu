/**
 * OpenKernel EDU - Contract Validators
 * Runtime validation functions for contract compliance
 * 
 * @module contracts/validators
 * @version 1.0.0
 */

import {
    EmojiProgram,
    InstructionNode,
    ParseErrorInfo,
    EMOJI_AST_VERSION
} from '../emoji-ast';
import {
    RUNTIME_STATE_VERSION,
    RuntimeSnapshot,
    ResourceLimits,
    DEFAULT_LIMITS
} from '../runtime-state';
import {
    TutorialLesson,
    TutorialStep,
    TUTORIAL_SCHEMA_VERSION
} from '../tutorial-schema';
import {
    AssistantMessage,
    AssistantSession,
    OPENCLAW_PROTOCOL_VERSION
} from '../openclaw-protocol';

// ============= Validation Results =============

export interface ValidationError {
    code: string;
    path: string;
    message: string;
    severity: 'error' | 'warning';
}

export interface ValidationSuccess<T> {
    valid: true;
    data: T;
    warnings: ValidationError[];
}

export interface ValidationFailure {
    valid: false;
    errors: ValidationError[];
    warnings: ValidationError[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

// ============= Program Validators =============

/**
 * Validate an EmojiProgram contract
 */
export function validateProgram(program: unknown): ValidationResult<EmojiProgram> {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!program || typeof program !== 'object') {
        return {
            valid: false,
            errors: [{ code: 'INVALID_TYPE', path: '', message: 'Program must be an object', severity: 'error' }],
            warnings: [],
        };
    }

    const p = program as Record<string, unknown>;

    // Check version
    if (p.version !== EMOJI_AST_VERSION) {
        warnings.push({
            code: 'VERSION_MISMATCH',
            path: 'version',
            message: `Expected version ${EMOJI_AST_VERSION}, got ${p.version}`,
            severity: 'warning',
        });
    }

    // Check required fields
    if (typeof p.source !== 'string') {
        errors.push({
            code: 'MISSING_SOURCE',
            path: 'source',
            message: 'Program must have a source string',
            severity: 'error',
        });
    }

    if (!Array.isArray(p.instructions)) {
        errors.push({
            code: 'MISSING_INSTRUCTIONS',
            path: 'instructions',
            message: 'Program must have an instructions array',
            severity: 'error',
        });
    }

    if (typeof p.valid !== 'boolean') {
        errors.push({
            code: 'MISSING_VALID',
            path: 'valid',
            message: 'Program must have a valid boolean',
            severity: 'error',
        });
    }

    if (errors.length > 0) {
        return { valid: false, errors, warnings };
    }

    return { valid: true, data: program as EmojiProgram, warnings };
}

/**
 * Validate instruction node
 */
export function validateInstruction(instruction: unknown): ValidationResult<InstructionNode> {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!instruction || typeof instruction !== 'object') {
        return {
            valid: false,
            errors: [{ code: 'INVALID_TYPE', path: '', message: 'Instruction must be an object', severity: 'error' }],
            warnings: [],
        };
    }

    const inst = instruction as Record<string, unknown>;

    if (inst.type !== 'instruction') {
        errors.push({
            code: 'INVALID_TYPE',
            path: 'type',
            message: 'Node type must be "instruction"',
            severity: 'error',
        });
    }

    if (typeof inst.opcode !== 'string') {
        errors.push({
            code: 'MISSING_OPCODE',
            path: 'opcode',
            message: 'Instruction must have an opcode string',
            severity: 'error',
        });
    }

    if (!inst.location || typeof inst.location !== 'object') {
        warnings.push({
            code: 'MISSING_LOCATION',
            path: 'location',
            message: 'Instruction should have a location object',
            severity: 'warning',
        });
    }

    if (errors.length > 0) {
        return { valid: false, errors, warnings };
    }

    return { valid: true, data: instruction as InstructionNode, warnings };
}

// ============= Runtime Validators =============

/**
 * Validate RuntimeSnapshot contract
 */
export function validateRuntimeSnapshot(snapshot: unknown): ValidationResult<RuntimeSnapshot> {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!snapshot || typeof snapshot !== 'object') {
        return {
            valid: false,
            errors: [{ code: 'INVALID_TYPE', path: '', message: 'Snapshot must be an object', severity: 'error' }],
            warnings: [],
        };
    }

    const s = snapshot as Record<string, unknown>;

    if (s.version !== RUNTIME_STATE_VERSION) {
        warnings.push({
            code: 'VERSION_MISMATCH',
            path: 'version',
            message: `Expected version ${RUNTIME_STATE_VERSION}`,
            severity: 'warning',
        });
    }

    if (!s.cpu || typeof s.cpu !== 'object') {
        errors.push({
            code: 'MISSING_CPU',
            path: 'cpu',
            message: 'Snapshot must have a cpu object',
            severity: 'error',
        });
    }

    if (!s.memory || typeof s.memory !== 'object') {
        errors.push({
            code: 'MISSING_MEMORY',
            path: 'memory',
            message: 'Snapshot must have a memory object',
            severity: 'error',
        });
    }

    if (errors.length > 0) {
        return { valid: false, errors, warnings };
    }

    return { valid: true, data: snapshot as RuntimeSnapshot, warnings };
}

/**
 * Check if execution is within resource limits
 */
export function validateResourceLimits(
    snapshot: RuntimeSnapshot,
    limits: ResourceLimits = DEFAULT_LIMITS
): ValidationError[] {
    const errors: ValidationError[] = [];

    if (snapshot.stats.cycleCount > limits.maxCycles) {
        errors.push({
            code: 'CYCLE_LIMIT',
            path: 'stats.cycleCount',
            message: `Exceeded max cycles (${limits.maxCycles})`,
            severity: 'error',
        });
    }

    if (snapshot.stack.length > limits.maxStackDepth) {
        errors.push({
            code: 'STACK_LIMIT',
            path: 'stack',
            message: `Exceeded max stack depth (${limits.maxStackDepth})`,
            severity: 'error',
        });
    }

    if (snapshot.output.length > limits.maxOutputLines) {
        errors.push({
            code: 'OUTPUT_LIMIT',
            path: 'output',
            message: `Exceeded max output lines (${limits.maxOutputLines})`,
            severity: 'error',
        });
    }

    return errors;
}

// ============= Tutorial Validators =============

/**
 * Validate TutorialLesson contract
 */
export function validateLesson(lesson: unknown): ValidationResult<TutorialLesson> {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!lesson || typeof lesson !== 'object') {
        return {
            valid: false,
            errors: [{ code: 'INVALID_TYPE', path: '', message: 'Lesson must be an object', severity: 'error' }],
            warnings: [],
        };
    }

    const l = lesson as Record<string, unknown>;

    if (typeof l.id !== 'string' || !l.id.startsWith('lesson-')) {
        errors.push({
            code: 'INVALID_ID',
            path: 'id',
            message: 'Lesson id must start with "lesson-"',
            severity: 'error',
        });
    }

    if (!l.title || typeof l.title !== 'object' || !(l.title as Record<string, unknown>).en) {
        errors.push({
            code: 'MISSING_TITLE',
            path: 'title',
            message: 'Lesson must have a title with at least English (en)',
            severity: 'error',
        });
    }

    if (!Array.isArray(l.steps) || l.steps.length === 0) {
        errors.push({
            code: 'MISSING_STEPS',
            path: 'steps',
            message: 'Lesson must have at least one step',
            severity: 'error',
        });
    }

    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficulties.includes(l.difficulty as string)) {
        errors.push({
            code: 'INVALID_DIFFICULTY',
            path: 'difficulty',
            message: `Difficulty must be one of: ${validDifficulties.join(', ')}`,
            severity: 'error',
        });
    }

    if (errors.length > 0) {
        return { valid: false, errors, warnings };
    }

    return { valid: true, data: lesson as TutorialLesson, warnings };
}

/**
 * Validate TutorialStep contract
 */
export function validateLessonStep(step: unknown): ValidationResult<TutorialStep> {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!step || typeof step !== 'object') {
        return {
            valid: false,
            errors: [{ code: 'INVALID_TYPE', path: '', message: 'Step must be an object', severity: 'error' }],
            warnings: [],
        };
    }

    const s = step as Record<string, unknown>;

    if (typeof s.id !== 'string') {
        errors.push({
            code: 'MISSING_ID',
            path: 'id',
            message: 'Step must have an id',
            severity: 'error',
        });
    }

    if (!s.instruction || typeof s.instruction !== 'object') {
        errors.push({
            code: 'MISSING_INSTRUCTION',
            path: 'instruction',
            message: 'Step must have an instruction object',
            severity: 'error',
        });
    }

    if (typeof s.emojiCode !== 'string') {
        errors.push({
            code: 'MISSING_CODE',
            path: 'emojiCode',
            message: 'Step must have emojiCode',
            severity: 'error',
        });
    }

    if (errors.length > 0) {
        return { valid: false, errors, warnings };
    }

    return { valid: true, data: step as TutorialStep, warnings };
}

// ============= OpenClaw Validators =============

/**
 * Validate AssistantMessage contract
 */
export function validateAssistantMessage(message: unknown): ValidationResult<AssistantMessage> {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!message || typeof message !== 'object') {
        return {
            valid: false,
            errors: [{ code: 'INVALID_TYPE', path: '', message: 'Message must be an object', severity: 'error' }],
            warnings: [],
        };
    }

    const m = message as Record<string, unknown>;

    const validRoles = ['user', 'assistant', 'system'];
    if (!validRoles.includes(m.role as string)) {
        errors.push({
            code: 'INVALID_ROLE',
            path: 'role',
            message: `Role must be one of: ${validRoles.join(', ')}`,
            severity: 'error',
        });
    }

    if (typeof m.content !== 'string') {
        errors.push({
            code: 'MISSING_CONTENT',
            path: 'content',
            message: 'Message must have content string',
            severity: 'error',
        });
    }

    if (typeof m.timestamp !== 'number') {
        warnings.push({
            code: 'MISSING_TIMESTAMP',
            path: 'timestamp',
            message: 'Message should have a timestamp',
            severity: 'warning',
        });
    }

    if (errors.length > 0) {
        return { valid: false, errors, warnings };
    }

    return { valid: true, data: message as AssistantMessage, warnings };
}

/**
 * Validate AssistantSession contract
 */
export function validateAssistantSession(session: unknown): ValidationResult<AssistantSession> {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (!session || typeof session !== 'object') {
        return {
            valid: false,
            errors: [{ code: 'INVALID_TYPE', path: '', message: 'Session must be an object', severity: 'error' }],
            warnings: [],
        };
    }

    const s = session as Record<string, unknown>;

    if (typeof s.id !== 'string') {
        errors.push({
            code: 'MISSING_ID',
            path: 'id',
            message: 'Session must have an id',
            severity: 'error',
        });
    }

    if (!Array.isArray(s.messages)) {
        errors.push({
            code: 'MISSING_MESSAGES',
            path: 'messages',
            message: 'Session must have a messages array',
            severity: 'error',
        });
    }

    if (!s.context || typeof s.context !== 'object') {
        errors.push({
            code: 'MISSING_CONTEXT',
            path: 'context',
            message: 'Session must have a context object',
            severity: 'error',
        });
    }

    if (errors.length > 0) {
        return { valid: false, errors, warnings };
    }

    return { valid: true, data: session as AssistantSession, warnings };
}
