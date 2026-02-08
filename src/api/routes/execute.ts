/**
 * OpenKernel EDU - Execution API Routes
 * 
 * @module api/routes/execute
 */

import { Router } from 'express';
import { z } from 'zod';
import { validateBody, validateParams } from '../middleware';
import { executionService } from '../services/execution.service';
import { parseEmojiProgram } from '../../parser/parser';
import { validateAndAnalyze } from '../../parser/validator';
import { ApiError } from '../middleware/error-handler';
import { VirtualMachine } from '../../core/VirtualMachine';
import type {
    ParseRequest,
    ParseResponse,
    RunRequest,
    RunResponse,
    StepRequest,
    StepResponse,
    SessionStateResponse
} from '../types/api.types';

const router = Router();

// =============================================================================
// SCHEMAS
// =============================================================================

const ParseSchema = z.object({
    code: z.string().min(1),
});

const RunSchema = z.object({
    code: z.string().min(1),
    input: z.array(z.string()).optional(),
    maxCycles: z.number().int().min(1).max(10000).optional(),
});

const StepSchema = z.object({
    sessionId: z.string().uuid().optional(),
    code: z.string().min(1).optional(),
    input: z.array(z.string()).optional(),
}).refine(data => data.sessionId || data.code, {
    message: "Either sessionId or code is required",
    path: ["sessionId", "code"]
});

const SessionParams = z.object({
    session_id: z.string().uuid(),
});

// =============================================================================
// ROUTES
// =============================================================================

/**
 * POST /api/v1/execute/parse
 * Parse emoji program and return AST + analysis
 */
router.post('/parse', validateBody(ParseSchema), (req, res, next) => {
    try {
        const { code } = req.body as ParseRequest;

        const program = parseEmojiProgram(code);
        const analysis = validateAndAnalyze(program);

        const response: ParseResponse = {
            valid: analysis.valid,
            instructions: program.instructions.map(i => ({
                opcode: i.opcode,
                operands: i.operands,
                line: i.line,
                raw: i.raw
            })),
            errors: analysis.errors.map(e => ({
                line: e.line,
                column: e.column,
                message: e.message,
                suggestion: e.suggestion
            })),
            warnings: analysis.warnings,
            stats: analysis.stats
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/v1/execute/run
 * Run program to completion (stateless)
 */
router.post('/run', validateBody(RunSchema), (req, res, next) => {
    try {
        const { code, input, maxCycles } = req.body as RunRequest;

        // Validate first
        const program = parseEmojiProgram(code);
        const analysis = validateAndAnalyze(program);

        if (!analysis.valid) {
            throw ApiError.invalidSyntax(
                'Code contains syntax errors',
                analysis.errors.map(e => e.message)
            );
        }

        // Run in new VM
        const vm = new VirtualMachine();
        vm.loadProgram(program.instructions);

        if (input) {
            input.forEach(val => vm.provideInput(val));
        }

        // Capture execution
        try {
            // Note: VM loop limit handled internally by VM class (100k)
            // We can add stricter limit if needed
            vm.run();
        } catch (e) {
            // Runtime error is fine, return state
        }

        const state = vm.getState();

        const response: RunResponse = {
            success: !state.error && !state.running,
            output: vm.getOutput(),
            error: state.error,
            state: {
                registers: state.cpu.registers,
                programCounter: state.cpu.programCounter,
                stackPointer: state.cpu.stackPointer,
                flags: state.cpu.flags,
                cycleCount: state.cpu.cycleCount,
                halted: !state.running
            }
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/v1/execute/step
 * Execute single instruction (stateful)
 */
router.post('/step', validateBody(StepSchema), (req, res, next) => {
    try {
        const { sessionId, code, input } = req.body as StepRequest;

        let currentSessionId = sessionId;

        // Create new session if code provided
        if (code) {
            const session = executionService.createSession(code);
            currentSessionId = session.id;
        }

        if (!currentSessionId) {
            throw ApiError.badRequest('Session ID required (or provide code to start new session)');
        }

        // Execute step
        const session = executionService.stepSession(currentSessionId, input);
        const vmState = session.vm.getState();
        const cpuState = session.vm.getCPU();

        // Get current instruction safely
        const currentInst = session.vm['program'][cpuState.programCounter];

        const response: StepResponse = {
            sessionId: currentSessionId,
            running: !vmState.cpu.halted,
            currentInstruction: currentInst ? {
                opcode: currentInst.opcode,
                operands: currentInst.operands,
                line: currentInst.line
            } : null,
            state: {
                registers: cpuState.registers,
                programCounter: cpuState.programCounter,
                stackPointer: cpuState.stackPointer,
                flags: cpuState.flags,
                cycleCount: cpuState.cycleCount,
                halted: vmState.cpu.halted
            },
            output: session.vm.getOutput(),
            error: vmState.error
        };

        res.json(response);
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/v1/execute/:session_id/state
 * Get session VM state
 */
router.get('/:session_id/state', validateParams(SessionParams), (req, res, next) => {
    try {
        const session_id = req.params.session_id as string;

        const session = executionService.getSession(session_id);
        const state = session.vm.getState();

        const response: SessionStateResponse = {
            sessionId: session.id,
            createdAt: new Date(session.createdAt).toISOString(),
            lastAccessedAt: new Date(session.lastAccessedAt).toISOString(),
            running: !state.cpu.halted,
            state: {
                registers: state.cpu.registers,
                programCounter: state.cpu.programCounter,
                stackPointer: state.cpu.stackPointer,
                flags: state.cpu.flags,
                cycleCount: state.cpu.cycleCount,
                halted: state.cpu.halted
            },
            output: session.vm.getOutput(),
            error: state.error
        };

        res.json(response);

    } catch (err) {
        next(err);
    }
});

export default router;
